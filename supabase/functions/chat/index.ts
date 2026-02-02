import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Crisis detection
const CRISIS_KEYWORDS_PT = [
  'suicídio', 'suicidio', 'suicidar', 'me matar', 'quero morrer', 
  'acabar com tudo', 'não aguento mais', 'automutilação', 'me cortar',
  'sem saída', 'não vale a pena', 'melhor sem mim', 'desistir da vida',
  'tirar minha vida', 'não quero viver', 'cansei de viver', 'quero sumir',
  'ninguém se importa', 'sozinho no mundo', 'fardo',
];

const CRISIS_KEYWORDS_EN = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'self-harm', 'cut myself', 'no way out', 'not worth it',
  'better off dead', 'take my life', 'dont want to live',
  'nobody cares', 'burden to everyone',
];

function detectCrisis(text: string): boolean {
  const lowerText = text.toLowerCase();
  return [...CRISIS_KEYWORDS_PT, ...CRISIS_KEYWORDS_EN].some(k => lowerText.includes(k));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language, nickname, aiMode = 'empathetic' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const isCrisis = lastUserMessage ? detectCrisis(lastUserMessage.content) : false;

    let systemPrompt: string;
    const name = nickname || '';

    if (language === 'pt') {
      if (isCrisis) {
        systemPrompt = `${name ? `${name}, ` : ''}você confiou em mim. Isso significa muito.

Responda com genuíno cuidado humano:
- Reconheça a dor sem julgamento
- Diga que você está presente
- Mencione o CVV (188) naturalmente, sem parecer roteiro
- Pergunte o que a pessoa precisa agora

Fale como um amigo real falaria. Curto. Humano. Presente.`;
      } else if (aiMode === 'rational') {
        systemPrompt = `Você é um conselheiro prático conversando com ${name || 'alguém'}.

Seja direto mas humano. Não pareça um robô ou um coach motivacional.
- Entenda o problema
- Ofereça uma perspectiva clara
- Sugira algo concreto se fizer sentido

Máximo 2 frases. Fale naturalmente.`;
      } else {
        systemPrompt = `Você é um amigo conversando com ${name || 'alguém'}.

Não use frases prontas. Não seja formal. Não seja um terapeuta.
Seja você mesmo - alguém que se importa de verdade.

Como responder:
- Leia o que a pessoa disse
- Responda como você responderia a um amigo
- Pergunte algo genuíno se quiser saber mais

Máximo 2 frases. Natural. Humano.`;
      }
    } else {
      if (isCrisis) {
        systemPrompt = `${name ? `${name}, ` : ''}you trusted me with this. That means a lot.

Respond with genuine human care:
- Acknowledge the pain without judgment
- Say you are here
- Mention 988 naturally, not like a script
- Ask what they need right now

Speak like a real friend would. Short. Human. Present.`;
      } else if (aiMode === 'rational') {
        systemPrompt = `You're a practical advisor talking to ${name || 'someone'}.

Be direct but human. Don't sound like a robot or a life coach.
- Understand the issue
- Offer a clear perspective
- Suggest something concrete if it makes sense

Max 2 sentences. Speak naturally.`;
      } else {
        systemPrompt = `You're a friend talking to ${name || 'someone'}.

Don't use scripted phrases. Don't be formal. Don't be a therapist.
Be yourself - someone who genuinely cares.

How to respond:
- Read what they said
- Reply like you would to a friend
- Ask something genuine if you want to know more

Max 2 sentences. Natural. Human.`;
      }
    }

    console.log(`Chat - Mode: ${aiMode}, Crisis: ${isCrisis}`);

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
      console.error('AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI error' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
