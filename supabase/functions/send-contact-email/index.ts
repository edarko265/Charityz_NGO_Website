import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { CONTACT_INBOX, EMAIL_FROM, EMAIL_RE, escapeHtml, resend } from '../_shared/email.ts';
import { allowHit, clientIp } from '../_shared/rate-limit.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUBJECTS: Record<string, string> = {
  general: 'General Inquiry',
  volunteer: 'Volunteer Opportunities',
  donation: 'Donation Questions',
  partnership: 'Partnership Opportunities',
  media: 'Media Inquiry',
  other: 'Other',
};

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders } });

const clean = (input: unknown, maxLength: number) =>
  typeof input === 'string' ? input.trim().slice(0, maxLength) : '';

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 30);
    const organization = clean(body.organization, 150);
    const subject = SUBJECTS[body.subject] ?? '';
    const message = clean(body.message, 5000);

    if (!name || !EMAIL_RE.test(email) || !subject || !message) {
      return json({ error: 'Please fill in your name, a valid email, a subject and your message.' }, 400);
    }

    // 5 messages per visitor per hour, 200 per day overall
    const ip = clientIp(req);
    const [visitorOk, globalOk] = await Promise.all([
      allowHit(supabase, `contact:${ip}`, 5, 3600),
      allowHit(supabase, 'contact:global', 200, 86400),
    ]);
    if (!visitorOk || !globalOk) {
      return json({ error: "You've sent several messages recently. Please wait a while, or email us directly at info@charityz.org." }, 429);
    }

    const rows = [
      ['Name', name],
      ['Email', email],
      ['Phone', phone],
      ['Organization', organization],
      ['Subject', subject],
    ].filter(([, value]) => value)
      .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
      .join('');

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [CONTACT_INBOX],
      replyTo: email,
      subject: `Website contact: ${subject} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New message from the website contact form</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">${rows}</div>
          <h3>Message</h3>
          <p style="background: white; padding: 15px; border-left: 4px solid #dc2626; border-radius: 4px; white-space: pre-wrap;">${escapeHtml(message)}</p>
          <p style="font-size: 12px; color: #6b7280;">Reply to this email to answer ${escapeHtml(name)} directly.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error in send-contact-email:', error);
      return json({ error: 'We could not send your message right now. Please email us at info@charityz.org.' }, 502);
    }

    return json({ message: 'Message sent' });
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return json({ error: 'We could not send your message right now. Please email us at info@charityz.org.' }, 500);
  }
};

serve(handler);
