import { Footprints, StretchHorizontal, Dumbbell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageContainer, CalmCard } from '@/components/CalmComponents';
import { BottomNav } from '@/components/BottomNav';

export default function PhysicalActivities() {
  const { t } = useLanguage();

  const activities = [
    { icon: Footprints, titleKey: 'physical.walking.title', descKey: 'physical.walking.description', durationKey: 'physical.walking.duration', energyKey: 'physical.walking.energy' },
    { icon: StretchHorizontal, titleKey: 'physical.stretching.title', descKey: 'physical.stretching.description', durationKey: 'physical.stretching.duration', energyKey: 'physical.stretching.energy' },
    { icon: Dumbbell, titleKey: 'physical.exercises.title', descKey: 'physical.exercises.description', durationKey: 'physical.exercises.duration', energyKey: 'physical.exercises.energy' },
  ];

  return (
    <PageContainer>
      <header className="bg-gradient-to-b from-secondary/20 to-background px-6 pt-12 pb-8">
        <h1 className="text-2xl font-bold">{t('physical.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('physical.subtitle')}</p>
      </header>

      <div className="p-6 space-y-4">
        {activities.map((act, i) => (
          <CalmCard key={i} hoverable>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                <act.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{t(act.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t(act.descKey)}</p>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-primary">{t(act.durationKey)}</span>
                  <span className="text-muted-foreground">{t(act.energyKey)}</span>
                </div>
              </div>
            </div>
          </CalmCard>
        ))}
      </div>

      <BottomNav />
    </PageContainer>
  );
}
