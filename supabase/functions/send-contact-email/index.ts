import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Input sanitization helpers
function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

function sanitizeEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.trim().toLowerCase();
  return emailRegex.test(sanitized) ? sanitized : '';
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Input validation and sanitization
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedSubject = sanitizeString(subject, 200);
    const sanitizedMessage = sanitizeString(message, 5000);

    if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedMessage) {
      return new Response(
        JSON.stringify({ error: 'Invalid input. Please check all fields.' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      )
    }

    console.log("Sending contact email from:", sanitizedEmail);

    const emailResponse = await resend.emails.send({
      from: "CharityZ <noreply@resend.dev>",
      to: ["contact@charityz.org"],
      subject: `Contact Form: ${sanitizedSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${escapeHtml(sanitizedName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(sanitizedSubject)}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3>Message:</h3>
            <p style="background: white; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
              ${escapeHtml(sanitizedMessage).replace(/\n/g, '<br>')}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);