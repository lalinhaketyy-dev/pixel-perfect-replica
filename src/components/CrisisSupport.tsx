import { Phone, MessageCircle, MapPin, X, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { BreathingCircle } from './BreathingCircle';

interface CrisisSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisSupport({ isOpen, onClose }: CrisisSupportProps) {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const phoneNumber = language === 'pt' ? '188' : '988';

  return (
    <div className="fixed inset-0 z-50 bg-crisis/95 backdrop-blur-sm flex flex-col animate-fade-in overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-start p-6 pt-12 pb-24">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/30 transition-colors"
          aria-label={t('crisis.close')}
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-destructive mx-auto mb-4 animate-pulse-gentle" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('crisis.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('crisis.subtitle')}
          </p>
        </div>

        {/* Emergency contacts */}
        <div className="w-full max-w-md space-y-4 mb-8">
          {/* CVV / Suicide Prevention */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-4 bg-background rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <Phone className="w-7 h-7 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t('crisis.cvv')}</h3>
              <p className="text-2xl font-bold text-destructive">{t('crisis.cvvNumber')}</p>
              <p className="text-sm text-muted-foreground">{t('crisis.cvvDescription')}</p>
            </div>
          </a>

          {/* Online Chat */}
          <a
            href={language === 'pt' ? 'https://www.cvv.org.br/chat/' : 'https://988lifeline.org/chat/'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-background rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t('crisis.chat')}</h3>
              <p className="text-sm text-muted-foreground">{t('crisis.chatDescription')}</p>
            </div>
          </a>

          {/* CAPS / Local Services */}
          <div className="flex items-center gap-4 bg-background rounded-xl p-4 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t('crisis.caps')}</h3>
              <p className="text-sm text-muted-foreground">{t('crisis.capsDescription')}</p>
            </div>
          </div>
        </div>

        {/* Breathing section */}
        <div className="w-full max-w-md text-center">
          <p className="text-muted-foreground mb-6">{t('crisis.breathing')}</p>
          <BreathingCircle isActive={true} />
        </div>

        {/* Close button at bottom */}
        <Button
          onClick={onClose}
          variant="outline"
          className="mt-8"
        >
          {t('crisis.close')}
        </Button>
      </div>
    </div>
  );
}
