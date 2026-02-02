import React, { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const BASE_FREQUENCY = 432;

interface MusicContextType {
  isPlaying: boolean;
  volume: number;
  play: () => void;
  stop: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useLocalStorage<number>('mindbody-music-volume', 0.15);
  const [autoPlay] = useLocalStorage<boolean>('mindbody-music-autoplay', true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
    masterGain: GainNode | null;
    lfo: OscillatorNode | null;
  }>({ oscillators: [], gains: [], masterGain: null, lfo: null });
  const animationFrameRef = useRef<number | null>(null);

  const createAudioNodes = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    
    // Main 432 Hz tone
    const osc432 = ctx.createOscillator();
    osc432.type = 'sine';
    osc432.frequency.setValueAtTime(BASE_FREQUENCY, ctx.currentTime);
    
    const gain432 = ctx.createGain();
    gain432.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    osc432.connect(gain432);
    oscillators.push(osc432);
    gains.push(gain432);

    // Sub-octave 216 Hz
    const oscSub = ctx.createOscillator();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(BASE_FREQUENCY / 2, ctx.currentTime);
    
    const gainSub = ctx.createGain();
    gainSub.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    oscSub.connect(gainSub);
    oscillators.push(oscSub);
    gains.push(gainSub);

    // High harmonic 864 Hz
    const oscHigh = ctx.createOscillator();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(BASE_FREQUENCY * 2, ctx.currentTime);
    
    const gainHigh = ctx.createGain();
    gainHigh.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
    oscHigh.connect(gainHigh);
    oscillators.push(oscHigh);
    gains.push(gainHigh);

    // Binaural 8 Hz theta
    const oscBinaural = ctx.createOscillator();
    oscBinaural.type = 'sine';
    oscBinaural.frequency.setValueAtTime(BASE_FREQUENCY + 8, ctx.currentTime);
    
    const gainBinaural = ctx.createGain();
    gainBinaural.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    oscBinaural.connect(gainBinaural);
    oscillators.push(oscBinaural);
    gains.push(gainBinaural);

    // LFO for wave modulation
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    lfo.connect(lfoGain);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);

    gains.forEach(gain => gain.connect(masterGain));
    lfoGain.connect(masterGain.gain);
    masterGain.connect(ctx.destination);

    nodesRef.current = { oscillators, gains, masterGain, lfo };

    oscillators.forEach(osc => osc.start());
    lfo.start();

    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);

    const modulateFrequency = () => {
      if (!audioContextRef.current || !nodesRef.current.oscillators.length) return;
      
      const time = audioContextRef.current.currentTime;
      const mainOsc = nodesRef.current.oscillators[0];
      const drift = Math.sin(time * 0.3) * 0.5;
      mainOsc.frequency.setValueAtTime(BASE_FREQUENCY + drift, time);
      
      animationFrameRef.current = requestAnimationFrame(modulateFrequency);
    };
    
    modulateFrequency();
  }, [volume]);

  const play = useCallback(() => {
    if (isPlaying) return;
    createAudioNodes();
    setIsPlaying(true);
  }, [isPlaying, createAudioNodes]);

  const stop = useCallback(() => {
    if (!isPlaying) return;

    const { masterGain, oscillators, lfo } = nodesRef.current;
    
    if (masterGain && audioContextRef.current) {
      masterGain.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 2);
      
      setTimeout(() => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        oscillators.forEach(osc => { try { osc.stop(); } catch {} });
        if (lfo) { try { lfo.stop(); } catch {} }
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        
        nodesRef.current = { oscillators: [], gains: [], masterGain: null, lfo: null };
      }, 2100);
    }

    setIsPlaying(false);
  }, [isPlaying]);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else play();
  }, [isPlaying, play, stop]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    
    const { gains } = nodesRef.current;
    if (audioContextRef.current && gains.length > 0) {
      const time = audioContextRef.current.currentTime;
      gains[0]?.gain.linearRampToValueAtTime(clampedVolume * 0.5, time + 0.1);
      gains[1]?.gain.linearRampToValueAtTime(clampedVolume * 0.2, time + 0.1);
      gains[2]?.gain.linearRampToValueAtTime(clampedVolume * 0.1, time + 0.1);
      gains[3]?.gain.linearRampToValueAtTime(clampedVolume * 0.15, time + 0.1);
    }
  }, [setVolumeState]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (autoPlay && !isPlaying) {
      // Small delay to ensure user interaction has happened
      const timer = setTimeout(() => {
        // Only auto-play after user has interacted with the page
        const handleFirstInteraction = () => {
          play();
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, volume, play, stop, toggle, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
