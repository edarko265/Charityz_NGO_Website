-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  preferences JSONB DEFAULT '{"frequency": "weekly", "topics": ["general"]}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public newsletter subscription" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Subscribers can view their own subscription" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (email = get_user_email(auth.uid()));

CREATE POLICY "Subscribers can update their own subscription" 
ON public.newsletter_subscriptions 
FOR UPDATE 
USING (email = get_user_email(auth.uid()));

CREATE POLICY "Admins can update subscriptions" 
ON public.newsletter_subscriptions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_newsletter_subscriptions_updated_at
BEFORE UPDATE ON public.newsletter_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();