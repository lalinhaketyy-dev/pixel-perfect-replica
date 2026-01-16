import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { PageContainer } from '@/components/CalmComponents';
import { ChatBubble, TypingIndicator } from '@/components/ChatBubble';
import { CrisisSupport } from '@/components/CrisisSupport';
import { BottomNav } from '@/components/BottomNav';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const CRISIS_KEYWORDS = ['suicid', 'morrer', 'matar', 'die', 'kill', 'suicide', 'end my life', 'acabar com tudo'];

export default function Chat() {
  const { t, language } = useLanguage();
  const { profile } = useUserProfile();
  const { messages, isLoading, setIsLoading, addMessage, updateLastAssistantMessage, getRecentMessages } = useChatMessages();
  const { toast } = useToast();
  
  const [input, setInput] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const nameText = profile.nickname ? `, ${profile.nickname}` : '';
      const greeting = t('chat.greeting').replace('{name}', nameText);
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
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

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
      updateLastAssistantMessage(language === 'pt' 
        ? 'Desculpe, ocorreu um erro. Por favor, tente novamente.' 
        : 'Sorry, an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col h-screen">
        <header className="bg-card border-b border-border px-4 py-4 flex items-center justify-between">
          <div /> {/* Spacer */}
          <h1 className="text-xl font-bold text-center">{t('chat.title')}</h1>
          <MusicPlayer />
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
              placeholder={t('chat.placeholder')}
              className="flex-1"
              disabled={isLoading || voice.isConnected}
            />
            
            {/* Voice button */}
            <button
              onClick={voice.isConnected ? voice.disconnect : voice.connect}
              disabled={voice.isConnecting}
              className={`p-3 rounded-xl transition-all ${
                voice.isConnected 
                  ? 'bg-destructive text-destructive-foreground animate-pulse' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
              } disabled:opacity-50`}
              title={voice.isConnected ? t('chat.voiceStop') : t('chat.voiceStart')}
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
