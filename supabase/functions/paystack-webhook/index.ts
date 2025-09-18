import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify Paystack webhook signature
async function verifySignature(payload: string, signature: string): Promise<boolean> {
  if (!signature || !paystackSecretKey) return false;
  
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );
    
    const payloadBuffer = encoder.encode(payload);
    const expectedSignature = await crypto.subtle.sign('HMAC', key, payloadBuffer);
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return signature === expectedHex;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-paystack-signature');
    const payload = await req.text();
    
    console.log('Received webhook from Paystack');
    
    // Verify webhook signature for security
    if (!signature || !await verifySignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const event = JSON.parse(payload);
    console.log('Webhook event type:', event.event);
    
    // Handle successful charge
    if (event.event === 'charge.success') {
      const { data } = event;
      const donationId = data.metadata?.donation_id;
      
      if (!donationId) {
        console.error('No donation ID in webhook payload');
        return new Response(JSON.stringify({ error: 'Missing donation ID' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Update donation status to successful
      const { error: updateError } = await supabase
        .from('donations')
        .update({ 
          payment_status: 'successful',
          payment_reference: data.reference,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId);
      
      if (updateError) {
        console.error('Error updating donation:', updateError);
        throw updateError;
      }
      
      // Generate receipt
      const receiptNumber = `CR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const { error: receiptError } = await supabase
        .from('donation_receipts')
        .insert({
          donation_id: donationId,
          receipt_number: receiptNumber,
          generated_at: new Date().toISOString(),
        });
      
      if (receiptError) {
        console.error('Error creating receipt:', receiptError);
      } else {
        console.log('Receipt generated successfully:', receiptNumber);
      }
      
      console.log('Successfully processed payment for donation:', donationId);
    }
    
    // Handle failed charge
    if (event.event === 'charge.failed') {
      const { data } = event;
      const donationId = data.metadata?.donation_id;
      
      if (donationId) {
        const { error: updateError } = await supabase
          .from('donations')
          .update({ 
            payment_status: 'failed',
            payment_reference: data.reference,
            updated_at: new Date().toISOString()
          })
          .eq('id', donationId);
        
        if (updateError) {
          console.error('Error updating failed donation:', updateError);
        } else {
          console.log('Marked donation as failed:', donationId);
        }
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in paystack-webhook function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});