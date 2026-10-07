import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO, escapeHtml, footerHtml, resend, safeUrl, unsubscribeHeaders, unsubscribeLinks } from '../_shared/email.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterRequest {
  title: string;
  subject: string;
  body: string;
  image_url?: string;
  links?: Array<{ text: string; url: string }>;
  attachment_url?: string;
  attachment_name?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is an admin
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      user_uuid: user.id,
      check_role: 'admin'
    });

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { title, subject, body, image_url, links, attachment_url, attachment_name }: NewsletterRequest = await req.json();

    // Validate required fields
    if (!title || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Title, subject, and body are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Fetching active newsletter subscribers...');

    // Use service role to fetch subscribers
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .select('email')
      .eq('is_active', true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      throw new Error('Failed to fetch subscribers');
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active subscribers found', sent_count: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Found ${subscribers.length} active subscribers`);

    const safeTitle = escapeHtml(title);
    const imageUrl = safeUrl(image_url);
    const attachmentUrl = safeUrl(attachment_url);
    const safeLinks = (links ?? [])
      .map((link) => ({ url: safeUrl(link?.url), text: escapeHtml(String(link?.text ?? '')) }))
      .filter((link): link is { url: string; text: string } => !!link.url && !!link.text);

    // Shared body; each recipient gets their own unsubscribe footer
    const contentHtml = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin-bottom: 10px;">${safeTitle}</h1>
        </div>
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${safeTitle}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;" />` : ''}
        <div style="line-height: 1.6; color: #374151;">
          ${body.split('\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
        ${safeLinks.length > 0 ? `
          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">Related Links</h3>
            <ul style="list-style: none; padding: 0;">
              ${safeLinks.map(link => `<li style="margin-bottom: 10px;"><a href="${escapeHtml(link.url)}" style="color: #dc2626; font-weight: 500;">${link.text}</a></li>`).join('')}
            </ul>
          </div>` : ''}
        ${attachmentUrl ? `
          <p style="margin: 30px 0; text-align: center;">
            <a href="${escapeHtml(attachmentUrl)}" style="background: #dc2626; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none;">
              Download ${escapeHtml(attachment_name || 'attachment')}
            </a>
          </p>` : ''}
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p>Thank you for being part of our community!</p>
          <p style="margin: 20px 0;"><strong>Charity Z</strong><br>Supporting The Needy, Nurturing Dreams</p>
        </div>`;

    // One email per subscriber (never expose the list), sent through Resend's batch API in groups of 100
    console.log('Sending newsletter to subscribers...');
    let sentCount = 0;
    for (let i = 0; i < subscribers.length; i += 100) {
      const chunk = subscribers.slice(i, i + 100);
      const emails = await Promise.all(chunk.map(async ({ email }) => {
        const { page } = await unsubscribeLinks(email);
        return {
          from: NEWSLETTER_FROM,
          replyTo: NEWSLETTER_REPLY_TO,
          to: [email],
          subject,
          headers: await unsubscribeHeaders(email),
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">${contentHtml}${footerHtml(page)}</div>`,
        };
      }));

      const { error: batchError } = await resend.batch.send(emails);
      if (batchError) {
        console.error(`Newsletter batch starting at ${i} failed:`, batchError);
        if (sentCount === 0) throw new Error('Failed to send newsletter');
        break;
      }
      sentCount += chunk.length;
    }

    // Save newsletter record
    const { error: saveError } = await supabaseAdmin
      .from('newsletters')
      .insert({
        title,
        subject,
        body,
        image_url,
        links: links || [],
        attachment_url,
        attachment_name,
        sent_by: user.id,
        recipient_count: sentCount,
      });

    if (saveError) {
      console.error('Error saving newsletter record:', saveError);
      // Don't fail the request if saving fails
    }

    return new Response(
      JSON.stringify({ 
        message: sentCount === subscribers.length ? 'Newsletter sent successfully!' : 'Newsletter partly sent; check the function logs.',
        sent_count: sentCount
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-newsletter function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send newsletter. Please try again.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
