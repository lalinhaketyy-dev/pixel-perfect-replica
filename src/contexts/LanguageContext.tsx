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
    'welcome.title': 'Bem-vindo ao Mindbody IA',
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
    'chat.placeholder': 'Como você está?',
    'chat.send': 'Enviar',
    'chat.greeting': 'Olá! Como posso ajudar?',
    'chat.typing': 'Digitando...',
    'chat.voiceStart': 'Falar',
    'chat.voiceStop': 'Parar',
    'chat.voiceConnecting': 'Conectando...',
    'chat.listening': 'Ouvindo...',
    'chat.speaking': 'Falando...',
    'chat.modeEmpathetic': 'Modo Empático',
    'chat.modeRational': 'Modo Racional',
    
    // Mental Exercises
    'mental.title': 'Exercícios Mentais',
    'mental.subtitle': 'Práticas para acalmar a mente',
    'mental.breathing.title': 'Respiração 4-7-8',
    'mental.breathing.description': 'Técnica de relaxamento profundo para ansiedade',
    'mental.breathing.duration': '5 minutos',
    'mental.box.title': 'Respiração Quadrada',
    'mental.box.description': 'Técnica 4-4-4-4 para acalmar a mente rapidamente',
    'mental.box.duration': '4 minutos',
    'mental.box.subtitle': 'Técnica 4-4-4-4 de calmaria',
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
    'breathing.completeMessage': 'Você fez um ótimo trabalho cuidando de si mesmo.',
    'breathing.back': 'Voltar',
    'breathing.start': 'Iniciar',
    'breathing.pause': 'Pausar',
    'breathing.restart': 'Recomeçar',
    'breathing.technique': 'Técnica 4-7-8 para relaxamento profundo',
    
    // Gratitude Journal
    'gratitude.subtitle': 'Cultive a gratidão diariamente',
    'gratitude.todayProgress': 'Progresso de hoje',
    'gratitude.complete': 'Parabéns! Você completou sua prática de gratidão hoje.',
    'gratitude.placeholder': 'Pelo que você é grato hoje?',
    'gratitude.empty': 'Comece escrevendo sua primeira gratidão...',
    
    // Mindfulness
    'mindfulness.subtitle': '15 minutos de presença plena',
    'mindfulness.complete': 'Meditação concluída!',
    'mindfulness.completeMessage': 'Você dedicou um momento valioso para si mesmo.',
    'mindfulness.start': 'Iniciar',
    'mindfulness.pause': 'Pausar',
    'mindfulness.step1': 'Encontre uma posição confortável e feche os olhos...',
    'mindfulness.step2': 'Observe sua respiração naturalmente, sem tentar mudá-la...',
    'mindfulness.step3': 'Sinta seus pés no chão, seu corpo na cadeira...',
    'mindfulness.step4': 'Quando pensamentos surgirem, apenas observe-os passar como nuvens...',
    'mindfulness.step5': 'Traga sua atenção de volta para a respiração gentilmente...',
    'mindfulness.step6': 'Expanda sua consciência para todo o seu corpo...',
    'mindfulness.step7': 'Lentamente, prepare-se para retornar ao momento presente...',
    
    // Cognitive Reframing
    'reframing.subtitle': 'Transforme seus pensamentos',
    'reframing.step1.title': 'Identifique o pensamento negativo',
    'reframing.step1.description': 'Escreva o pensamento que está te incomodando, exatamente como ele aparece na sua mente.',
    'reframing.step1.placeholder': 'Ex: "Eu nunca vou conseguir fazer isso direito..."',
    'reframing.step2.title': 'Examine as evidências',
    'reframing.step2.description': 'O que as evidências reais dizem? Esse pensamento é 100% verdade?',
    'reframing.step2.placeholder': 'Ex: "Na verdade, já consegui fazer várias coisas difíceis antes..."',
    'reframing.step3.title': 'Reformule o pensamento',
    'reframing.step3.description': 'Agora, reescreva o pensamento de forma mais equilibrada e realista.',
    'reframing.step3.placeholder': 'Ex: "É desafiador, mas posso aprender e melhorar com a prática..."',
    'reframing.yourThought': 'Seu pensamento original:',
    'reframing.yourEvidence': 'Suas evidências:',
    'reframing.complete': 'Transformação concluída!',
    'reframing.completeMessage': 'Você praticou uma habilidade poderosa da TCC.',
    'reframing.before': 'Antes',
    'reframing.after': 'Depois',
    'reframing.tryAnother': 'Praticar novamente',
    
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
    'profile.aboutText': 'O Mindbody IA é um companheiro de bem-estar mental. Este aplicativo não substitui ajuda profissional. Se você está em crise, procure um profissional de saúde mental.',
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
    
    // Music Player
    'music.toggle': 'Ondas sonoras relaxantes',
    'music.title': 'Ondas 432 Hz',
    'music.description': 'Frequência de 432 Hz com ondas binaurais que acalmam a mente e reduzem o estresse. Feche os olhos e respire fundo.',
    'music.volume': 'Volume',
    'music.playing': 'Reproduzindo ondas de calmaria...',
    
    // Common
    'common.back': 'Voltar',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.loading': 'Carregando...',
  },
  en: {
    // Welcome & Onboarding
    'welcome.title': 'Welcome to Mindbody IA',
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
    'chat.placeholder': 'How are you?',
    'chat.send': 'Send',
    'chat.greeting': 'Hi! How can I help?',
    'chat.typing': 'Typing...',
    'chat.voiceStart': 'Speak',
    'chat.voiceStop': 'Stop',
    'chat.voiceConnecting': 'Connecting...',
    'chat.listening': 'Listening...',
    'chat.speaking': 'Speaking...',
    'chat.modeEmpathetic': 'Empathetic Mode',
    'chat.modeRational': 'Rational Mode',
    
    // Mental Exercises
    'mental.title': 'Mental Exercises',
    'mental.subtitle': 'Practices to calm the mind',
    'mental.breathing.title': '4-7-8 Breathing',
    'mental.breathing.description': 'Deep relaxation technique for anxiety',
    'mental.breathing.duration': '5 minutes',
    'mental.box.title': 'Box Breathing',
    'mental.box.description': '4-4-4-4 technique to quickly calm the mind',
    'mental.box.duration': '4 minutes',
    'mental.box.subtitle': '4-4-4-4 calming technique',
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
    'breathing.completeMessage': 'Great job taking care of yourself.',
    'breathing.back': 'Back',
    'breathing.start': 'Start',
    'breathing.pause': 'Pause',
    'breathing.restart': 'Restart',
    'breathing.technique': '4-7-8 technique for deep relaxation',
    
    // Gratitude Journal
    'gratitude.subtitle': 'Cultivate daily gratitude',
    'gratitude.todayProgress': "Today's progress",
    'gratitude.complete': 'Congratulations! You completed your gratitude practice today.',
    'gratitude.placeholder': 'What are you grateful for today?',
    'gratitude.empty': 'Start by writing your first gratitude...',
    
    // Mindfulness
    'mindfulness.subtitle': '15 minutes of mindful presence',
    'mindfulness.complete': 'Meditation complete!',
    'mindfulness.completeMessage': 'You dedicated a valuable moment to yourself.',
    'mindfulness.start': 'Start',
    'mindfulness.pause': 'Pause',
    'mindfulness.step1': 'Find a comfortable position and close your eyes...',
    'mindfulness.step2': 'Observe your breathing naturally, without trying to change it...',
    'mindfulness.step3': 'Feel your feet on the ground, your body in the chair...',
    'mindfulness.step4': 'When thoughts arise, just watch them pass like clouds...',
    'mindfulness.step5': 'Gently bring your attention back to your breath...',
    'mindfulness.step6': 'Expand your awareness to your entire body...',
    'mindfulness.step7': 'Slowly, prepare to return to the present moment...',
    
    // Cognitive Reframing
    'reframing.subtitle': 'Transform your thoughts',
    'reframing.step1.title': 'Identify the negative thought',
    'reframing.step1.description': 'Write down the thought that is bothering you, exactly as it appears in your mind.',
    'reframing.step1.placeholder': 'E.g., "I will never get this right..."',
    'reframing.step2.title': 'Examine the evidence',
    'reframing.step2.description': 'What does the real evidence say? Is this thought 100% true?',
    'reframing.step2.placeholder': 'E.g., "Actually, I have accomplished many difficult things before..."',
    'reframing.step3.title': 'Reframe the thought',
    'reframing.step3.description': 'Now, rewrite the thought in a more balanced and realistic way.',
    'reframing.step3.placeholder': 'E.g., "It is challenging, but I can learn and improve with practice..."',
    'reframing.yourThought': 'Your original thought:',
    'reframing.yourEvidence': 'Your evidence:',
    'reframing.complete': 'Transformation complete!',
    'reframing.completeMessage': 'You practiced a powerful CBT skill.',
    'reframing.before': 'Before',
    'reframing.after': 'After',
    'reframing.tryAnother': 'Practice again',
    
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
    'profile.aboutText': 'Mindbody IA is a mental wellness companion. This app does not replace professional help. If you are in crisis, please seek a mental health professional.',
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
    
    // Music Player
    'music.toggle': 'Relaxing sound waves',
    'music.title': '432 Hz Waves',
    'music.description': '432 Hz frequency with binaural waves that calm the mind and reduce stress. Close your eyes and breathe deeply.',
    'music.volume': 'Volume',
    'music.playing': 'Playing calming waves...',
    
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
