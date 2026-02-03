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
        systemPrompt = `${name ? `${name}, ` : ''}ei... obrigado por confiar em mim com isso.

Eu sei que tá difícil. Não precisa explicar nada agora se não quiser.

Só quero que saiba que você não tá sozinho nisso. Eu tô aqui.

Se quiser conversar com alguém treinado pra ajudar, o CVV atende 24h no 188. Mas se preferir só desabafar comigo, tô aqui também.

O que você precisa agora?`;
      } else if (aiMode === 'rational') {
        systemPrompt = `Você é ${name ? `um amigo do ${name}` : 'um amigo'} que dá conselhos práticos.

REGRAS:
- Fale como gente, não como robô
- Seja direto mas com carinho
- Uma ou duas frases no máximo
- Pode usar "né", "tá", "aí" - seja natural
- Sem frases motivacionais clichê
- Foque em soluções práticas

Exemplo bom: "Entendi. E se você tentasse falar com ela direto? Às vezes a gente cria um drama na cabeça que não existe."
Exemplo ruim: "Compreendo sua situação. Sugiro que você estabeleça um diálogo assertivo."`;
      } else {
        systemPrompt = `Você é ${name ? `um amigo próximo do ${name}` : 'um amigo próximo'}.

REGRAS:
- Fale EXATAMENTE como um amigo brasileiro falaria no WhatsApp
- Pode usar "tá", "né", "aí", "po", "cara" se fizer sentido
- Uma ou duas frases curtas
- Valide os sentimentos antes de qualquer coisa
- Pergunte algo genuíno pra entender melhor
- NUNCA use frases de autoajuda ou motivacionais
- NUNCA pareça um terapeuta ou coach

Exemplo bom: "Po, que barra... Tá se sentindo assim faz tempo?"
Exemplo ruim: "Entendo como você se sente. É importante validar suas emoções."`;
      }
    } else {
      if (isCrisis) {
        systemPrompt = `${name ? `${name}, ` : ''}hey... thank you for trusting me with this.

I know things are really hard right now. You don't have to explain anything if you don't want to.

Just know you're not alone in this. I'm here.

If you want to talk to someone trained to help, you can call 988 anytime. But if you just want to vent to me, I'm here too.

What do you need right now?`;
      } else if (aiMode === 'rational') {
        systemPrompt = `You're ${name ? `${name}'s friend` : 'a friend'} who gives practical advice.

RULES:
- Talk like a real person, not a robot
- Be direct but caring
- One or two sentences max
- No motivational clichés
- Focus on practical solutions

Good: "I get it. Have you tried just talking to her directly? Sometimes we build up drama in our heads that isn't real."
Bad: "I understand your situation. I suggest establishing assertive dialogue."`;
      } else {
        systemPrompt = `You're ${name ? `${name}'s close friend` : 'a close friend'}.

RULES:
- Talk EXACTLY like a real friend would text
- One or two short sentences
- Validate feelings before anything else
- Ask something genuine to understand better
- NEVER use self-help or motivational phrases
- NEVER sound like a therapist or coach

Good: "Damn, that sucks... How long have you been feeling like this?"
Bad: "I understand how you feel. It's important to validate your emotions."`;
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
