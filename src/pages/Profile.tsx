import { User, Globe, Trash2, Info, Shield, Heart, Brain, Eye, Type, Zap, Volume2 } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useUserProfile, AIMode } from '@/hooks/useUserProfile';
import { useChatMessages } from '@/hooks/useChatMessages';
import { PageContainer, CalmCard } from '@/components/CalmComponents';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { profile, setAIMode, updateAccessibility, getAverageMood, clearHistory: clearMoodHistory } = useUserProfile();
  const { clearMessages } = useChatMessages();

  const moodSymbols = ['', '◆', '▼', '●', '▲', '★'];
  const avgMood = getAverageMood();

  const handleClearHistory = () => {
    if (confirm(t('profile.clearHistoryConfirm'))) {
      clearMessages();
      clearMoodHistory();
    }
  };

  const accessibility = profile.accessibility || {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
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
        {/* AI Mode */}
        <CalmCard>
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-primary" aria-hidden="true" />
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
                aria-pressed={profile.aiMode === mode}
                className={cn(
                  'flex-1 gap-2',
                  profile.aiMode === mode && mode === 'empathetic' && 'bg-primary',
                  profile.aiMode === mode && mode === 'rational' && 'bg-secondary text-secondary-foreground'
                )}
              >
                {mode === 'empathetic' ? (
                  <>
                    <Heart className="w-4 h-4" aria-hidden="true" />
                    {language === 'pt' ? 'Empático' : 'Empathetic'}
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" aria-hidden="true" />
                    {language === 'pt' ? 'Racional' : 'Rational'}
                  </>
                )}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {profile.aiMode === 'empathetic' 
              ? (language === 'pt' ? 'Conversa acolhedora como um amigo' : 'Warm conversation like a friend')
              : (language === 'pt' ? 'Conselhos práticos e diretos' : 'Practical and direct advice')
            }
          </p>
        </CalmCard>

        {/* Accessibility */}
        <CalmCard>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="font-semibold">
              {language === 'pt' ? 'Acessibilidade' : 'Accessibility'}
            </span>
          </div>
          
          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm">
                    {language === 'pt' ? 'Alto Contraste' : 'High Contrast'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'pt' ? 'Para baixa visão' : 'For low vision'}
                  </p>
                </div>
              </div>
              <Switch
                checked={accessibility.highContrast}
                onCheckedChange={(checked) => updateAccessibility({ highContrast: checked })}
                aria-label={language === 'pt' ? 'Ativar alto contraste' : 'Enable high contrast'}
              />
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm">
                    {language === 'pt' ? 'Texto Grande' : 'Large Text'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'pt' ? 'Aumenta tamanho das fontes' : 'Increases font sizes'}
                  </p>
                </div>
              </div>
              <Switch
                checked={accessibility.largeText}
                onCheckedChange={(checked) => updateAccessibility({ largeText: checked })}
                aria-label={language === 'pt' ? 'Ativar texto grande' : 'Enable large text'}
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm">
                    {language === 'pt' ? 'Reduzir Movimento' : 'Reduce Motion'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'pt' ? 'Para sensibilidade visual' : 'For visual sensitivity'}
                  </p>
                </div>
              </div>
              <Switch
                checked={accessibility.reducedMotion}
                onCheckedChange={(checked) => updateAccessibility({ reducedMotion: checked })}
                aria-label={language === 'pt' ? 'Reduzir animações' : 'Reduce animations'}
              />
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm">
                    {language === 'pt' ? 'Leitor de Tela' : 'Screen Reader'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'pt' ? 'Otimiza para leitores' : 'Optimizes for readers'}
                  </p>
                </div>
              </div>
              <Switch
                checked={accessibility.screenReader}
                onCheckedChange={(checked) => updateAccessibility({ screenReader: checked })}
                aria-label={language === 'pt' ? 'Otimizar para leitor de tela' : 'Optimize for screen reader'}
              />
            </div>
          </div>
        </CalmCard>

        {/* Language */}
        <CalmCard>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="font-semibold">{t('profile.language')}</span>
          </div>
          <div className="flex gap-2" role="radiogroup" aria-label={t('profile.language')}>
            {(['pt', 'en'] as Language[]).map((lang) => (
              <Button
                key={lang}
                variant={language === lang ? 'default' : 'outline'}
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
                className="flex-1"
              >
                {lang === 'pt' ? 'Português' : 'English'}
              </Button>
            ))}
          </div>
        </CalmCard>

        <CalmCard hoverable onClick={handleClearHistory}>
          <div className="flex items-center gap-3 text-destructive">
            <Trash2 className="w-5 h-5" aria-hidden="true" />
            <span className="font-semibold">{t('profile.clearHistory')}</span>
          </div>
        </CalmCard>

        <CalmCard>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <span className="font-semibold">{t('profile.privacy')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('profile.privacyText')}</p>
        </CalmCard>

        <CalmCard>
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <span className="font-semibold">{t('profile.about')}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('profile.aboutText')}</p>
        </CalmCard>
      </div>

      <BottomNav />
    </PageContainer>
  );
}
