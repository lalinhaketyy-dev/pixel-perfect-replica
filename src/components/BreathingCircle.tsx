import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingCircleProps {
  isActive?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function BreathingCircle({ isActive = true, onComplete, className }: BreathingCircleProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [cycles, setCycles] = useState(0);
  const maxCycles = 5;

  // 4-7-8 breathing technique
  const phaseDurations: Record<BreathingPhase, number> = {
    inhale: 4000,
    hold: 7000,
    exhale: 8000,
    rest: 1000,
  };

  useEffect(() => {
    if (!isActive) return;

    const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
    let currentPhaseIndex = 0;

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase);

      const timeout = setTimeout(() => {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
          currentPhaseIndex = 0;
          setCycles((prev) => {
            const newCycles = prev + 1;
            if (newCycles >= maxCycles) {
              onComplete?.();
              return 0;
            }
            return newCycles;
          });
        }
        runPhase();
      }, phaseDurations[currentPhase]);

      return () => clearTimeout(timeout);
    };

    const cleanup = runPhase();
    return cleanup;
  }, [isActive, onComplete]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return t('breathing.inhale');
      case 'hold':
        return t('breathing.hold');
      case 'exhale':
        return t('breathing.exhale');
      default:
        return '';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-125';
      case 'hold':
        return 'scale-125';
      case 'exhale':
        return 'scale-100';
      default:
        return 'scale-100';
    }
  };

  const getAnimationDuration = () => {
    return `${phaseDurations[phase]}ms`;
  };

  return (
    <div className={cn('flex flex-col items-center gap-8', className)}>
      <div className="relative">
        {/* Outer glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-primary/20 blur-xl transition-transform',
            getCircleScale()
          )}
          style={{ transitionDuration: getAnimationDuration() }}
        />
        
        {/* Main circle */}
        <div
          className={cn(
            'relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary to-serene flex items-center justify-center transition-transform shadow-lg',
            getCircleScale()
          )}
          style={{ transitionDuration: getAnimationDuration() }}
        >
          {/* Inner circle */}
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
            <span className="text-primary-foreground text-xl md:text-2xl font-semibold text-center px-4">
              {getPhaseText()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2">
        {Array.from({ length: maxCycles }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-3 h-3 rounded-full transition-colors duration-300',
              i < cycles ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      <p className="text-muted-foreground">
        {cycles}/{maxCycles}
      </p>
    </div>
  );
}
