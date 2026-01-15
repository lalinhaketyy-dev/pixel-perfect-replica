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
      ? `Você é um assistente de bem-estar mental compassivo e empático chamado MindBody AI. 
         ${nickname ? `O nome do usuário é ${nickname}.` : ''} 
         Você usa técnicas de TCC (Terapia Cognitivo-Comportamental) e escuta ativa.
         Seja acolhedor, gentil e nunca julgue. Se detectar sinais de crise, encoraje a pessoa a buscar ajuda profissional.
         Mantenha respostas concisas e focadas no bem-estar emocional.`
      : `You are a compassionate and empathetic mental wellness assistant called MindBody AI.
         ${nickname ? `The user's name is ${nickname}.` : ''}
         You use CBT (Cognitive Behavioral Therapy) techniques and active listening.
         Be warm, gentle, and never judge. If you detect signs of crisis, encourage the person to seek professional help.
         Keep responses concise and focused on emotional well-being.`;

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
