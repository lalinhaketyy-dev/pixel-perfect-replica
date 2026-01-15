import { useState } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageContainer, CalmButton } from '@/components/CalmComponents';
import { BreathingCircle } from '@/components/BreathingCircle';

export default function BreathingExercise() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
  };

  const handleReset = () => {
    setIsComplete(false);
    setIsActive(false);
  };

  const handleToggle = () => {
    if (isComplete) {
      handleReset();
    }
    setIsActive(!isActive);
  };

  return (
    <PageContainer withBottomNav={false}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gradient-to-b from-primary/10 to-background px-6 pt-12 pb-6">
          <button
            onClick={() => navigate('/mental')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
          <h1 className="text-2xl font-bold">{t('mental.breathing.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('breathing.technique')}</p>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          <BreathingCircle 
            isActive={isActive} 
            onComplete={handleComplete}
          />

          {isComplete && (
            <div className="text-center animate-fade-in">
              <p className="text-xl font-semibold text-primary mb-2">
                {t('breathing.complete')}
              </p>
              <p className="text-muted-foreground">
                {t('breathing.completeMessage')}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <CalmButton
              onClick={handleToggle}
              variant="primary"
              size="lg"
              className="min-w-[140px]"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2 inline" />
                  {t('breathing.pause')}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 inline" />
                  {isComplete ? t('breathing.restart') : t('breathing.start')}
                </>
              )}
            </CalmButton>

            {(isActive || isComplete) && (
              <CalmButton
                onClick={handleReset}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-5 h-5" />
              </CalmButton>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
