'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';

export default function RootPage() {
  const router = useRouter();
  const [shouldShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return sessionStorage.getItem('quantum-cat-splash') !== 'seen';
  });

  useEffect(() => {
    if (!shouldShowSplash) {
      router.replace('/home');
    }
  }, [router, shouldShowSplash]);

  const handleSplashComplete = useCallback(() => {
    try {
      sessionStorage.setItem('quantum-cat-splash', 'seen');
    } catch (error) {
      console.warn('Unable to persist splash state during intro', error);
    }
    router.replace('/home');
  }, [router]);

  if (!shouldShowSplash) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-muted-foreground">Calibrating quantum chamber…</p>
      </div>
    );
  }

  return <SplashScreen onComplete={handleSplashComplete} />;
}
