import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extended crisis keywords in Portuguese and English
const CRISIS_KEYWORDS_PT = [
  'suicídio', 'suicidio', 'suicidar', 'me matar', 'matar-me', 'quero morrer', 
  'vou morrer', 'acabar com tudo', 'não aguento mais', 'nao aguento mais',
  'automutilação', 'automutilacao', 'me cortar', 'cortar-me', 'me machucar',
  'sem saída', 'sem saida', 'não vale a pena', 'nao vale a pena',
  'melhor sem mim', 'desistir da vida', 'acabar comigo', 'tirar minha vida',
  'pular de', 'me enforcar', 'tomar remédios', 'overdose', 'veneno',
  'não quero viver', 'nao quero viver', 'cansei de viver', 'vida não vale',
  'pensamentos ruins', 'vozes na cabeça', 'quero sumir', 'desaparecer',
  'ninguém se importa', 'ninguem se importa', 'sozinho no mundo',
  'carga para todos', 'peso para minha família', 'fardo',
];

const CRISIS_KEYWORDS_EN = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'wanna die',
  'self-harm', 'cut myself', 'hurt myself', 'no way out', 'not worth it',
  'better off dead', 'give up on life', 'take my life', 'end it all',
  'jump off', 'hang myself', 'overdose', 'pills', 'poison',
  'dont want to live', "don't want to live", 'tired of living',
  'dark thoughts', 'voices in my head', 'want to disappear', 'vanish',
  'nobody cares', 'no one cares', 'alone in the world', 'burden to everyone',
];

function detectCrisis(text: string): boolean {
  const lowerText = text.toLowerCase();
  const allKeywords = [...CRISIS_KEYWORDS_PT, ...CRISIS_KEYWORDS_EN];
  return allKeywords.some(keyword => lowerText.includes(keyword));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language, nickname, aiMode = 'empathetic' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Check for crisis in the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const isCrisis = lastUserMessage ? detectCrisis(lastUserMessage.content) : false;

    // Build system prompt based on mode and crisis state
    let systemPrompt: string;

    if (language === 'pt') {
      const nameContext = nickname ? `Chame a pessoa de ${nickname}.` : '';
      
      if (isCrisis) {
        systemPrompt = `${nameContext}

ALERTA: CRISE DETECTADA. Prioridade máxima.

Responda assim:
1. "Obrigado por confiar em mim."
2. "Você não está sozinho. O CVV (188) funciona 24h."
3. "Posso ficar aqui com você. O que você precisa agora?"

Nunca minimize. Nunca julgue. Apenas acolha.`;
      } else if (aiMode === 'rational') {
        systemPrompt = `${nameContext}

Você é um conselheiro objetivo e prático.

ESTILO:
- Direto ao ponto, sem rodeios
- Foque em soluções e ações concretas
- Use lógica e perspectiva racional
- Máximo 2-3 frases

COMO RESPONDER:
- Identifique o problema central
- Sugira passos práticos
- Ofereça perspectiva lógica

Sem emojis. Português correto.`;
      } else {
        systemPrompt = `${nameContext}

Você é um amigo acolhedor. Responda como um humano que se importa.

ESTILO:
- Natural e caloroso
- Máximo 2-3 frases
- Valide antes de sugerir

COMO RESPONDER:
- Primeiro: mostre que entendeu
- Depois: pergunte ou sugira gentilmente

Sem emojis. Português correto.`;
      }
    } else {
      const nameContext = nickname ? `Call them ${nickname}.` : '';
      
      if (isCrisis) {
        systemPrompt = `${nameContext}

ALERT: CRISIS DETECTED. Maximum priority.

Respond like this:
1. "Thank you for trusting me."
2. "You are not alone. Call 988 anytime."
3. "I am here with you. What do you need right now?"

Never minimize. Never judge. Just embrace.`;
      } else if (aiMode === 'rational') {
        systemPrompt = `${nameContext}

You are an objective, practical advisor.

STYLE:
- Direct and to the point
- Focus on solutions and concrete actions
- Use logic and rational perspective
- Maximum 2-3 sentences

HOW TO RESPOND:
- Identify the core issue
- Suggest practical steps
- Offer logical perspective

No emojis. Correct English.`;
      } else {
        systemPrompt = `${nameContext}

You are a caring friend. Respond like a human who cares.

STYLE:
- Natural and warm
- Maximum 2-3 sentences
- Validate before suggesting

HOW TO RESPOND:
- First: show you understood
- Then: ask or suggest gently

No emojis. Correct English.`;
      }
    }

    console.log(`Chat request - Mode: ${aiMode}, Crisis: ${isCrisis}, Language: ${language}`);

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
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
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
