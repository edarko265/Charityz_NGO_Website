import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { allowHit, clientIp } from '../_shared/rate-limit.ts';
import Anthropic from 'npm:@anthropic-ai/sdk@^0.131.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const MODEL = 'claude-haiku-4-5'; // cheapest Claude model; fine for short website Q&A
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 12;
// Abuse protection for a public, unauthenticated endpoint
const PER_VISITOR_LIMIT = 20;          // messages per visitor...
const PER_VISITOR_WINDOW_SECONDS = 600; // ...per 10 minutes
const GLOBAL_DAILY_LIMIT = 2000;       // messages per day across all visitors

const SYSTEM_PROMPT = `You are the website assistant for Charity Z, a Ghanaian charity supporting the needy and nurturing dreams in communities across Ghana and beyond. You help visitors find their way around the website and take part: donating, volunteering, or becoming a member.

Website pages:
- Home (/): overview, featured projects, newsletter signup
- About (/about): mission, vision, team and history
- Projects (/projects): current initiatives in education, healthcare, clean water and community development, with progress and funding
- Get Involved (/get-involved): donation form, volunteer signup, membership registration
- Events (/events): fundraising events, community gatherings, awareness campaigns
- FAQ (/faq): common questions about donations, volunteering and how we operate
- Contact (/contact): contact form and office details
- Dashboard (/dashboard): signed-in donors, volunteers and members can track their involvement
- Transparency (/transparency) and Reports (/reports): how funds are used, annual reports

Key facts:
- All amounts are in Ghana cedis (GH₵). The minimum donation is GH₵5.
- Donations are processed securely by Paystack, by card or mobile money (MTN, Telecel, AirtelTigo). Each donation is a single payment; automatic recurring payments are not available yet, so regular donors give again each time. Donors can choose to donate anonymously.
- Focus areas: education, healthcare, clean water, food security, emergency relief, community empowerment.
- Volunteering includes field work, administrative support, event planning and skills-based roles.
- Contact: info@charityz.org, +233 246 381 145, 2 Benjy's Lodge, McCarty Hill, Accra, Ghana.

How to respond:
- Be warm, encouraging and concise: a few short sentences or a short list is usually enough. Write plain text without markdown headings or tables, since replies appear in a small chat window.
- When pointing someone to a page, name it plainly (for example "our donation form on the Get Involved page"); the chat window adds navigation buttons automatically.
- Only state facts given above or that the visitor tells you. For anything else, such as specific project figures, event dates, or questions about a particular donation, suggest the relevant page or contacting the team rather than guessing.
- Stay on topics related to Charity Z and its work. Politely decline unrelated requests.`;

const PAGE_CONTEXTS: Record<string, string> = {
  '/': 'the home page',
  '/about': 'the About page',
  '/projects': 'the Projects page',
  '/get-involved': 'the Get Involved page (donation form, volunteer signup, membership)',
  '/donate': 'the donation form',
  '/volunteer': 'the volunteer signup',
  '/membership': 'the membership registration',
  '/events': 'the Events page',
  '/contact': 'the Contact page',
  '/faq': 'the FAQ page',
  '/dashboard': 'their personal dashboard',
  '/auth': 'the sign-in page',
  '/transparency': 'the Transparency page',
  '/reports': 'the Reports page',
};

const FALLBACK_REPLY = "I'm sorry, I can't help with that right now. Please try again in a moment, or contact our team at info@charityz.org.";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

const clean = (text: unknown) => (typeof text === 'string' ? text.trim().slice(0, MAX_MESSAGE_CHARS) : '');

// Accepts prior turns from the browser, keeping only well-formed, alternating user/assistant text.
function buildMessages(history: unknown, message: string): Anthropic.MessageParam[] {
  const turns: Anthropic.MessageParam[] = [];
  if (Array.isArray(history)) {
    for (const item of history.slice(-MAX_HISTORY_MESSAGES)) {
      const role = item?.role;
      const content = clean(item?.content);
      if ((role !== 'user' && role !== 'assistant') || !content) continue;
      if (turns.length === 0 && role !== 'user') continue;
      if (turns.length > 0 && turns[turns.length - 1].role === role) continue;
      turns.push({ role, content });
    }
  }
  if (turns.length > 0 && turns[turns.length - 1].role === 'user') turns.pop();
  turns.push({ role: 'user', content: message });
  return turns;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history, path } = await req.json();
    const userMessage = clean(message);
    if (!userMessage) {
      return json({ error: 'Invalid or empty message', reply: 'Please type a question and I will do my best to help.' }, 400);
    }

    const [visitorOk, globalOk] = await Promise.all([
      allowHit(supabase, `chatbot:${clientIp(req)}`, PER_VISITOR_LIMIT, PER_VISITOR_WINDOW_SECONDS),
      allowHit(supabase, 'global', GLOBAL_DAILY_LIMIT, 86400),
    ]);
    if (!visitorOk || !globalOk) {
      return json({
        error: 'rate_limited',
        reply: "You've sent a lot of messages in a short time. Please wait a few minutes, or contact our team at info@charityz.org.",
      }, 429);
    }

    const messages = buildMessages(history, userMessage);
    // Page context comes from a server-side allowlist, never from the visitor's text
    const page = typeof path === 'string' ? PAGE_CONTEXTS[path] : undefined;
    const system: Anthropic.TextBlockParam[] = [{ type: 'text', text: SYSTEM_PROMPT }];
    if (page) system.push({ type: 'text', text: `The visitor is currently viewing ${page}.` });

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages,
    });

    if (response.stop_reason === 'refusal') {
      console.warn('Chatbot request declined');
      return json({ reply: FALLBACK_REPLY });
    }

    const reply = response.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('')
      .trim();

    return json({ reply: reply || FALLBACK_REPLY });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      console.error('Anthropic rate limit:', error.message);
    } else if (error instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${error.status}:`, error.message);
    } else {
      console.error('Error in ai-chatbot function:', error);
    }
    return json({
      error: 'chatbot_unavailable',
      reply: "I'm having trouble answering right now. Please try again later or contact our team at info@charityz.org.",
    }, 503);
  }
});
