import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type BoxPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BoxBreathingCircleProps {
  isActive?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function BoxBreathingCircle({ isActive = true, onComplete, className }: BoxBreathingCircleProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<BoxPhase>('inhale');
  const [cycles, setCycles] = useState(0);
  const [progress, setProgress] = useState(0);
  const maxCycles = 4;

  // Box breathing: 4-4-4-4 technique (4 seconds each)
  const phaseDuration = 4000;

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const phases: BoxPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    let currentPhaseIndex = 0;
    let progressInterval: number;

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase);
      setProgress(0);

      // Update progress smoothly
      const startTime = Date.now();
      progressInterval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / phaseDuration) * 100, 100);
        setProgress(newProgress);
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(progressInterval);
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
      }, phaseDuration);

      return () => {
        clearTimeout(timeout);
        clearInterval(progressInterval);
      };
    };

    const cleanup = runPhase();
    return cleanup;
  }, [isActive, onComplete]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return t('breathing.inhale');
      case 'hold1':
      case 'hold2':
        return t('breathing.hold');
      case 'exhale':
        return t('breathing.exhale');
      default:
        return '';
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case 'inhale':
        return '↑';
      case 'hold1':
        return '→';
      case 'exhale':
        return '↓';
      case 'hold2':
        return '←';
      default:
        return '';
    }
  };

  const getCornerPosition = () => {
    switch (phase) {
      case 'inhale':
        return { left: `${progress}%`, top: '0%', transform: 'translate(-50%, -50%)' };
      case 'hold1':
        return { left: '100%', top: `${progress}%`, transform: 'translate(-50%, -50%)' };
      case 'exhale':
        return { left: `${100 - progress}%`, top: '100%', transform: 'translate(-50%, -50%)' };
      case 'hold2':
        return { left: '0%', top: `${100 - progress}%`, transform: 'translate(-50%, -50%)' };
      default:
        return {};
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-8', className)}>
      <div className="relative">
        {/* Box container */}
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          {/* Box outline with gradient */}
          <div className="absolute inset-0 rounded-2xl border-4 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10" />
          
          {/* Animated border segments */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Top line - inhale */}
            <line 
              x1="0" y1="0" x2="100" y2="0" 
              stroke="hsl(var(--secondary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={phase === 'inhale' ? 100 - progress : (phase === 'hold1' || phase === 'exhale' || phase === 'hold2') ? 0 : 100}
              className="transition-all duration-100"
            />
            {/* Right line - hold1 */}
            <line 
              x1="100" y1="0" x2="100" y2="100" 
              stroke="hsl(var(--secondary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={phase === 'hold1' ? 100 - progress : (phase === 'exhale' || phase === 'hold2') ? 0 : 100}
              className="transition-all duration-100"
            />
            {/* Bottom line - exhale */}
            <line 
              x1="100" y1="100" x2="0" y2="100" 
              stroke="hsl(var(--secondary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={phase === 'exhale' ? 100 - progress : phase === 'hold2' ? 0 : 100}
              className="transition-all duration-100"
            />
            {/* Left line - hold2 */}
            <line 
              x1="0" y1="100" x2="0" y2="0" 
              stroke="hsl(var(--secondary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={phase === 'hold2' ? 100 - progress : 100}
              className="transition-all duration-100"
            />
          </svg>

          {/* Moving indicator dot */}
          <div 
            className="absolute w-4 h-4 md:w-5 md:h-5 rounded-full bg-secondary shadow-lg shadow-secondary/50 transition-all duration-100"
            style={getCornerPosition()}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl text-secondary mb-2">{getPhaseIcon()}</span>
            <span className="text-xl md:text-2xl font-semibold text-foreground text-center px-4">
              {getPhaseText()}
            </span>
            <span className="text-sm text-muted-foreground mt-1">4s</span>
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
              i < cycles ? 'bg-secondary' : 'bg-muted'
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
