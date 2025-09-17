-- Fix RLS policies and add profiles table

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for existing tables
CREATE POLICY "Allow all users to view donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Allow donation updates for status tracking" ON public.donations FOR UPDATE USING (true);

CREATE POLICY "Allow all users to view donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Allow donor updates" ON public.donors FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can view members" ON public.members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Members can update their own data" ON public.members FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Authenticated users can view volunteers" ON public.volunteers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Volunteers can update their own data" ON public.volunteers FOR UPDATE USING (auth.uid()::text = id::text);

-- Create function for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for auto-profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add trigger for profile timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_donor_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Only update stats for successful donations
    IF NEW.payment_status = 'successful' THEN
        INSERT INTO donors (name, email, phone, total_donated, donation_count)
        VALUES (NEW.donor_name, NEW.donor_email, NEW.donor_phone, NEW.amount, 1)
        ON CONFLICT (email) 
        DO UPDATE SET
            total_donated = donors.total_donated + NEW.amount,
            donation_count = donors.donation_count + 1,
            updated_at = timezone('utc'::text, now());
    END IF;
    
    RETURN NEW;
END;
$$;