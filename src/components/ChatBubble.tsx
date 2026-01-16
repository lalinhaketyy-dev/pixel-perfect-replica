import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ message, isUser, timestamp }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex animate-slide-up',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card text-card-foreground rounded-bl-sm'
          )}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap">{message}</p>
          {timestamp && (
            <p
              className={cn(
                'text-xs mt-1 opacity-70',
                isUser ? 'text-right' : 'text-left'
              )}
            >
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = 'ChatBubble';

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-1" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-2" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-3" />
        </div>
      </div>
    </div>
  );
}
