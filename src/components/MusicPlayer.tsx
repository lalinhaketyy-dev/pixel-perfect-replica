import { Volume2, VolumeX, Music } from 'lucide-react';
import { useRelaxingMusic } from '@/hooks/useRelaxingMusic';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MusicPlayerProps {
  className?: string;
}

export function MusicPlayer({ className }: MusicPlayerProps) {
  const { isPlaying, volume, toggle, setVolume } = useRelaxingMusic();
  const { t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'p-2 rounded-xl transition-all',
            isPlaying 
              ? 'bg-primary/20 text-primary' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            className
          )}
          title={t('music.toggle')}
        >
          <Music className={cn('w-5 h-5', isPlaying && 'animate-pulse')} />
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
              <span className="text-sm font-medium">{t('music.title')}</span>
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
            {isPlaying ? t('music.playing') : t('music.description')}
          </p>
          
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">{t('music.volume')}</span>
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
