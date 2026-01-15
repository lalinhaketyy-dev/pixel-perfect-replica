import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageContainer, CalmButton } from '@/components/CalmComponents';

const TOTAL_DURATION = 15 * 60; // 15 minutes in seconds

const GUIDED_STEPS = [
  { time: 0, key: 'mindfulness.step1' },
  { time: 60, key: 'mindfulness.step2' },
  { time: 180, key: 'mindfulness.step3' },
  { time: 300, key: 'mindfulness.step4' },
  { time: 480, key: 'mindfulness.step5' },
  { time: 660, key: 'mindfulness.step6' },
  { time: 840, key: 'mindfulness.step7' },
];

export default function MindfulnessExercise() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeElapsed < TOTAL_DURATION) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev + 1 >= TOTAL_DURATION) {
            setIsActive(false);
            setIsComplete(true);
            return TOTAL_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeElapsed]);

  const getCurrentStep = () => {
    for (let i = GUIDED_STEPS.length - 1; i >= 0; i--) {
      if (timeElapsed >= GUIDED_STEPS[i].time) {
        return GUIDED_STEPS[i];
      }
    }
    return GUIDED_STEPS[0];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTimeElapsed(0);
    setIsActive(false);
    setIsComplete(false);
  };

  const progress = (timeElapsed / TOTAL_DURATION) * 100;
  const currentStep = getCurrentStep();

  return (
    <PageContainer withBottomNav={false}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gradient-to-b from-lavender/30 to-background px-6 pt-12 pb-6">
          <button
            onClick={() => navigate('/mental')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
          <h1 className="text-2xl font-bold">{t('mental.mindfulness.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('mindfulness.subtitle')}</p>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          {/* Timer circle */}
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                strokeLinecap="round"
                className="text-lavender transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(timeElapsed)}</span>
              <span className="text-sm text-muted-foreground mt-1">
                / {formatTime(TOTAL_DURATION)}
              </span>
            </div>
          </div>

          {/* Current guidance */}
          <div className="text-center max-w-sm animate-fade-in" key={currentStep.key}>
            <p className="text-lg text-foreground">{t(currentStep.key)}</p>
          </div>

          {isComplete && (
            <div className="text-center animate-fade-in">
              <p className="text-xl font-semibold text-lavender mb-2">
                {t('mindfulness.complete')}
              </p>
              <p className="text-muted-foreground">
                {t('mindfulness.completeMessage')}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4">
            <CalmButton
              onClick={() => setIsActive(!isActive)}
              variant="primary"
              size="lg"
              className="min-w-[140px]"
              disabled={isComplete}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2 inline" />
                  {t('mindfulness.pause')}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 inline" />
                  {t('mindfulness.start')}
                </>
              )}
            </CalmButton>

            {(timeElapsed > 0 || isComplete) && (
              <CalmButton onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="w-5 h-5" />
              </CalmButton>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
