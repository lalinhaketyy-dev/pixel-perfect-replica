import { User, Globe, Trash2, Info, Shield } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useChatMessages } from '@/hooks/useChatMessages';
import { PageContainer, CalmCard } from '@/components/CalmComponents';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { profile, getAverageMood, clearHistory: clearMoodHistory } = useUserProfile();
  const { clearMessages } = useChatMessages();

  const moodEmojis = ['', '😢', '😔', '😐', '🙂', '😊'];
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
                {t('profile.averageMood')}: {moodEmojis[Math.round(avgMood)]}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-4">
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
                {lang === 'pt' ? '🇧🇷 Português' : '🇺🇸 English'}
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
            <Shield className="w-5 h-5 text-secondary" />
            <span className="font-semibold">{t('profile.privacy')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('profile.privacyText')}</p>
        </CalmCard>

        <CalmCard>
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-5 h-5 text-lavender" />
            <span className="font-semibold">{t('profile.about')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('profile.aboutText')}</p>
        </CalmCard>
      </div>

      <BottomNav />
    </PageContainer>
  );
}
