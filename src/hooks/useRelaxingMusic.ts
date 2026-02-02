import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

// 432 Hz is known as the "universal healing frequency" 
// Combined with binaural beats and nature-inspired wave patterns for deep relaxation
const BASE_FREQUENCY = 432;

export function useRelaxingMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useLocalStorage<number>('mindbody-music-volume', 0.15);
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
    
    // Main 432 Hz tone - the healing frequency
    const osc432 = ctx.createOscillator();
    osc432.type = 'sine';
    osc432.frequency.setValueAtTime(BASE_FREQUENCY, ctx.currentTime);
    
    const gain432 = ctx.createGain();
    gain432.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    osc432.connect(gain432);
    oscillators.push(osc432);
    gains.push(gain432);

    // Subtle harmonic at 216 Hz (sub-octave) for depth
    const oscSub = ctx.createOscillator();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(BASE_FREQUENCY / 2, ctx.currentTime);
    
    const gainSub = ctx.createGain();
    gainSub.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    oscSub.connect(gainSub);
    oscillators.push(oscSub);
    gains.push(gainSub);

    // High harmonic at 864 Hz for brightness
    const oscHigh = ctx.createOscillator();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(BASE_FREQUENCY * 2, ctx.currentTime);
    
    const gainHigh = ctx.createGain();
    gainHigh.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
    oscHigh.connect(gainHigh);
    oscillators.push(oscHigh);
    gains.push(gainHigh);

    // Binaural beat component: 432 Hz in one channel, 440 Hz slight difference
    // Creates a perceived 8 Hz theta wave (relaxation/meditation state)
    const oscBinaural = ctx.createOscillator();
    oscBinaural.type = 'sine';
    oscBinaural.frequency.setValueAtTime(BASE_FREQUENCY + 8, ctx.currentTime);
    
    const gainBinaural = ctx.createGain();
    gainBinaural.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
    oscBinaural.connect(gainBinaural);
    oscillators.push(oscBinaural);
    gains.push(gainBinaural);

    // Create LFO for wave-like modulation (simulates ocean waves)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // Very slow wave: 6 seconds per cycle
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    lfo.connect(lfoGain);

    // Master gain for overall volume and wave modulation
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);

    // Connect all oscillator gains to master
    gains.forEach(gain => gain.connect(masterGain));
    
    // Connect LFO to modulate master gain for wave effect
    lfoGain.connect(masterGain.gain);
    
    // Connect to output
    masterGain.connect(ctx.destination);

    // Store references
    nodesRef.current = {
      oscillators,
      gains,
      masterGain,
      lfo
    };

    // Start all oscillators
    oscillators.forEach(osc => osc.start());
    lfo.start();

    // Smooth fade in over 3 seconds
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);

    // Add subtle frequency modulation for organic feel
    const modulateFrequency = () => {
      if (!audioContextRef.current || !nodesRef.current.oscillators.length) return;
      
      const time = audioContextRef.current.currentTime;
      const mainOsc = nodesRef.current.oscillators[0];
      
      // Very subtle pitch drift (±0.5 Hz) for organic sound
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
      // Smooth fade out over 2 seconds
      masterGain.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 2);
      
      setTimeout(() => {
        // Stop animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        // Stop and disconnect all nodes
        oscillators.forEach(osc => {
          try { osc.stop(); } catch {}
        });
        if (lfo) {
          try { lfo.stop(); } catch {}
        }
        
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
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    
    const { gains, masterGain } = nodesRef.current;
    if (audioContextRef.current && gains.length > 0) {
      const time = audioContextRef.current.currentTime;
      
      // Update individual gain nodes with their relative volumes
      gains[0]?.gain.linearRampToValueAtTime(clampedVolume * 0.5, time + 0.1);  // Main 432 Hz
      gains[1]?.gain.linearRampToValueAtTime(clampedVolume * 0.2, time + 0.1);  // Sub
      gains[2]?.gain.linearRampToValueAtTime(clampedVolume * 0.1, time + 0.1);  // High
      gains[3]?.gain.linearRampToValueAtTime(clampedVolume * 0.15, time + 0.1); // Binaural
    }
  }, [setVolumeState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
