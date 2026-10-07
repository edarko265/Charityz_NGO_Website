import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, jsonResponse, supabaseAdmin, toMinorUnits } from '../_shared/donations.ts';

const DONATION_TYPES = ['one-time', 'monthly', 'quarterly', 'annual'];
const DESIGNATIONS = ['general', 'education', 'healthcare', 'water', 'food', 'emergency'];
const MIN_AMOUNT = 5;
const MAX_AMOUNT = 1_000_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Creates a pending donation server-side and returns what the browser needs to open Paystack.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get('PAYSTACK_PUBLIC_KEY');
    if (!publicKey || !Deno.env.get('PAYSTACK_SECRET_KEY')) {
      console.error('Paystack keys are not configured');
      return jsonResponse({ error: 'Payments are not configured' }, 503);
    }

    const body = await req.json();
    const amount = Math.round(Number(body.amount) * 100) / 100;
    const donorName = clean(body.donorName, 200);
    const donorEmail = clean(body.donorEmail, 254).toLowerCase();
    const donorPhone = clean(body.donorPhone, 30);
    const anonymous = body.anonymous === true;

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return jsonResponse({ error: `Amount must be between GH₵${MIN_AMOUNT} and GH₵${MAX_AMOUNT.toLocaleString()}` }, 400);
    }
    if (!donorName || !EMAIL_RE.test(donorEmail)) {
      return jsonResponse({ error: 'A name and valid email are required' }, 400);
    }
    if (!DONATION_TYPES.includes(body.donationType) || !DESIGNATIONS.includes(body.designation)) {
      return jsonResponse({ error: 'Invalid donation type or designation' }, 400);
    }

    const { data, error } = await supabaseAdmin()
      .from('donations')
      .insert({
        donor_name: anonymous ? 'Anonymous' : donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone || null,
        amount,
        currency: 'GHS',
        donation_type: body.donationType,
        designation: body.designation,
        anonymous,
        payment_status: 'pending',
      })
      .select('id')
      .single();
    if (error) throw error;

    return jsonResponse({
      donationId: data.id,
      reference: data.id,
      publicKey,
      amountInPesewas: toMinorUnits(amount),
      currency: 'GHS',
      email: donorEmail,
    });
  } catch (error) {
    console.error('Error in create-donation:', error);
    return jsonResponse({ error: 'Could not start the donation' }, 500);
  }
});
