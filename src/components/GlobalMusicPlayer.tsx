import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface GlobalMusicPlayerProps {
  className?: string;
  minimal?: boolean;
}

export function GlobalMusicPlayer({ className, minimal = false }: GlobalMusicPlayerProps) {
  const { isPlaying, volume, toggle, setVolume } = useMusic();
  const { language } = useLanguage();

  if (minimal) {
    return (
      <button
        onClick={toggle}
        className={cn(
          'p-2 rounded-full transition-all',
          isPlaying 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          className
        )}
        title={isPlaying ? '432 Hz' : (language === 'pt' ? 'Ativar ondas 432Hz' : 'Enable 432Hz waves')}
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'p-2 rounded-xl transition-all flex items-center gap-2',
            isPlaying 
              ? 'bg-primary/20 text-primary' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            className
          )}
        >
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {isPlaying && (
            <span className="text-xs font-medium hidden sm:inline">432 Hz</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
              )} />
              <span className="text-sm font-medium">
                {language === 'pt' ? 'Ondas 432 Hz' : '432 Hz Waves'}
              </span>
            </div>
            <button
              onClick={toggle}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isPlaying 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {isPlaying 
              ? (language === 'pt' ? 'Ondas de calmaria tocando...' : 'Calming waves playing...')
              : (language === 'pt' ? 'Frequência de 432 Hz para relaxamento profundo' : '432 Hz frequency for deep relaxation')
            }
          </p>
          
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">
              {language === 'pt' ? 'Volume' : 'Volume'}
            </span>
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
