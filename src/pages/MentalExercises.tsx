import { Wind, BookHeart, Brain, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageContainer, CalmCard } from '@/components/CalmComponents';
import { BottomNav } from '@/components/BottomNav';

export default function MentalExercises() {
  const { t } = useLanguage();

  const exercises = [
    { icon: Wind, titleKey: 'mental.breathing.title', descKey: 'mental.breathing.description', durationKey: 'mental.breathing.duration', color: 'bg-primary/10 text-primary' },
    { icon: BookHeart, titleKey: 'mental.gratitude.title', descKey: 'mental.gratitude.description', durationKey: 'mental.gratitude.duration', color: 'bg-soft/50 text-soft-dark' },
    { icon: Brain, titleKey: 'mental.mindfulness.title', descKey: 'mental.mindfulness.description', durationKey: 'mental.mindfulness.duration', color: 'bg-lavender/30 text-lavender-dark' },
    { icon: Lightbulb, titleKey: 'mental.reframing.title', descKey: 'mental.reframing.description', durationKey: 'mental.reframing.duration', color: 'bg-secondary/10 text-secondary' },
  ];

  return (
    <PageContainer>
      <header className="bg-gradient-to-b from-lavender/30 to-background px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold">{t('mental.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('mental.subtitle')}</p>
      </header>

      <div className="p-6 space-y-4">
        {exercises.map((ex, i) => (
          <CalmCard key={i} hoverable>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${ex.color}`}>
                <ex.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t(ex.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t(ex.descKey)}</p>
                <p className="text-xs text-primary mt-2">{t(ex.durationKey)}</p>
              </div>
            </div>
          </CalmCard>
        ))}
      </div>

      <BottomNav />
    </PageContainer>
  );
}
