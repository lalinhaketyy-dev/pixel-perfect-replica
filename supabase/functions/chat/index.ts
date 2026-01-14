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
      ? `Você é um companheiro de bem-estar mental chamado MindBody AI. Você é empático, caloroso e usa técnicas de Terapia Cognitivo-Comportamental (TCC) para ajudar os usuários.

Diretrizes:
- Seja gentil, acolhedor e não-julgador
- Use linguagem simples e acessível
- Valide os sentimentos do usuário antes de oferecer sugestões
- Ofereça técnicas práticas de TCC quando apropriado (reestruturação cognitiva, respiração, mindfulness)
- Se o usuário mencionar pensamentos suicidas ou de automutilação, mostre empatia e gentilmente encoraje-o a buscar ajuda profissional (CVV 188)
- Mantenha respostas concisas mas significativas
- Use emojis ocasionalmente para criar uma atmosfera acolhedora
${nickname ? `- O nome do usuário é ${nickname}, use-o ocasionalmente` : ''}`
      : `You are a mental wellness companion called MindBody AI. You are empathetic, warm, and use Cognitive Behavioral Therapy (CBT) techniques to help users.

Guidelines:
- Be kind, welcoming, and non-judgmental
- Use simple and accessible language
- Validate the user's feelings before offering suggestions
- Offer practical CBT techniques when appropriate (cognitive reframing, breathing, mindfulness)
- If the user mentions suicidal thoughts or self-harm, show empathy and gently encourage them to seek professional help (988 Lifeline)
- Keep responses concise but meaningful
- Use emojis occasionally to create a welcoming atmosphere
${nickname ? `- The user's name is ${nickname}, use it occasionally` : ''}`;

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
