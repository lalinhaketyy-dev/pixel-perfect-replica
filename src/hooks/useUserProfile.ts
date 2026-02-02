import { useLocalStorage } from './useLocalStorage';

export type AIMode = 'empathetic' | 'rational';

export interface MoodEntry {
  date: string;
  mood: number;
}

export interface UserProfile {
  nickname: string;
  hasCompletedOnboarding: boolean;
  moodHistory: MoodEntry[];
  aiMode: AIMode;
}

const defaultProfile: UserProfile = {
  nickname: '',
  hasCompletedOnboarding: false,
  moodHistory: [],
  aiMode: 'empathetic',
};

export function useUserProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('mindbody-profile', defaultProfile);

  const updateNickname = (nickname: string) => {
    setProfile((prev) => ({ ...prev, nickname }));
  };

  const completeOnboarding = () => {
    setProfile((prev) => ({ ...prev, hasCompletedOnboarding: true }));
  };

  const addMoodEntry = (mood: number) => {
    const entry: MoodEntry = {
      date: new Date().toISOString(),
      mood,
    };
    setProfile((prev) => ({
      ...prev,
      moodHistory: [...prev.moodHistory, entry],
    }));
  };

  const setAIMode = (aiMode: AIMode) => {
    setProfile((prev) => ({ ...prev, aiMode }));
  };

  const clearHistory = () => {
    setProfile((prev) => ({ ...prev, moodHistory: [] }));
  };

  const getAverageMood = (): number | null => {
    if (profile.moodHistory.length === 0) return null;
    const sum = profile.moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return sum / profile.moodHistory.length;
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return {
    profile,
    updateNickname,
    completeOnboarding,
    addMoodEntry,
    setAIMode,
    clearHistory,
    getAverageMood,
    resetProfile,
  };
}
