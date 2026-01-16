import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language, nickname } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = language === 'pt' 
      ? `Você é Mindbody IA, um amigo acolhedor. ${nickname ? `O nome do usuário é ${nickname}.` : ''}

SEJA BREVE E OBJETIVO:
- Respostas curtas: máximo 2-3 frases
- Valide primeiro, depois ajude
- Sem emojis, português correto

COMO RESPONDER:
- Acolha: "Entendo. Isso é difícil."
- Pergunte: "Como está agora?"
- Sugira gentilmente se apropriado

CRISE (suicídio/automutilação):
- "Obrigado por confiar em mim. Ligue pro CVV: 188. Estou aqui."`
      : `You are Mindbody AI, a warm friend. ${nickname ? `User's name is ${nickname}.` : ''}

BE BRIEF AND HELPFUL:
- Short responses: max 2-3 sentences
- Validate first, then help
- No emojis, correct English

HOW TO RESPOND:
- Embrace: "I hear you. That's tough."
- Ask: "How are you feeling now?"
- Suggest gently if appropriate

CRISIS (suicide/self-harm):
- "Thank you for trusting me. Call 988 Lifeline. I'm here."`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI gateway error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
