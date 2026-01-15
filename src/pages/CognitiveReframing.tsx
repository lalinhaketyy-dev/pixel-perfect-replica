import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageContainer, CalmCard, CalmButton } from '@/components/CalmComponents';
import { Textarea } from '@/components/ui/textarea';

type Step = 'identify' | 'examine' | 'reframe' | 'complete';

export default function CognitiveReframing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identify');
  const [negativeThought, setNegativeThought] = useState('');
  const [evidence, setEvidence] = useState('');
  const [reframedThought, setReframedThought] = useState('');

  const steps: Step[] = ['identify', 'examine', 'reframe', 'complete'];
  const currentStepIndex = steps.indexOf(step);

  const canProceed = () => {
    switch (step) {
      case 'identify':
        return negativeThought.trim().length > 0;
      case 'examine':
        return evidence.trim().length > 0;
      case 'reframe':
        return reframedThought.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const handleReset = () => {
    setStep('identify');
    setNegativeThought('');
    setEvidence('');
    setReframedThought('');
  };

  return (
    <PageContainer withBottomNav={false}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gradient-to-b from-secondary/20 to-background px-6 pt-12 pb-6">
          <button
            onClick={() => navigate('/mental')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
          <h1 className="text-2xl font-bold">{t('mental.reframing.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('reframing.subtitle')}</p>
        </header>

        {/* Progress */}
        <div className="px-6 py-4">
          <div className="flex gap-2">
            {steps.slice(0, -1).map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  i <= currentStepIndex ? 'bg-secondary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 p-6">
          {step === 'identify' && (
            <div className="space-y-6 animate-fade-in">
              <CalmCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-destructive font-bold">1</span>
                  </div>
                  <h2 className="font-semibold">{t('reframing.step1.title')}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{t('reframing.step1.description')}</p>
                <Textarea
                  value={negativeThought}
                  onChange={(e) => setNegativeThought(e.target.value)}
                  placeholder={t('reframing.step1.placeholder')}
                  className="min-h-[120px]"
                />
              </CalmCard>
            </div>
          )}

          {step === 'examine' && (
            <div className="space-y-6 animate-fade-in">
              <CalmCard className="bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t('reframing.yourThought')}</p>
                <p className="italic">"{negativeThought}"</p>
              </CalmCard>
              
              <CalmCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h2 className="font-semibold">{t('reframing.step2.title')}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{t('reframing.step2.description')}</p>
                <Textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder={t('reframing.step2.placeholder')}
                  className="min-h-[120px]"
                />
              </CalmCard>
            </div>
          )}

          {step === 'reframe' && (
            <div className="space-y-6 animate-fade-in">
              <CalmCard className="bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t('reframing.yourThought')}</p>
                <p className="italic mb-3">"{negativeThought}"</p>
                <p className="text-sm text-muted-foreground mb-1">{t('reframing.yourEvidence')}</p>
                <p className="text-sm">{evidence}</p>
              </CalmCard>
              
              <CalmCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-secondary font-bold">3</span>
                  </div>
                  <h2 className="font-semibold">{t('reframing.step3.title')}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{t('reframing.step3.description')}</p>
                <Textarea
                  value={reframedThought}
                  onChange={(e) => setReframedThought(e.target.value)}
                  placeholder={t('reframing.step3.placeholder')}
                  className="min-h-[120px]"
                />
              </CalmCard>
            </div>
          )}

          {step === 'complete' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t('reframing.complete')}</h2>
                <p className="text-muted-foreground">{t('reframing.completeMessage')}</p>
              </div>

              <CalmCard>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {t('reframing.before')}
                    </p>
                    <p className="text-destructive/80 line-through">"{negativeThought}"</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {t('reframing.after')}
                    </p>
                    <p className="text-secondary font-medium">"{reframedThought}"</p>
                  </div>
                </div>
              </CalmCard>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="p-6 bg-card border-t border-border">
          <div className="flex gap-3">
            {step !== 'identify' && step !== 'complete' && (
              <CalmButton onClick={handleBack} variant="outline" className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back')}
              </CalmButton>
            )}
            
            {step !== 'complete' ? (
              <CalmButton
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1"
              >
                {t('welcome.continue')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </CalmButton>
            ) : (
              <CalmButton onClick={handleReset} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('reframing.tryAnother')}
              </CalmButton>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
