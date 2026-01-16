import { Footprints, StretchHorizontal, Dumbbell, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageContainer, CalmCard } from '@/components/CalmComponents';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  icon: typeof Footprints;
  titleKey: string;
  descKey: string;
  duration: string;
  steps: string[];
}

export default function PhysicalActivities() {
  const { t, language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activities: Activity[] = [
    {
      id: 'walking',
      icon: Footprints,
      titleKey: 'physical.walking.title',
      descKey: 'physical.walking.description',
      duration: '10-15 min',
      steps: language === 'pt' ? [
        'Sinta seus pés tocando o chão a cada passo',
        'Observe sua respiração entrando e saindo',
        'Note as cores e formas ao seu redor',
        'Escute os sons próximos e distantes',
        'Sinta a temperatura do ar na pele',
        'Mantenha um ritmo calmo e natural'
      ] : [
        'Feel your feet touching the ground with each step',
        'Notice your breath flowing in and out',
        'Observe the colors and shapes around you',
        'Listen to nearby and distant sounds',
        'Feel the air temperature on your skin',
        'Keep a calm, natural pace'
      ]
    },
    {
      id: 'stretching',
      icon: StretchHorizontal,
      titleKey: 'physical.stretching.title',
      descKey: 'physical.stretching.description',
      duration: '5-10 min',
      steps: language === 'pt' ? [
        'Pescoço: Incline a cabeça suavemente para cada lado',
        'Ombros: Gire lentamente para frente e para trás',
        'Braços: Estenda para cima e alongue os lados',
        'Costas: Curve suavemente para frente, relaxe',
        'Pernas: Alongue panturrilhas apoiando-se na parede',
        'Respire fundo durante cada movimento'
      ] : [
        'Neck: Gently tilt head to each side',
        'Shoulders: Slowly roll forward and backward',
        'Arms: Reach up and stretch the sides',
        'Back: Gently curve forward, relax',
        'Legs: Stretch calves using a wall',
        'Breathe deeply during each movement'
      ]
    },
    {
      id: 'exercises',
      icon: Dumbbell,
      titleKey: 'physical.exercises.title',
      descKey: 'physical.exercises.description',
      duration: '5-8 min',
      steps: language === 'pt' ? [
        '10 elevações de joelho alternadas',
        '10 rotações de tornozelo em cada pé',
        '5 agachamentos suaves com apoio',
        '10 elevações de calcanhar',
        '5 inclinações laterais de cada lado',
        'Termine com 3 respirações profundas'
      ] : [
        '10 alternating knee raises',
        '10 ankle rotations each foot',
        '5 gentle squats with support',
        '10 heel raises',
        '5 side bends each side',
        'End with 3 deep breaths'
      ]
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PageContainer>
      <header className="bg-gradient-to-b from-secondary/20 to-background px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold">{t('physical.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('physical.subtitle')}</p>
      </header>

      <div className="p-4 space-y-3">
        {activities.map((act) => {
          const isExpanded = expandedId === act.id;
          
          return (
            <CalmCard 
              key={act.id} 
              hoverable
              onClick={() => toggleExpand(act.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary shrink-0">
                  <act.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{t(act.titleKey)}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{act.duration}</span>
                  </div>
                </div>
                <ChevronRight 
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-90"
                  )} 
                />
              </div>

              <div className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "max-h-96 mt-4" : "max-h-0"
              )}>
                <p className="text-sm text-muted-foreground mb-3">
                  {t(act.descKey)}
                </p>
                <div className="space-y-2">
                  {act.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CalmCard>
          );
        })}
      </div>

      <BottomNav />
    </PageContainer>
  );
}
