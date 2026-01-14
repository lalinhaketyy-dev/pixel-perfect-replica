import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { MoodScale } from '@/components/MoodScale';
import { CalmButton } from '@/components/CalmComponents';
import { Input } from '@/components/ui/input';

export default function Welcome() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { updateNickname, addMoodEntry, completeOnboarding } = useUserProfile();
  
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<number | undefined>();
  const [nickname, setNickname] = useState('');

  const handleContinue = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1 && mood) {
      addMoodEntry(mood);
      setStep(2);
    } else if (step === 2) {
      if (nickname.trim()) updateNickname(nickname.trim());
      completeOnboarding();
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-breathe-slow">
              <span className="text-5xl">🧘</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t('welcome.title')}</h1>
            <p className="text-lg text-muted-foreground">{t('welcome.subtitle')}</p>
            <p className="text-muted-foreground">{t('welcome.description')}</p>
            <CalmButton onClick={handleContinue} size="lg" className="w-full mt-8">
              {t('welcome.start')}
            </CalmButton>
          </div>
        )}

        {step === 1 && (
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-bold text-foreground">{t('onboarding.step1.title')}</h2>
            <p className="text-muted-foreground">{t('onboarding.step1.subtitle')}</p>
            <MoodScale value={mood} onChange={setMood} size="lg" />
            <CalmButton onClick={handleContinue} size="lg" className="w-full" disabled={!mood}>
              {t('welcome.continue')}
            </CalmButton>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-bold text-foreground">{t('onboarding.step2.title')}</h2>
            <p className="text-muted-foreground">{t('onboarding.step2.subtitle')}</p>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t('onboarding.step2.placeholder')}
              className="text-center text-lg h-14"
            />
            <div className="space-y-3">
              <CalmButton onClick={handleContinue} size="lg" className="w-full">
                {t('onboarding.finish')}
              </CalmButton>
              <button onClick={handleContinue} className="text-muted-foreground hover:text-foreground">
                {t('onboarding.step2.skip')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
