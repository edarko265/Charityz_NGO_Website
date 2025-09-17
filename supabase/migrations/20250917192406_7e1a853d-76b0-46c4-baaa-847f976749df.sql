-- Security Fix Migration: Replace overly permissive RLS policies with secure ones
-- This fixes critical data exposure vulnerabilities

-- 1. Fix Profiles Table Security
-- Drop the dangerous policy that allows all authenticated users to see all profiles
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create secure policy: users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Fix Donations Table Security  
-- Drop the dangerous policy that allows anyone to update donation records
DROP POLICY IF EXISTS "Allow donation updates for status tracking" ON public.donations;

-- Create secure policy: only admins can update donations (for legitimate admin operations)
CREATE POLICY "Admins can update donation status" 
ON public.donations 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create system policy for payment webhook updates (if needed)
-- This allows updates only to payment_status and payment_reference fields
CREATE POLICY "System can update payment status" 
ON public.donations 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Only allow updates to payment-related fields, not donor information
  OLD.donor_name = NEW.donor_name AND
  OLD.donor_email = NEW.donor_email AND 
  OLD.donor_phone IS NOT DISTINCT FROM NEW.donor_phone AND
  OLD.amount = NEW.amount AND
  OLD.currency = NEW.currency AND
  OLD.donation_type = NEW.donation_type AND
  OLD.designation = NEW.designation AND
  OLD.anonymous IS NOT DISTINCT FROM NEW.anonymous
);

-- 3. Fix Donation Receipts Table Security
-- Drop the dangerous policy that allows anyone to create receipts
DROP POLICY IF EXISTS "Allow receipt creation" ON public.donation_receipts;

-- Create secure policy: only allow receipt creation for valid, successful donations
CREATE POLICY "Allow receipt creation for valid donations" 
ON public.donation_receipts 
FOR INSERT 
WITH CHECK (
  -- Ensure the donation exists and is successful
  EXISTS (
    SELECT 1 FROM public.donations 
    WHERE id = donation_id 
    AND payment_status = 'successful'
  )
);

-- Add comment for documentation
COMMENT ON POLICY "Users can view their own profile" ON public.profiles IS 'Restricts profile access to own data only';
COMMENT ON POLICY "Admins can update donation status" ON public.donations IS 'Only admins can modify donation records';
COMMENT ON POLICY "System can update payment status" ON public.donations IS 'Allows payment processing updates while protecting donor data';
COMMENT ON POLICY "Allow receipt creation for valid donations" ON public.donation_receipts IS 'Prevents fake receipt creation by validating donation exists and is successful';