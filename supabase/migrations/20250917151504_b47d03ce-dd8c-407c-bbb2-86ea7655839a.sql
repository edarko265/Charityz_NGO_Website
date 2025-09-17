-- Fix security vulnerability: Restrict profile viewing to authenticated users only
-- Drop the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more secure policy that only allows authenticated users to view profiles
-- and optionally restrict to own profile only (uncomment the auth.uid() = user_id part if needed)
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Alternative: If you want users to only see their own profile, use this instead:
-- CREATE POLICY "Users can view their own profile" 
-- ON public.profiles 
-- FOR SELECT 
-- TO authenticated
-- USING (auth.uid() = user_id);