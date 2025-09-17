import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donationId } = await req.json();

    console.log("Generating receipt for donation:", donationId);

    // Fetch donation details
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donationId)
      .single();

    if (donationError || !donation) {
      throw new Error('Donation not found');
    }

    // Generate receipt number
    const receiptNumber = `CR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create receipt record
    const { data: receipt, error: receiptError } = await supabase
      .from('donation_receipts')
      .insert({
        donation_id: donationId,
        receipt_number: receiptNumber,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (receiptError) {
      throw new Error('Failed to create receipt record');
    }

    // Generate PDF content (simplified HTML template)
    const receiptContent = {
      receiptNumber,
      donorName: donation.donor_name,
      donorEmail: donation.donor_email,
      amount: donation.amount,
      currency: donation.currency,
      donationType: donation.donation_type,
      designation: donation.designation,
      date: new Date(donation.created_at).toLocaleDateString(),
      organizationName: 'CharityZ',
      organizationAddress: '123 Charity Street, Hope City, HC 12345',
      taxId: 'XX-XXXXXXX',
    };

    console.log("Receipt generated successfully:", receiptNumber);

    return new Response(JSON.stringify({ 
      success: true,
      receipt: receiptContent,
      receiptId: receipt.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in donation-receipt-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});