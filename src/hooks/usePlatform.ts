import { useState, useEffect } from 'react';
import type { Platform } from '../types';

export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      setPlatform(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return platform;
}
