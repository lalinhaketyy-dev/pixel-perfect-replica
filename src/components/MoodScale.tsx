import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface MoodScaleProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const moods = [
  { value: 1, emoji: '😢', labelKey: 'mood.terrible' },
  { value: 2, emoji: '😔', labelKey: 'mood.bad' },
  { value: 3, emoji: '😐', labelKey: 'mood.neutral' },
  { value: 4, emoji: '🙂', labelKey: 'mood.good' },
  { value: 5, emoji: '😊', labelKey: 'mood.great' },
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
            <span className="block">{mood.emoji}</span>
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
