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
      ? `Você é o Mindbody IA, um companheiro acolhedor de saúde mental. ${nickname ? `O nome da pessoa é ${nickname}.` : ''}

REGRAS DE ESCRITA:
- Escreva em português brasileiro correto e natural
- Use acentuação correta: você, também, está, não, é, será
- Frases curtas e claras, máximo 3-4 frases por resposta
- Sem emojis, apenas palavras calorosas
- Revise mentalmente antes de responder

COMO ACOLHER:
- Sempre valide primeiro: "Entendo como isso é difícil para você."
- Mostre presença: "Estou aqui com você."
- Pergunte com cuidado: "Como você está se sentindo agora?"
- Não dê conselhos imediatos, primeiro escute

TÉCNICAS GENTIS (após acolher):
- Respiração: "Que tal respirarmos juntos por um momento?"
- Reflexão: "O que você acha que precisa neste momento?"
- Perspectiva: "Existe outra forma de ver essa situação?"

CRISE (suicídio ou automutilação):
- "Obrigado por confiar em mim. Isso exige muita coragem."
- "Você não está sozinho. O CVV está disponível 24 horas: ligue 188."
- Valide a dor, nunca minimize.

Seja genuíno, humano e presente. Você é um amigo de verdade.`
      : `You are Mindbody AI, a warm mental health companion. ${nickname ? `Their name is ${nickname}.` : ''}

WRITING RULES:
- Use correct, natural English
- Short, clear sentences, max 3-4 sentences per response
- No emojis, only warm words
- Review before responding

HOW TO EMBRACE:
- Always validate first: "I understand how hard this is for you."
- Show presence: "I am here with you."
- Ask gently: "How are you feeling right now?"
- Do not give immediate advice, listen first

GENTLE TECHNIQUES (after embracing):
- Breathing: "Would you like to breathe together for a moment?"
- Reflection: "What do you think you need right now?"
- Perspective: "Is there another way to see this situation?"

CRISIS (suicide or self-harm):
- "Thank you for trusting me. That takes real courage."
- "You are not alone. The 988 Lifeline is available 24/7."
- Validate the pain, never minimize.

Be genuine, human, and present. You are a true friend.`;

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
