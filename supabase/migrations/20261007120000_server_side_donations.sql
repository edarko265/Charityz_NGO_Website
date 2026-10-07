-- Donations and receipts are now written only by Edge Functions (service role):
-- create-donation inserts pending donations, verify-donation / paystack-webhook confirm
-- them against Paystack's API. Remove the public write paths that allowed fake
-- "successful" donations and receipts.
DROP POLICY IF EXISTS "Allow public donation creation" ON public.donations;
DROP POLICY IF EXISTS "Allow receipt creation for valid donations" ON public.donation_receipts;

-- One receipt per donation, so webhook retries and the browser check cannot duplicate it.
ALTER TABLE public.donation_receipts
  ADD CONSTRAINT donation_receipts_donation_id_key UNIQUE (donation_id);

-- Donations are always in Ghana cedis.
ALTER TABLE public.donations ALTER COLUMN currency SET DEFAULT 'GHS';
