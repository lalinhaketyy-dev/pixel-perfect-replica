import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// 432 Hz is known as the "universal healing frequency" 
// This generates a pure sine wave at 432 Hz
const FREQUENCY = 432;

export function useRelaxingMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useLocalStorage<number>('mindbody-music-volume', 0.15);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const createAudioNodes = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    
    // Create oscillator for 432 Hz tone
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(FREQUENCY, ctx.currentTime);

    // Create a second oscillator for subtle harmonic (864 Hz - octave above)
    const oscillator2 = ctx.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(FREQUENCY * 2, ctx.currentTime);

    // Create gain nodes for volume control
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(volume * 0.7, ctx.currentTime);

    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);

    // Create master gain for overall volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1, ctx.currentTime);

    // Connect nodes
    oscillator.connect(mainGain);
    oscillator2.connect(harmonicGain);
    mainGain.connect(masterGain);
    harmonicGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    oscillatorRef.current = oscillator;
    gainNodeRef.current = masterGain;

    // Start oscillators
    oscillator.start();
    oscillator2.start();

    // Fade in
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);

    return { oscillator, oscillator2, masterGain };
  }, [volume]);

  const play = useCallback(() => {
    if (isPlaying) return;
    
    createAudioNodes();
    setIsPlaying(true);
  }, [isPlaying, createAudioNodes]);

  const stop = useCallback(() => {
    if (!isPlaying) return;

    if (gainNodeRef.current && audioContextRef.current) {
      // Fade out
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1);
      
      setTimeout(() => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        oscillatorRef.current = null;
        gainNodeRef.current = null;
      }, 1100);
    }

    setIsPlaying(false);
  }, [isPlaying]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
    
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(newVolume, audioContextRef.current.currentTime + 0.1);
    }
  }, [setVolumeState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    volume,
    play,
    stop,
    toggle,
    setVolume,
  };
}
