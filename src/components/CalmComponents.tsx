import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';

interface CalmCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function CalmCard({ children, className, onClick, hoverable = false }: CalmCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-2xl p-6 shadow-sm border border-border/50',
        hoverable && 'hover:shadow-md hover:border-primary/20 transition-all cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CalmButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function CalmButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  type = 'button',
}: CalmButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl font-semibold transition-all duration-200 transform active:scale-95',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed active:scale-100',
        className
      )}
    >
      {children}
    </button>
  );
}

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className, withBottomNav = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen bg-background',
          withBottomNav && 'pb-20',
          className
        )}
      >
        {children}
      </div>
    );
  }
);

PageContainer.displayName = 'PageContainer';
