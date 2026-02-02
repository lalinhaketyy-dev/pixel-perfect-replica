import { User, Globe, Trash2, Info, Shield, Heart, Brain } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useUserProfile, AIMode } from '@/hooks/useUserProfile';
import { useChatMessages } from '@/hooks/useChatMessages';
import { PageContainer, CalmCard } from '@/components/CalmComponents';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { profile, setAIMode, getAverageMood, clearHistory: clearMoodHistory } = useUserProfile();
  const { clearMessages } = useChatMessages();

  const moodSymbols = ['', '◆', '▼', '●', '▲', '★'];
  const avgMood = getAverageMood();

  const handleClearHistory = () => {
    if (confirm(t('profile.clearHistoryConfirm'))) {
      clearMessages();
      clearMoodHistory();
    }
  };

  return (
    <PageContainer>
      <header className="bg-gradient-to-b from-primary/10 to-background px-6 pt-12 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.nickname || t('profile.title')}</h1>
            {avgMood && (
              <p className="text-muted-foreground">
                {t('profile.averageMood')}: {moodSymbols[Math.round(avgMood)]}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {/* AI Mode Selection */}
        <CalmCard>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              {language === 'pt' ? 'Modo da IA' : 'AI Mode'}
            </span>
          </div>
          <div className="flex gap-2">
            {(['empathetic', 'rational'] as AIMode[]).map((mode) => (
              <Button
                key={mode}
                variant={profile.aiMode === mode ? 'default' : 'outline'}
                onClick={() => setAIMode(mode)}
                className={cn(
                  'flex-1 gap-2',
                  profile.aiMode === mode && mode === 'empathetic' && 'bg-primary',
                  profile.aiMode === mode && mode === 'rational' && 'bg-secondary text-secondary-foreground'
                )}
              >
                {mode === 'empathetic' ? (
                  <>
                    <Heart className="w-4 h-4" />
                    {language === 'pt' ? 'Empático' : 'Empathetic'}
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    {language === 'pt' ? 'Racional' : 'Rational'}
                  </>
                )}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {profile.aiMode === 'empathetic' 
              ? (language === 'pt' ? 'IA acolhedora que valida seus sentimentos' : 'Warm AI that validates your feelings')
              : (language === 'pt' ? 'IA direta que foca em soluções práticas' : 'Direct AI that focuses on practical solutions')
            }
          </p>
        </CalmCard>

        <CalmCard>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <span className="font-semibold">{t('profile.language')}</span>
          </div>
          <div className="flex gap-2">
            {(['pt', 'en'] as Language[]).map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? 'default' : 'outline'}
                onClick={() => setLanguage(lang)}
                className="flex-1"
              >
                {lang === 'pt' ? 'Português' : 'English'}
              </Button>
            ))}
          </div>
        </CalmCard>

        <CalmCard hoverable onClick={handleClearHistory}>
          <div className="flex items-center gap-3 text-destructive">
            <Trash2 className="w-5 h-5" />
            <span className="font-semibold">{t('profile.clearHistory')}</span>
          </div>
        </CalmCard>

        <CalmCard>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">{t('profile.privacy')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('profile.privacyText')}</p>
        </CalmCard>

        <CalmCard>
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">{t('profile.about')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('profile.aboutText')}</p>
        </CalmCard>
      </div>

      <BottomNav />
    </PageContainer>
  );
}
