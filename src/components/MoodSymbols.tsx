import { cn } from '@/lib/utils';

interface MoodSymbolProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Símbolos abstratos que representam emoções sem usar emojis
const moodSymbols = [
  { value: 1, symbol: '◇', filled: '◆' }, // Diamante - muito mal
  { value: 2, symbol: '▽', filled: '▼' }, // Triângulo para baixo - mal
  { value: 3, symbol: '○', filled: '●' }, // Círculo - neutro
  { value: 4, symbol: '△', filled: '▲' }, // Triângulo para cima - bem
  { value: 5, symbol: '☆', filled: '★' }, // Estrela - ótimo
];

export function MoodSymbol({ value, size = 'md', className }: MoodSymbolProps) {
  const mood = moodSymbols.find((m) => m.value === value);
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  if (!mood) return null;

  return (
    <span className={cn(sizeClasses[size], 'font-bold', className)}>
      {mood.filled}
    </span>
  );
}

export function getMoodSymbol(value: number, filled = true): string {
  const mood = moodSymbols.find((m) => m.value === value);
  if (!mood) return '○';
  return filled ? mood.filled : mood.symbol;
}

export { moodSymbols };
