import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyUnsubscribeToken } from '../_shared/email.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

// Handles both the /unsubscribe page on the website (JSON body) and RFC 8058 one-click
// unsubscribe POSTs from mail providers (email and token in the query string).
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const url = new URL(req.url);
    let email = url.searchParams.get('email') ?? '';
    let token = url.searchParams.get('token') ?? '';
    if (!email && req.headers.get('content-type')?.includes('application/json')) {
      const body = await req.json();
      email = typeof body.email === 'string' ? body.email : '';
      token = typeof body.token === 'string' ? body.token : '';
    }
    email = email.trim().toLowerCase();

    if (!email || !token || !(await verifyUnsubscribeToken(email, token))) {
      return json({ error: 'This unsubscribe link is invalid or has expired.' }, 400);
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ is_active: false })
      .eq('email', email);
    if (error) throw error;

    return json({ message: 'You have been unsubscribed.' });
  } catch (error) {
    console.error('Error in newsletter-unsubscribe:', error);
    return json({ error: 'Something went wrong. Please try again or email info@charityz.org.' }, 500);
  }
});
