
'use client';

import { useRouter } from 'next/navigation';
import { useFeedback } from '@/context/feedback-context';
import { cn } from '@/lib/utils';
import { GlitchCatIcon } from '@/components/cats/glitch-cat-icon';
import { LoginCard } from '@/components/auth/login-card';

export default function LoginPage() {
  const router = useRouter();
      const { reduceMotion } = useFeedback();
  const handleComplete = () => {
    router.push('/home');
  };

  return (
    <div className={cn('relative flex min-h-svh w-full flex-col items-center justify-center p-4 bg-background overflow-hidden')}>
      <div className="relative z-10 flex flex-col items-center justify-center text-center mb-6">
        <GlitchCatIcon className="h-16 w-16" />
        <h1 className="font-headline text-6xl font-bold tracking-tight mt-4 text-foreground">
          <span className="inline-block">The</span>
          <span className="inline-block mx-2">Quantum</span>
          <span className="inline-block">Cat</span>
        </h1>
        <p className={cn('mt-2 text-lg text-muted-foreground', !reduceMotion && 'animate-spin-reveal [animation-delay:0.6s]')}>
          SUPERPOSITION
        </p>
      </div>

      <LoginCard
        className={cn('relative z-10', !reduceMotion && 'animate-fade-in-up [animation-delay:1s]')}
        onSuccess={handleComplete}
        onGuest={handleComplete}
      />

      <p className={cn('relative z-10 text-center text-3xl font-semibold text-primary mt-8', !reduceMotion && 'animate-fade-in-up [animation-delay:1.2s]')}>
        Until you open, the cat&apos;s both alive and dead.
      </p>
    </div>
  );
}
