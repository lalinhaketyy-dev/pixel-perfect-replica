import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Brain, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProfile, AIMode } from '@/hooks/useUserProfile';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { useMusic } from '@/contexts/MusicContext';
import { PageContainer } from '@/components/CalmComponents';
import { ChatBubble, TypingIndicator } from '@/components/ChatBubble';
import { CrisisSupport } from '@/components/CrisisSupport';
import { BottomNav } from '@/components/BottomNav';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Extended crisis keywords
const CRISIS_KEYWORDS = [
  'suicídio', 'suicidio', 'suicidar', 'me matar', 'matar-me', 'quero morrer', 
  'vou morrer', 'acabar com tudo', 'não aguento mais', 'nao aguento mais',
  'automutilação', 'automutilacao', 'me cortar', 'cortar-me', 'me machucar',
  'sem saída', 'sem saida', 'não vale a pena', 'nao vale a pena',
  'melhor sem mim', 'desistir da vida', 'acabar comigo', 'tirar minha vida',
  'não quero viver', 'nao quero viver', 'cansei de viver',
  'quero sumir', 'desaparecer', 'ninguém se importa', 'ninguem se importa',
  'suicide', 'kill myself', 'end my life', 'want to die', 'wanna die',
  'self-harm', 'cut myself', 'hurt myself', 'no way out', 'not worth it',
  'better off dead', 'give up on life', 'take my life', 'end it all',
  'dont want to live', "don't want to live", 'tired of living',
  'nobody cares', 'no one cares', 'burden to everyone',
];

export default function Chat() {
  const { t, language } = useLanguage();
  const { profile, setAIMode } = useUserProfile();
  const { messages, isLoading, setIsLoading, addMessage, updateLastAssistantMessage, getRecentMessages } = useChatMessages();
  const { toast } = useToast();
  const { isPlaying, play } = useMusic();
  
  const [input, setInput] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Start music on first interaction
  useEffect(() => {
    if (!isPlaying) {
      const handleInteraction = () => {
        play();
        document.removeEventListener('click', handleInteraction);
      };
      document.addEventListener('click', handleInteraction);
      return () => document.removeEventListener('click', handleInteraction);
    }
  }, [isPlaying, play]);

  const voice = useRealtimeVoice({
    language,
    nickname: profile.nickname,
    onTranscript: (text, isUser) => {
      if (isUser) {
        addMessage('user', text);
        if (checkForCrisis(text)) setShowCrisis(true);
      } else {
        addMessage('assistant', text);
      }
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Erro', description: error });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = language === 'pt' 
        ? profile.nickname 
          ? `Oi, ${profile.nickname}. Como você está?` 
          : 'Oi. Como você está?'
        : profile.nickname 
          ? `Hi ${profile.nickname}. How are you?` 
          : 'Hi. How are you?';
      addMessage('assistant', greeting);
    }
  }, []);

  const checkForCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);

    if (checkForCrisis(userMessage)) {
      setShowCrisis(true);
    }

    setIsLoading(true);
    addMessage('assistant', '');

    try {
      const recentMessages = getRecentMessages(10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: recentMessages,
          language,
          nickname: profile.nickname,
          aiMode: profile.aiMode,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(language === 'pt' ? 'Aguarde um momento.' : 'Please wait.');
        }
        throw new Error('Failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  updateLastAssistantMessage(assistantContent);
                }
              } catch {}
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error instanceof Error ? error.message : (language === 'pt' ? 'Erro.' : 'Error.');
      updateLastAssistantMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAIMode = () => {
    const newMode: AIMode = profile.aiMode === 'empathetic' ? 'rational' : 'empathetic';
    setAIMode(newMode);
    toast({
      title: language === 'pt' 
        ? (newMode === 'empathetic' ? 'Modo Empático' : 'Modo Racional')
        : (newMode === 'empathetic' ? 'Empathetic Mode' : 'Rational Mode'),
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col h-screen">
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleAIMode}
            className={cn(
              'p-2 rounded-xl transition-all flex items-center gap-2',
              profile.aiMode === 'empathetic' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-secondary/50 text-secondary-foreground'
            )}
          >
            {profile.aiMode === 'empathetic' ? (
              <Heart className="w-5 h-5" />
            ) : (
              <Brain className="w-5 h-5" />
            )}
            <span className="text-xs font-medium">
              {language === 'pt' 
                ? (profile.aiMode === 'empathetic' ? 'Empático' : 'Racional')
                : (profile.aiMode === 'empathetic' ? 'Empathetic' : 'Rational')
              }
            </span>
          </button>
          <h1 className="text-lg font-bold">Chat</h1>
          <div className="w-20" /> {/* Spacer for balance */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg.content} isUser={msg.role === 'user'} timestamp={msg.timestamp} />
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-card border-t border-border mb-16">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={language === 'pt' ? 'Fale comigo...' : 'Talk to me...'}
              className="flex-1"
              disabled={isLoading || voice.isConnected}
            />
            
            <button
              onClick={voice.isConnected ? voice.disconnect : voice.connect}
              disabled={voice.isConnecting}
              className={cn(
                'p-3 rounded-xl transition-all',
                voice.isConnected 
                  ? 'bg-destructive text-destructive-foreground animate-pulse' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
                'disabled:opacity-50'
              )}
            >
              {voice.isConnected ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim() || voice.isConnected}
              className="p-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {voice.isConnected && (
            <p className="text-center text-sm text-muted-foreground mt-2 animate-pulse">
              {voice.isSpeaking ? t('chat.speaking') : t('chat.listening')}
            </p>
          )}
        </div>
      </div>

      <BottomNav />
      <CrisisSupport isOpen={showCrisis} onClose={() => setShowCrisis(false)} />
    </PageContainer>
  );
}
