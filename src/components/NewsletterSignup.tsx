import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsletterSignupProps {
  variant?: "hero" | "footer" | "inline";
  className?: string;
}

const NewsletterSignup = ({ variant = "inline", className = "" }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { 
          email: email.trim(),
          preferences: {
            frequency: 'weekly',
            topics: ['general', 'projects', 'events']
          }
        }
      });

      if (error) {
        console.error('Newsletter subscription error:', error);
        toast.error(error.message || "Failed to subscribe. Please try again.");
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message || "Successfully subscribed to our newsletter!");
      setEmail("");
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hero variant - prominent and centered
  if (variant === "hero") {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Stay Updated with Our Impact
          </h3>
          <p className="text-muted-foreground text-sm">
            Get weekly updates on our projects and community stories
          </p>
        </div>
        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    );
  }

  // Footer variant - compact horizontal layout
  if (variant === "footer") {
    return (
      <div className={`${className}`}>
        <h4 className="font-semibold text-foreground mb-3">Newsletter</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Stay informed about our latest projects and impact stories.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Subscribe
          </Button>
        </form>
      </div>
    );
  }

  // Inline variant - simple horizontal form
  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;