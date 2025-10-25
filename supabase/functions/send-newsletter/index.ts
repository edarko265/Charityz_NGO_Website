import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    // Build email HTML
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">${title}</h1>
        </div>
        
        ${image_url ? `<img src="${image_url}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;" />` : ''}
        
        <div style="line-height: 1.6; color: #374151;">
          ${body.split('\n').map(p => `<p>${p}</p>`).join('')}
        </div>
        
        ${links && links.length > 0 ? `
          <div style="margin: 30px 0;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">Related Links</h3>
            <ul style="list-style: none; padding: 0;">
              ${links.map(link => `
                <li style="margin-bottom: 10px;">
                  <a href="${link.url}" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                    🔗 ${link.text}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p>Thank you for being part of our community!</p>
          <p style="margin: 20px 0;">
            <strong>Charity Z</strong><br>
            Supporting The Needy, Nurturing Dreams
          </p>
          <p style="font-size: 12px; color: #9ca3af;">
            You're receiving this email because you subscribed to our newsletter.<br>
            If you no longer wish to receive these emails, you can unsubscribe at any time.
          </p>
        </div>
      </div>
    `;

    // Prepare email data
    const emailData: any = {
      from: 'Charity Z <info@charityz.org>',
      to: subscribers.map(s => s.email),
      subject: subject,
      html: emailHtml,
    };

    // Add attachment if provided
    if (attachment_url && attachment_name) {
      console.log('Fetching attachment from URL...');
      try {
        const attachmentResponse = await fetch(attachment_url);
        if (!attachmentResponse.ok) {
          throw new Error('Failed to fetch attachment');
        }
        const attachmentBuffer = await attachmentResponse.arrayBuffer();
        const attachmentBase64 = btoa(String.fromCharCode(...new Uint8Array(attachmentBuffer)));
        
        emailData.attachments = [{
          filename: attachment_name,
          content: attachmentBase64,
        }];
      } catch (attachmentError) {
        console.error('Error fetching attachment:', attachmentError);
        // Continue without attachment
      }
    }

    // Send newsletter email
    console.log('Sending newsletter to subscribers...');
    const { data: emailResponse, error: emailError } = await resend.emails.send(emailData);

    if (emailError) {
      console.error('Error sending newsletter:', emailError);
      throw new Error('Failed to send newsletter');
    }

    console.log('Newsletter sent successfully:', emailResponse);

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
        recipient_count: subscribers.length,
      });

    if (saveError) {
      console.error('Error saving newsletter record:', saveError);
      // Don't fail the request if saving fails
    }

    return new Response(
      JSON.stringify({ 
        message: 'Newsletter sent successfully!',
        sent_count: subscribers.length,
        email_id: emailResponse?.id
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
        error: error.message || 'Failed to send newsletter. Please try again.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
