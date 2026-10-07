import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

export const supabaseAdmin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

export type ConfirmResult =
  | { status: 'successful'; donationId: string; receiptNumber: string }
  | { status: 'pending' | 'failed'; donationId?: string; reason: string };

// Paystack amounts are in the smallest currency unit (pesewas for GHS).
export const toMinorUnits = (amount: number) => Math.round(amount * 100);

/**
 * Confirms a donation with Paystack's API (never trusting the browser or webhook body),
 * checks the amount and currency match what we recorded, then marks it successful and
 * issues a receipt. Safe to call repeatedly for the same reference.
 */
export async function confirmDonation(reference: string): Promise<ConfirmResult> {
  const supabase = supabaseAdmin();

  const { data: donation, error } = await supabase
    .from('donations')
    .select('id, amount, currency, payment_status')
    .eq('id', reference)
    .maybeSingle();
  if (error) throw error;
  if (!donation) return { status: 'failed', reason: 'Unknown donation reference' };

  if (donation.payment_status === 'successful') {
    return { status: 'successful', donationId: donation.id, receiptNumber: await ensureReceipt(donation.id) };
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}` },
  });
  const body = await res.json();
  if (!res.ok || !body.status) {
    return { status: 'pending', donationId: donation.id, reason: body.message || 'Could not verify with Paystack' };
  }

  const tx = body.data;
  if (tx.status !== 'success') {
    if (tx.status === 'failed' || tx.status === 'abandoned') {
      await supabase.from('donations').update({ payment_status: 'failed', payment_reference: tx.reference })
        .eq('id', donation.id).eq('payment_status', 'pending');
      return { status: 'failed', donationId: donation.id, reason: `Payment ${tx.status}` };
    }
    return { status: 'pending', donationId: donation.id, reason: `Payment ${tx.status}` };
  }

  if (tx.amount !== toMinorUnits(Number(donation.amount)) || tx.currency !== donation.currency) {
    console.error('Amount/currency mismatch', { reference, paid: tx.amount, paidCurrency: tx.currency, expected: donation.amount, currency: donation.currency });
    return { status: 'failed', donationId: donation.id, reason: 'Paid amount does not match the donation' };
  }

  const { error: updateError } = await supabase
    .from('donations')
    .update({ payment_status: 'successful', payment_reference: tx.reference })
    .eq('id', donation.id)
    .neq('payment_status', 'successful');
  if (updateError) throw updateError;

  return { status: 'successful', donationId: donation.id, receiptNumber: await ensureReceipt(donation.id) };
}

async function ensureReceipt(donationId: string): Promise<string> {
  const supabase = supabaseAdmin();
  const receiptNumber = `CZ-${new Date().getFullYear()}-${donationId.slice(0, 8).toUpperCase()}`;
  const { error } = await supabase
    .from('donation_receipts')
    .upsert({ donation_id: donationId, receipt_number: receiptNumber }, { onConflict: 'donation_id', ignoreDuplicates: true });
  if (error) throw error;

  const { data } = await supabase.from('donation_receipts').select('receipt_number').eq('donation_id', donationId).single();
  return data?.receipt_number ?? receiptNumber;
}
