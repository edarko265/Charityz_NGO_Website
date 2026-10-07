import { Resend } from 'npm:resend@^6.32.1';

export const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Senders must be on a domain verified in Resend; each can be overridden with a secret of the same name.
// Website notifications to staff (replies go to the visitor via replyTo).
export const EMAIL_FROM = Deno.env.get('EMAIL_FROM') ?? 'Charity Z Website <noreply@charityz.org>';
// Newsletters and welcome emails to supporters; replies go to the team's inbox.
export const NEWSLETTER_FROM = Deno.env.get('NEWSLETTER_FROM') ?? 'Charity Z <updates@charityz.org>';
export const NEWSLETTER_REPLY_TO = Deno.env.get('NEWSLETTER_REPLY_TO') ?? 'info@charityz.org';
// Where contact-form messages are delivered. Override with the CONTACT_INBOX secret.
export const CONTACT_INBOX = Deno.env.get('CONTACT_INBOX') ?? 'info@charityz.org';
export const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://www.charityz.org').replace(/\/$/, '');

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/** Returns the URL if it is an absolute http(s) URL, otherwise null. */
export function safeUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

async function hmac(text: string): Promise<string> {
  const secret = Deno.env.get('NEWSLETTER_UNSUBSCRIBE_SECRET');
  if (!secret) throw new Error('NEWSLETTER_UNSUBSCRIBE_SECRET is not set');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Signed token so only the recipient's own link can unsubscribe their address. */
export const unsubscribeToken = (email: string) => hmac(`unsubscribe:${email.toLowerCase()}`);

export async function verifyUnsubscribeToken(email: string, token: string): Promise<boolean> {
  const expected = await unsubscribeToken(email);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

/** Page link for the email footer, plus the RFC 8058 one-click URL for the List-Unsubscribe header. */
export async function unsubscribeLinks(email: string) {
  const params = new URLSearchParams({ email: email.toLowerCase(), token: await unsubscribeToken(email) });
  return {
    page: `${SITE_URL}/unsubscribe?${params}`,
    oneClick: `${Deno.env.get('SUPABASE_URL')}/functions/v1/newsletter-unsubscribe?${params}`,
  };
}

export async function unsubscribeHeaders(email: string): Promise<Record<string, string>> {
  const { oneClick } = await unsubscribeLinks(email);
  return { 'List-Unsubscribe': `<${oneClick}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' };
}

export const footerHtml = (unsubscribeUrl: string) => `
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
  <p style="font-size: 12px; color: #6b7280; text-align: center;">
    You're receiving this email because you subscribed to the Charity Z newsletter.<br>
    <a href="${escapeHtml(unsubscribeUrl)}" style="color: #6b7280;">Unsubscribe</a>
  </p>`;
