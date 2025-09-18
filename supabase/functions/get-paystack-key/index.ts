import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Paystack public key from environment variables
    const paystackPublicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY');
    
    if (!paystackPublicKey) {
      throw new Error('Paystack public key not configured');
    }

    console.log("Providing Paystack public key for secure payment processing");

    return new Response(JSON.stringify({ 
      publicKey: paystackPublicKey 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-paystack-key function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve payment configuration' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});