import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input sanitization helper
function sanitizeMessage(message: string): string {
  if (typeof message !== 'string') return '';
  // Limit message length and remove potentially harmful content
  return message.trim().slice(0, 2000).replace(/[<>]/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Input validation and sanitization
    const sanitizedMessage = sanitizeMessage(message);
    
    if (!sanitizedMessage) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid or empty message',
          reply: "Please provide a valid message to get assistance." 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log("Received chatbot message:", sanitizedMessage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a helpful AI assistant for Charity Z, a Ghanaian charity organization focused on supporting the needy and nurturing dreams in communities across Ghana and beyond.

            WEBSITE NAVIGATION & INFORMATION:
            - Home page: Overview of Charity Z, hero section, about summary, featured projects
            - About page: Detailed mission, vision, team information, organizational history
            - Projects page: Current initiatives including clean water, education, healthcare, and community development projects
            - Get Involved page: Donation form (Paystack integration, GHS currency), volunteer signup, membership registration
            - Events page: Upcoming fundraising events, community gatherings, awareness campaigns
            - Contact page: Office locations, phone numbers, email addresses, contact form
            - Dashboard: Personalized area for donors, volunteers, and members to track their involvement
            - FAQ page: Common questions about donations, volunteering, and organizational operations
            
            CHARITY Z INFORMATION:
            - Currency: Ghana Cedis (GH₵) - all donations and financial information use GHS
            - Mission: Creating positive change through compassionate action and sustainable community development
            - Focus Areas: Education, healthcare, clean water access, emergency relief, community empowerment
            - Payment: Secure Paystack integration for donations, supporting local and international payments
            - Volunteer opportunities: Field work, administrative support, event planning, skill-based volunteering
            - Membership benefits: Monthly newsletters, voting on initiatives, exclusive events, community recognition
            
            RESPONSE GUIDELINES:
            - Be warm, encouraging, and professional
            - Provide specific navigation guidance based on user location
            - Include relevant links or page suggestions when helpful
            - Encourage active participation (donations, volunteering, membership)
            - Use Ghana-specific context when appropriate
            - Keep responses concise but comprehensive
            - If users ask about specific amounts, mention GHS currency
            - Promote transparency about how donations are used` 
          },
          { role: 'user', content: sanitizedMessage }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log("Generated AI response:", reply);

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: "I apologize, but I'm having trouble processing your message right now. Please try again later or contact our team directly." 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});