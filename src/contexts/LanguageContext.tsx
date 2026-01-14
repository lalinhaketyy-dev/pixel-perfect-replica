import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Welcome & Onboarding
    'welcome.title': 'Bem-vindo ao MindBody AI',
    'welcome.subtitle': 'Seu companheiro de bem-estar mental',
    'welcome.description': 'Estou aqui para te ajudar a cuidar da sua saúde mental com conversas acolhedoras, exercícios de mindfulness e apoio quando você precisar.',
    'welcome.start': 'Começar',
    'welcome.continue': 'Continuar',
    
    // Onboarding
    'onboarding.step1.title': 'Como você está se sentindo hoje?',
    'onboarding.step1.subtitle': 'Não há resposta certa ou errada. Apenas seja honesto consigo mesmo.',
    'onboarding.step2.title': 'Como posso te chamar?',
    'onboarding.step2.subtitle': 'Um apelido carinhoso para nossas conversas',
    'onboarding.step2.placeholder': 'Seu apelido (opcional)',
    'onboarding.step2.skip': 'Pular',
    'onboarding.finish': 'Vamos lá!',
    
    // Mood Scale
    'mood.terrible': 'Muito mal',
    'mood.bad': 'Mal',
    'mood.neutral': 'Neutro',
    'mood.good': 'Bem',
    'mood.great': 'Ótimo',
    
    // Chat
    'chat.title': 'Chat',
    'chat.placeholder': 'Digite sua mensagem...',
    'chat.send': 'Enviar',
    'chat.greeting': 'Olá{name}! Como você está se sentindo hoje? Estou aqui para te ouvir e apoiar. 💙',
    'chat.typing': 'Digitando...',
    
    // Mental Exercises
    'mental.title': 'Exercícios Mentais',
    'mental.subtitle': 'Práticas para acalmar a mente',
    'mental.breathing.title': 'Respiração Guiada',
    'mental.breathing.description': 'Técnica de respiração para reduzir ansiedade',
    'mental.breathing.duration': '5 minutos',
    'mental.gratitude.title': 'Diário de Gratidão',
    'mental.gratitude.description': 'Escreva 3 coisas pelas quais você é grato hoje',
    'mental.gratitude.duration': '10 minutos',
    'mental.mindfulness.title': 'Meditação Mindfulness',
    'mental.mindfulness.description': 'Foque no momento presente',
    'mental.mindfulness.duration': '15 minutos',
    'mental.reframing.title': 'Reestruturação Cognitiva',
    'mental.reframing.description': 'Transforme pensamentos negativos em positivos',
    'mental.reframing.duration': '10 minutos',
    'mental.start': 'Iniciar',
    
    // Breathing Exercise
    'breathing.title': 'Respiração Guiada',
    'breathing.inhale': 'Inspire',
    'breathing.hold': 'Segure',
    'breathing.exhale': 'Expire',
    'breathing.complete': 'Exercício completo!',
    'breathing.back': 'Voltar',
    
    // Physical Activities
    'physical.title': 'Atividades Físicas',
    'physical.subtitle': 'Movimento gentil para o corpo',
    'physical.walking.title': 'Caminhada Consciente',
    'physical.walking.description': 'Caminhe prestando atenção ao ambiente',
    'physical.walking.duration': '15 min',
    'physical.walking.energy': 'Baixa energia',
    'physical.stretching.title': 'Alongamento Suave',
    'physical.stretching.description': 'Movimentos lentos para relaxar os músculos',
    'physical.stretching.duration': '10 min',
    'physical.stretching.energy': 'Baixa energia',
    'physical.exercises.title': 'Exercícios Leves',
    'physical.exercises.description': 'Exercícios simples que podem ser feitos em casa',
    'physical.exercises.duration': '20 min',
    'physical.exercises.energy': 'Energia média',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.nickname': 'Apelido',
    'profile.language': 'Idioma',
    'profile.moodHistory': 'Histórico de Humor',
    'profile.averageMood': 'Humor médio',
    'profile.clearHistory': 'Limpar Histórico',
    'profile.clearHistoryConfirm': 'Tem certeza? Isso apagará todas as suas conversas.',
    'profile.about': 'Sobre',
    'profile.aboutText': 'O MindBody AI é um companheiro de bem-estar mental. Este aplicativo não substitui ajuda profissional. Se você está em crise, procure um profissional de saúde mental.',
    'profile.privacy': 'Privacidade',
    'profile.privacyText': 'Suas conversas são armazenadas localmente no seu dispositivo.',
    
    // Navigation
    'nav.chat': 'Chat',
    'nav.mental': 'Mental',
    'nav.physical': 'Físico',
    'nav.profile': 'Perfil',
    
    // Crisis Support
    'crisis.title': 'Você não está sozinho',
    'crisis.subtitle': 'Estamos aqui para ajudar',
    'crisis.cvv': 'CVV - Centro de Valorização da Vida',
    'crisis.cvvNumber': '188',
    'crisis.cvvDescription': 'Ligação gratuita, 24 horas',
    'crisis.chat': 'Chat Online',
    'crisis.chatDescription': 'Atendimento por chat',
    'crisis.caps': 'CAPS - Centro de Atenção Psicossocial',
    'crisis.capsDescription': 'Procure o CAPS mais próximo de você',
    'crisis.breathing': 'Enquanto isso, respire comigo...',
    'crisis.close': 'Fechar',
    
    // Common
    'common.back': 'Voltar',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.loading': 'Carregando...',
  },
  en: {
    // Welcome & Onboarding
    'welcome.title': 'Welcome to MindBody AI',
    'welcome.subtitle': 'Your mental wellness companion',
    'welcome.description': "I'm here to help you take care of your mental health with supportive conversations, mindfulness exercises, and support when you need it.",
    'welcome.start': 'Get Started',
    'welcome.continue': 'Continue',
    
    // Onboarding
    'onboarding.step1.title': 'How are you feeling today?',
    'onboarding.step1.subtitle': 'There is no right or wrong answer. Just be honest with yourself.',
    'onboarding.step2.title': 'What should I call you?',
    'onboarding.step2.subtitle': 'A friendly name for our conversations',
    'onboarding.step2.placeholder': 'Your nickname (optional)',
    'onboarding.step2.skip': 'Skip',
    'onboarding.finish': "Let's go!",
    
    // Mood Scale
    'mood.terrible': 'Terrible',
    'mood.bad': 'Bad',
    'mood.neutral': 'Neutral',
    'mood.good': 'Good',
    'mood.great': 'Great',
    
    // Chat
    'chat.title': 'Chat',
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send',
    'chat.greeting': 'Hello{name}! How are you feeling today? I\'m here to listen and support you. 💙',
    'chat.typing': 'Typing...',
    
    // Mental Exercises
    'mental.title': 'Mental Exercises',
    'mental.subtitle': 'Practices to calm the mind',
    'mental.breathing.title': 'Guided Breathing',
    'mental.breathing.description': 'Breathing technique to reduce anxiety',
    'mental.breathing.duration': '5 minutes',
    'mental.gratitude.title': 'Gratitude Journal',
    'mental.gratitude.description': 'Write 3 things you are grateful for today',
    'mental.gratitude.duration': '10 minutes',
    'mental.mindfulness.title': 'Mindfulness Meditation',
    'mental.mindfulness.description': 'Focus on the present moment',
    'mental.mindfulness.duration': '15 minutes',
    'mental.reframing.title': 'Cognitive Reframing',
    'mental.reframing.description': 'Transform negative thoughts into positive ones',
    'mental.reframing.duration': '10 minutes',
    'mental.start': 'Start',
    
    // Breathing Exercise
    'breathing.title': 'Guided Breathing',
    'breathing.inhale': 'Inhale',
    'breathing.hold': 'Hold',
    'breathing.exhale': 'Exhale',
    'breathing.complete': 'Exercise complete!',
    'breathing.back': 'Back',
    
    // Physical Activities
    'physical.title': 'Physical Activities',
    'physical.subtitle': 'Gentle movement for the body',
    'physical.walking.title': 'Mindful Walking',
    'physical.walking.description': 'Walk while paying attention to your surroundings',
    'physical.walking.duration': '15 min',
    'physical.walking.energy': 'Low energy',
    'physical.stretching.title': 'Gentle Stretching',
    'physical.stretching.description': 'Slow movements to relax muscles',
    'physical.stretching.duration': '10 min',
    'physical.stretching.energy': 'Low energy',
    'physical.exercises.title': 'Light Exercises',
    'physical.exercises.description': 'Simple exercises that can be done at home',
    'physical.exercises.duration': '20 min',
    'physical.exercises.energy': 'Medium energy',
    
    // Profile
    'profile.title': 'Profile',
    'profile.nickname': 'Nickname',
    'profile.language': 'Language',
    'profile.moodHistory': 'Mood History',
    'profile.averageMood': 'Average mood',
    'profile.clearHistory': 'Clear History',
    'profile.clearHistoryConfirm': 'Are you sure? This will delete all your conversations.',
    'profile.about': 'About',
    'profile.aboutText': 'MindBody AI is a mental wellness companion. This app does not replace professional help. If you are in crisis, please seek a mental health professional.',
    'profile.privacy': 'Privacy',
    'profile.privacyText': 'Your conversations are stored locally on your device.',
    
    // Navigation
    'nav.chat': 'Chat',
    'nav.mental': 'Mental',
    'nav.physical': 'Physical',
    'nav.profile': 'Profile',
    
    // Crisis Support
    'crisis.title': "You're not alone",
    'crisis.subtitle': "We're here to help",
    'crisis.cvv': 'National Suicide Prevention Lifeline',
    'crisis.cvvNumber': '988',
    'crisis.cvvDescription': 'Free, 24/7 support',
    'crisis.chat': 'Online Chat',
    'crisis.chatDescription': 'Chat support available',
    'crisis.caps': 'Mental Health Services',
    'crisis.capsDescription': 'Find mental health services near you',
    'crisis.breathing': 'In the meantime, breathe with me...',
    'crisis.close': 'Close',
    
    // Common
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mindbody-language');
    return (saved as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('mindbody-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
