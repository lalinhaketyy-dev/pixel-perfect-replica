import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { GlobalMusicPlayer } from "@/components/GlobalMusicPlayer";
import Welcome from "./pages/Welcome";
import Chat from "./pages/Chat";
import MentalExercises from "./pages/MentalExercises";
import BreathingExercise from "./pages/BreathingExercise";
import BoxBreathing from "./pages/BoxBreathing";
import GratitudeJournal from "./pages/GratitudeJournal";
import MindfulnessExercise from "./pages/MindfulnessExercise";
import CognitiveReframing from "./pages/CognitiveReframing";
import PhysicalActivities from "./pages/PhysicalActivities";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { profile } = useUserProfile();

  if (!profile.hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="*" element={<Welcome />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/mental" element={<MentalExercises />} />
        <Route path="/mental/breathing" element={<BreathingExercise />} />
        <Route path="/mental/box" element={<BoxBreathing />} />
        <Route path="/mental/gratitude" element={<GratitudeJournal />} />
        <Route path="/mental/mindfulness" element={<MindfulnessExercise />} />
        <Route path="/mental/reframing" element={<CognitiveReframing />} />
      <Route path="/physical" element={<PhysicalActivities />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Floating music indicator
function FloatingMusicIndicator() {
  const { profile } = useUserProfile();
  
  if (!profile.hasCompletedOnboarding) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <GlobalMusicPlayer minimal />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <MusicProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FloatingMusicIndicator />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </MusicProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
