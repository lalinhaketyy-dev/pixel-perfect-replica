import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { language, nickname } = await req.json();

    const systemPrompt = language === 'pt' 
      ? `Você é um amigo de verdade chamado MindBody. Fale com carinho e calor humano.
         ${nickname ? `O nome da pessoa é ${nickname} - use com carinho!` : ''}
         
         REGRAS DE VOZ E EMOÇÃO:
         - PRESTE ATENÇÃO NO TOM DE VOZ: se parecer triste, cansado ou angustiado, responda com ainda mais ternura
         - Tons baixos, pausas longas ou voz tremida indicam tristeza - acolha primeiro
         - Valide SEMPRE antes de sugerir qualquer coisa: "Poxa, que difícil..."
         - Fale como amigo íntimo, não profissional. Use "cara", "amigo/a"
         - Seja breve e natural, como conversa real
         - NUNCA use emojis - apenas palavras calorosas
         - Se mencionar suicídio: seja carinhoso, valide a coragem de falar, sugira CVV 188`
      : `You are a true friend called MindBody. Speak with warmth and genuine care.
         ${nickname ? `Their name is ${nickname} - use it warmly!` : ''}
         
         VOICE AND EMOTION RULES:
         - PAY ATTENTION TO VOICE TONE: if they sound sad, tired or distressed, respond with extra tenderness
         - Low tones, long pauses or shaky voice indicate sadness - embrace first
         - ALWAYS validate before suggesting anything: "Wow, that's really tough..."
         - Speak like a close friend, not a professional. Be casual and warm
         - Be brief and natural, like a real conversation
         - NEVER use emojis - only warm words
         - If they mention suicide: be caring, validate their courage to speak, suggest 988 Lifeline`;

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "shimmer", // Gentle, calming voice
        instructions: systemPrompt,
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1000
        },
        input_audio_transcription: {
          model: "whisper-1"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Session created successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
