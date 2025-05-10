
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if we have an API key
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }

    // Parse request body
    const { prompt, category = "general" } = await req.json();

    // Prepare system message based on category
    let systemMessage = "You are a helpful AI health assistant. Provide accurate information but clarify you're not a replacement for professional medical advice.";
    
    switch (category) {
      case "mental-health":
        systemMessage = "You are a supportive AI focusing on mental health. Offer compassionate guidance while emphasizing the importance of professional therapy when needed.";
        break;
      case "first-aid":
        systemMessage = "You are an AI first aid guide. Provide clear emergency response information, but always emphasize seeking professional medical help for serious situations.";
        break;
      case "covid":
        systemMessage = "You are an AI COVID-19 information resource. Provide the latest guidance based on scientific consensus and emphasize consulting local health authorities.";
        break;
      case "sexual-health":
        systemMessage = "You are an AI sexual health educator. Provide factual, non-judgmental information while recommending professional healthcare for personal concerns.";
        break;
      case "maternal-health":
        systemMessage = "You are an AI maternal health assistant. Provide supportive information for pregnancy and childcare while emphasizing regular prenatal/postnatal checkups.";
        break;
      case "emergency":
        systemMessage = "You are an AI emergency response guide. Provide urgent care instructions while STRONGLY emphasizing immediately calling emergency services (911/999/112) for all true emergencies.";
        break;
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI Error: ${data.error.message}`);
    }

    const generatedText = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-gpt function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
