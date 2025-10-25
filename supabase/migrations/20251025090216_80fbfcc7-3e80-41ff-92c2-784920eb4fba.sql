-- Create newsletters table to track sent newsletters
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  links JSONB DEFAULT '[]'::jsonb,
  sent_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  recipient_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Admins can view all newsletters
CREATE POLICY "Admins can view all newsletters"
ON newsletters FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can create newsletters
CREATE POLICY "Admins can create newsletters"
ON newsletters FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update newsletters
CREATE POLICY "Admins can update newsletters"
ON newsletters FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete newsletters
CREATE POLICY "Admins can delete newsletters"
ON newsletters FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create index for performance
CREATE INDEX idx_newsletters_sent_at ON newsletters(sent_at DESC);