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

-- Create secure admin-only update policy
CREATE POLICY "Admins can update donation status" 
ON public.donations 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

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
COMMENT ON POLICY "Allow receipt creation for valid donations" ON public.donation_receipts IS 'Prevents fake receipt creation by validating donation exists and is successful';