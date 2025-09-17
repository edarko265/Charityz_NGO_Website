-- Comprehensive Security Fixes for CharityZ
-- Priority 1: Fix Critical Data Exposure and Implement Role-Based Access Control

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'donor', 'volunteer', 'member');

-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = user_uuid 
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1 
      WHEN 'donor' THEN 2 
      WHEN 'volunteer' THEN 3 
      WHEN 'member' THEN 4 
    END 
  LIMIT 1;
$$;

-- Create security definer function to get user email (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = user_uuid;
$$;

-- Create security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, check_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = check_role
  );
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE DONATIONS TABLE
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow all users to view donations" ON public.donations;
DROP POLICY IF EXISTS "Allow donors to view their donations" ON public.donations;

-- Create secure policies for donations
CREATE POLICY "Admins can view all donations" 
ON public.donations 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Donors can view their own donations" 
ON public.donations 
FOR SELECT 
TO authenticated
USING (donor_email = public.get_user_email(auth.uid()));

CREATE POLICY "Admins can update donations" 
ON public.donations 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE DONORS TABLE  
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow all users to view donors" ON public.donors;
DROP POLICY IF EXISTS "Allow donor updates" ON public.donors;

-- Create secure policies for donors
CREATE POLICY "Admins can view all donors" 
ON public.donors 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Donors can view their own profile" 
ON public.donors 
FOR SELECT 
TO authenticated
USING (email = public.get_user_email(auth.uid()));

CREATE POLICY "Admins can update donor data" 
ON public.donors 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE DONATION RECEIPTS TABLE
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow receipt viewing" ON public.donation_receipts;

-- Create secure policies for donation receipts
CREATE POLICY "Admins can view all receipts" 
ON public.donation_receipts 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Donors can view their own receipts" 
ON public.donation_receipts 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.donations d 
    WHERE d.id = donation_id 
    AND d.donor_email = public.get_user_email(auth.uid())
  )
);

-- SECURE VOLUNTEERS TABLE
-- Update existing policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users can view volunteers" ON public.volunteers;

CREATE POLICY "Admins can view all volunteers" 
ON public.volunteers 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Volunteers can view their own data" 
ON public.volunteers 
FOR SELECT 
TO authenticated
USING (email = public.get_user_email(auth.uid()));

-- Update volunteer update policy
DROP POLICY IF EXISTS "Volunteers can update their own data" ON public.volunteers;

CREATE POLICY "Volunteers can update their own data" 
ON public.volunteers 
FOR UPDATE 
TO authenticated
USING (email = public.get_user_email(auth.uid()));

CREATE POLICY "Admins can update volunteer data" 
ON public.volunteers 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- SECURE MEMBERS TABLE
-- Update existing policies to be more explicit
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;
DROP POLICY IF EXISTS "Members can update their own data" ON public.members;

CREATE POLICY "Admins can view all members" 
ON public.members 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can view their own data" 
ON public.members 
FOR SELECT 
TO authenticated
USING (email = public.get_user_email(auth.uid()));

CREATE POLICY "Members can update their own data" 
ON public.members 
FOR UPDATE 
TO authenticated
USING (email = public.get_user_email(auth.uid()));

CREATE POLICY "Admins can update member data" 
ON public.members 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add indexes for better performance on security queries
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_donations_donor_email_status ON public.donations(donor_email, payment_status);

-- Create function to assign default roles when users sign up
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Assign 'donor' role by default to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'donor');
  RETURN NEW;
END;
$$;

-- Create trigger to assign default role on user creation
CREATE TRIGGER assign_user_role_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_role();

COMMENT ON TABLE public.user_roles IS 'Role-based access control for users';
COMMENT ON FUNCTION public.get_user_role IS 'Security definer function to get user role without RLS recursion';
COMMENT ON FUNCTION public.has_role IS 'Security definer function to check if user has specific role';