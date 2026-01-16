import { forwardRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MessageCircle, Heart, Activity, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  className?: string;
}

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(
  function BottomNav({ className }, ref) {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/chat', icon: MessageCircle, labelKey: 'nav.chat' },
    { path: '/mental', icon: Heart, labelKey: 'nav.mental' },
    { path: '/physical', icon: Activity, labelKey: 'nav.physical' },
    { path: '/profile', icon: User, labelKey: 'nav.profile' },
  ];

    return (
      <nav
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40',
          className
        )}
      >
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span className="text-xs font-medium">{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    );
  }
);
