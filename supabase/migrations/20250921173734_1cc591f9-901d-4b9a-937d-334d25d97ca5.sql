-- Fix RLS policies for newsletter subscriptions to allow public signup

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.newsletter_subscriptions;

-- Create public policies for newsletter subscriptions
-- Anyone can subscribe (no auth required)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading own subscriptions (for authenticated users)
CREATE POLICY "Users can view own subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE auth.uid()::text = user_id
  END
);

-- Only allow updating own subscriptions (for authenticated users)  
CREATE POLICY "Users can update own subscriptions"
ON public.newsletter_subscriptions
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);