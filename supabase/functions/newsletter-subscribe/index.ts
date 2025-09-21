"use strict";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface SubscriptionRequest {
  email: string;
  preferences?: {
    frequency?: string;
    topics?: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { email, preferences }: SubscriptionRequest = await req.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Processing newsletter subscription for: ${email}`);

    // Check if email is already subscribed
    const { data: existingSubscription, error: checkError } = await supabaseClient
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      throw new Error('Failed to check subscription status');
    }

    let subscriptionData;

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return new Response(
          JSON.stringify({ message: 'Email is already subscribed to our newsletter!' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Reactivate subscription
        const { data, error: updateError } = await supabaseClient
          .from('newsletter_subscriptions')
          .update({
            is_active: true,
            preferences: preferences || { frequency: 'weekly', topics: ['general'] },
            subscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)
          .select()
          .single();

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          throw new Error('Failed to reactivate subscription');
        }
        subscriptionData = data;
      }
    } else {
      // Create new subscription
      const { data, error: insertError } = await supabaseClient
        .from('newsletter_subscriptions')
        .insert({
          email,
          preferences: preferences || { frequency: 'weekly', topics: ['general'] },
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating subscription:', insertError);
        throw new Error('Failed to create subscription');
      }
      subscriptionData = data;
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: 'Charity Z <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to Charity Z Newsletter! 🌟',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Welcome to Charity Z!</h1>
            
            <p>Dear Friend,</p>
            
            <p>Thank you for subscribing to the Charity Z newsletter! We're thrilled to have you join our community of changemakers.</p>
            
            <p>🎯 <strong>What to expect:</strong></p>
            <ul>
              <li>Weekly updates on our latest projects and impact</li>
              <li>Stories from the communities we serve</li>
              <li>Opportunities to get involved and make a difference</li>
              <li>Exclusive invitations to events and fundraisers</li>
            </ul>
            
            <p>Together, we're nurturing dreams and creating positive change across Ghana and beyond.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Stay Connected</h3>
              <p>Follow us on social media for daily updates and behind-the-scenes content!</p>
            </div>
            
            <p>With gratitude,<br>
            <strong>The Charity Z Team</strong></p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              You're receiving this email because you subscribed to our newsletter. 
              If you no longer wish to receive these emails, you can unsubscribe at any time.
            </p>
          </div>
        `,
      });

      console.log(`Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully subscribed to newsletter! Check your email for a welcome message.',
        subscription: subscriptionData 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in newsletter-subscribe function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to subscribe to newsletter. Please try again.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});