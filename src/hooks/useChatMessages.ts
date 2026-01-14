import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function useChatMessages() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('mindbody-messages', []);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, [setMessages]);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const lastIndex = prev.length - 1;
      if (lastIndex >= 0 && prev[lastIndex].role === 'assistant') {
        const updated = [...prev];
        updated[lastIndex] = { ...updated[lastIndex], content };
        return updated;
      }
      return prev;
    });
  }, [setMessages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const getRecentMessages = useCallback((count: number = 10): ChatMessage[] => {
    return messages.slice(-count);
  }, [messages]);

  return {
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    updateLastAssistantMessage,
    clearMessages,
    getRecentMessages,
  };
}
