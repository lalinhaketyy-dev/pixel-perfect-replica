import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeVoiceOptions {
  language: string;
  nickname?: string;
  onTranscript?: (text: string, isUser: boolean) => void;
  onSpeakingChange?: (speaking: boolean) => void;
  onError?: (error: string) => void;
}

export function useRealtimeVoice({
  language,
  nickname,
  onTranscript,
  onSpeakingChange,
  onError,
}: UseRealtimeVoiceOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);

    try {
      // Get ephemeral token from edge function
      const { data, error } = await supabase.functions.invoke('realtime-session', {
        body: { language, nickname }
      });

      if (error || !data?.client_secret?.value) {
        throw new Error(error?.message || 'Failed to get session token');
      }

      const ephemeralKey = data.client_secret.value;

      // Create audio element
      audioElRef.current = document.createElement('audio');
      audioElRef.current.autoplay = true;

      // Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Set up remote audio
      pc.ontrack = (e) => {
        if (audioElRef.current) {
          audioElRef.current.srcObject = e.streams[0];
        }
      };

      // Get user microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      streamRef.current = stream;
      pc.addTrack(stream.getTracks()[0]);

      // Set up data channel
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.addEventListener('message', (e) => {
        const event = JSON.parse(e.data);
        console.log('Realtime event:', event.type);

        switch (event.type) {
          case 'response.audio.delta':
            setIsSpeaking(true);
            onSpeakingChange?.(true);
            break;
          case 'response.audio.done':
            setIsSpeaking(false);
            onSpeakingChange?.(false);
            break;
          case 'conversation.item.input_audio_transcription.completed':
            onTranscript?.(event.transcript, true);
            break;
          case 'response.audio_transcript.done':
            onTranscript?.(event.transcript, false);
            break;
          case 'error':
            console.error('Realtime error:', event.error);
            onError?.(event.error?.message || 'Unknown error');
            break;
        }
      });

      // Create and set local description
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Connect to OpenAI Realtime API
      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error('Failed to connect to OpenAI Realtime');
      }

      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: await sdpResponse.text(),
      };

      await pc.setRemoteDescription(answer);
      
      setIsConnected(true);
      console.log('WebRTC connection established');

    } catch (error) {
      console.error('Connection error:', error);
      onError?.(error instanceof Error ? error.message : 'Connection failed');
      disconnect();
    } finally {
      setIsConnecting(false);
    }
  }, [language, nickname, onTranscript, onSpeakingChange, onError, isConnected, isConnecting]);

  const disconnect = useCallback(() => {
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    onSpeakingChange?.(false);
  }, [onSpeakingChange]);

  const sendTextMessage = useCallback((text: string) => {
    if (!dcRef.current || dcRef.current.readyState !== 'open') {
      console.error('Data channel not ready');
      return;
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text,
          },
        ],
      },
    };

    dcRef.current.send(JSON.stringify(event));
    dcRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    connect,
    disconnect,
    sendTextMessage,
  };
}
