-- Baseline: core tables that were originally created by hand in the SQL editor
-- (previously src/database-schema.sql). Must run before all other migrations.

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    donation_type TEXT NOT NULL CHECK (donation_type IN ('one-time', 'monthly', 'quarterly', 'annual')),
    designation TEXT NOT NULL CHECK (designation IN ('general', 'education', 'healthcare', 'water', 'food', 'emergency')),
    anonymous BOOLEAN DEFAULT false,
    payment_reference TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'successful', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create donors table for tracking donor information
CREATE TABLE IF NOT EXISTS public.donors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    total_donated DECIMAL(10,2) DEFAULT 0,
    donation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create donation receipts table
CREATE TABLE IF NOT EXISTS public.donation_receipts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE,
    receipt_number TEXT UNIQUE NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pdf_url TEXT
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS public.volunteers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    areas_of_interest TEXT[],
    availability TEXT,
    skills_experience TEXT,
    background_check BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    organization TEXT,
    membership_type TEXT NOT NULL CHECK (membership_type IN ('individual', 'student', 'senior', 'corporate')),
    referral_source TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    membership_fee_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON public.donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donors_email ON public.donors(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON public.volunteers(email);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Allow public insert for donations (donation form)
CREATE POLICY "Allow public donation creation" ON public.donations
    FOR INSERT WITH CHECK (true);

-- Allow public read of donations for dashboard (filtered by email)
CREATE POLICY "Allow donors to view their donations" ON public.donations
    FOR SELECT USING (true);

-- Allow public insert for volunteers
CREATE POLICY "Allow public volunteer registration" ON public.volunteers
    FOR INSERT WITH CHECK (true);

-- Allow public insert for members
CREATE POLICY "Allow public member registration" ON public.members
    FOR INSERT WITH CHECK (true);

-- Allow public insert for donation receipts
CREATE POLICY "Allow receipt creation" ON public.donation_receipts
    FOR INSERT WITH CHECK (true);

-- Allow public read of donation receipts
CREATE POLICY "Allow receipt viewing" ON public.donation_receipts
    FOR SELECT USING (true);

-- Function to update donor statistics
CREATE OR REPLACE FUNCTION public.update_donor_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update stats for successful donations
    IF NEW.payment_status = 'successful' THEN
        INSERT INTO public.donors (name, email, phone, total_donated, donation_count)
        VALUES (NEW.donor_name, NEW.donor_email, NEW.donor_phone, NEW.amount, 1)
        ON CONFLICT (email) 
        DO UPDATE SET
            total_donated = donors.total_donated + NEW.amount,
            donation_count = donors.donation_count + 1,
            updated_at = timezone('utc'::text, now());
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update donor stats when donation status changes
CREATE TRIGGER update_donor_stats_trigger 
    AFTER UPDATE ON public.donations
    FOR EACH ROW 
    WHEN (OLD.payment_status != NEW.payment_status AND NEW.payment_status = 'successful')
    EXECUTE FUNCTION public.update_donor_stats();

-- Initial admin user setup (optional)
-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES ('admin@charityz.org', crypt('your-admin-password', gen_salt('bf')), now(), now(), now());

COMMENT ON TABLE public.donations IS 'Stores all donation records with payment tracking';
COMMENT ON TABLE public.donors IS 'Aggregated donor information and statistics';
COMMENT ON TABLE public.donation_receipts IS 'Receipt generation tracking';
COMMENT ON TABLE public.volunteers IS 'Volunteer application and management';
COMMENT ON TABLE public.members IS 'Membership application and management';