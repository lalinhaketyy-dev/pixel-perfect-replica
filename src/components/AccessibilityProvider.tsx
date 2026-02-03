import { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useUserProfile();
  const { accessibility } = profile;

  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (accessibility?.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text mode
    if (accessibility?.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Reduced motion
    if (accessibility?.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Screen reader optimizations
    if (accessibility?.screenReader) {
      root.classList.add('screen-reader');
    } else {
      root.classList.remove('screen-reader');
    }
  }, [accessibility]);

  return <>{children}</>;
}
