import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MoodScaleProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Símbolos geométricos que representam níveis de humor
const moods = [
  { value: 1, symbol: '◆', labelKey: 'mood.terrible', color: 'text-destructive' },
  { value: 2, symbol: '▼', labelKey: 'mood.bad', color: 'text-orange-500' },
  { value: 3, symbol: '●', labelKey: 'mood.neutral', color: 'text-muted-foreground' },
  { value: 4, symbol: '▲', labelKey: 'mood.good', color: 'text-secondary' },
  { value: 5, symbol: '★', labelKey: 'mood.great', color: 'text-primary' },
];

export function MoodScale({ value, onChange, disabled = false, size = 'md' }: MoodScaleProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'text-2xl p-2',
    md: 'text-4xl p-3',
    lg: 'text-5xl p-4',
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center gap-2 md:gap-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onChange?.(mood.value)}
            disabled={disabled}
            className={cn(
              'rounded-full transition-all duration-300 transform hover:scale-110',
              sizeClasses[size],
              value === mood.value
                ? 'bg-primary/20 ring-4 ring-primary scale-110'
                : 'bg-card hover:bg-muted',
              disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
            )}
            aria-label={t(mood.labelKey)}
          >
            <span className={cn('block', value === mood.value ? mood.color : 'text-muted-foreground')}>
              {mood.symbol}
            </span>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-muted-foreground animate-fade-in">
          {t(moods.find((m) => m.value === value)?.labelKey || '')}
        </p>
      )}
    </div>
  );
}

export function getMoodSymbol(value: number): string {
  return moods.find((m) => m.value === value)?.symbol || '●';
}

export { moods };
