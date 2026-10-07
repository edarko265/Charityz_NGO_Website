import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { confirmDonation, corsHeaders, jsonResponse } from '../_shared/donations.ts';

// Called by the browser after the Paystack popup reports success.
// The payment is checked against Paystack's API, so the browser's word is never trusted.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();
    if (typeof reference !== 'string' || !/^[0-9a-f-]{36}$/i.test(reference)) {
      return jsonResponse({ error: 'Invalid reference' }, 400);
    }

    const result = await confirmDonation(reference);
    return jsonResponse(result);
  } catch (error) {
    console.error('Error in verify-donation:', error);
    return jsonResponse({ error: 'Could not verify the payment' }, 500);
  }
});
