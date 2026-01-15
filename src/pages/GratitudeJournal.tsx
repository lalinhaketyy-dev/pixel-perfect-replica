import { useState } from 'react';
import { ArrowLeft, Plus, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PageContainer, CalmCard, CalmButton } from '@/components/CalmComponents';
import { Input } from '@/components/ui/input';

interface GratitudeEntry {
  id: string;
  text: string;
  date: string;
}

export default function GratitudeJournal() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [entries, setEntries] = useLocalStorage<GratitudeEntry[]>('mindbody-gratitude', []);
  const [newEntry, setNewEntry] = useState('');
  const [todayCount, setTodayCount] = useState(() => {
    const today = new Date().toDateString();
    return entries.filter(e => new Date(e.date).toDateString() === today).length;
  });

  const addEntry = () => {
    if (!newEntry.trim() || todayCount >= 3) return;
    
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      text: newEntry.trim(),
      date: new Date().toISOString(),
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
    setTodayCount(prev => prev + 1);
  };

  const deleteEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry && new Date(entry.date).toDateString() === new Date().toDateString()) {
      setTodayCount(prev => prev - 1);
    }
    setEntries(entries.filter(e => e.id !== id));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <PageContainer withBottomNav={false}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gradient-to-b from-soft/30 to-background px-6 pt-12 pb-6">
          <button
            onClick={() => navigate('/mental')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
          </button>
          <h1 className="text-2xl font-bold">{t('mental.gratitude.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('gratitude.subtitle')}</p>
        </header>

        <div className="flex-1 p-6 space-y-6">
          {/* Progress indicator */}
          <CalmCard>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">{t('gratitude.todayProgress')}</span>
              <span className="text-primary font-bold">{todayCount}/3</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    i <= todayCount ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            {todayCount >= 3 && (
              <p className="text-sm text-secondary mt-3 flex items-center gap-2">
                <Check className="w-4 h-4" />
                {t('gratitude.complete')}
              </p>
            )}
          </CalmCard>

          {/* Add new entry */}
          {todayCount < 3 && (
            <div className="flex gap-2">
              <Input
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEntry()}
                placeholder={t('gratitude.placeholder')}
                className="flex-1"
              />
              <CalmButton onClick={addEntry} disabled={!newEntry.trim()}>
                <Plus className="w-5 h-5" />
              </CalmButton>
            </div>
          )}

          {/* Entries list */}
          <div className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('gratitude.empty')}
              </p>
            ) : (
              entries.map((entry) => (
                <CalmCard key={entry.id} className="animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-soft/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-soft-dark">♥</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{entry.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CalmCard>
              ))
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
