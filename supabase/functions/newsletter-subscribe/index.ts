import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO, EMAIL_RE, footerHtml, resend, unsubscribeHeaders, unsubscribeLinks } from '../_shared/email.ts';
import { allowHit, clientIp } from '../_shared/rate-limit.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_PREFERENCES = { frequency: 'weekly', topics: ['general'] };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
    if (!EMAIL_RE.test(email)) {
      return json({ error: 'Please provide a valid email address' }, 400);
    }
    const preferences = body.preferences && typeof body.preferences === 'object'
      ? { frequency: String(body.preferences.frequency ?? 'weekly').slice(0, 20), topics: Array.isArray(body.preferences.topics) ? body.preferences.topics.slice(0, 10).map((t: unknown) => String(t).slice(0, 30)) : ['general'] }
      : DEFAULT_PREFERENCES;

    // Each signup sends an email, so limit how often one visitor can trigger it
    const [visitorOk, addressOk] = await Promise.all([
      allowHit(supabase, `subscribe:${clientIp(req)}`, 5, 3600),
      allowHit(supabase, `subscribe-email:${email}`, 3, 86400),
    ]);
    if (!visitorOk || !addressOk) {
      return json({ error: 'Too many signup attempts. Please try again later.' }, 429);
    }

    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', email)
      .maybeSingle();
    if (checkError) throw checkError;

    if (existing?.is_active) {
      return json({ message: 'You are already subscribed to our newsletter!' });
    }

    const { error: saveError } = existing
      ? await supabase.from('newsletter_subscriptions')
        .update({ is_active: true, preferences, subscribed_at: new Date().toISOString() })
        .eq('id', existing.id)
      : await supabase.from('newsletter_subscriptions').insert({ email, preferences });
    if (saveError) throw saveError;

    // The subscription stands even if the welcome email fails
    const { page } = await unsubscribeLinks(email);
    const { error: emailError } = await resend.emails.send({
      from: NEWSLETTER_FROM,
          replyTo: NEWSLETTER_REPLY_TO,
      to: [email],
      subject: 'Welcome to the Charity Z newsletter',
      headers: await unsubscribeHeaders(email),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; text-align: center;">Welcome to Charity Z!</h1>
          <p>Dear Friend,</p>
          <p>Thank you for subscribing to the Charity Z newsletter! We're thrilled to have you join our community of changemakers.</p>
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>Updates on our latest projects and impact</li>
            <li>Stories from the communities we serve</li>
            <li>Opportunities to get involved and make a difference</li>
            <li>Invitations to events and fundraisers</li>
          </ul>
          <p>Together, we're nurturing dreams and creating positive change across Ghana and beyond.</p>
          <p>With gratitude,<br><strong>The Charity Z Team</strong></p>
          ${footerHtml(page)}
        </div>
      `,
    });
    if (emailError) console.error('Welcome email failed:', emailError);

    return json({ message: 'Successfully subscribed! Check your email for a welcome message.' });
  } catch (error) {
    console.error('Error in newsletter-subscribe function:', error);
    return json({ error: 'Failed to subscribe to the newsletter. Please try again.' }, 500);
  }
});
