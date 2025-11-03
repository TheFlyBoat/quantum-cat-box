
'use client';

import { ArrowDown } from 'lucide-react';

import { useFeedback } from '@/context/feedback-context';
import { cn } from '@/lib/utils';

/**
 * Lightweight prompt that teaches new players to open the Quantum Box.
 */
export function TutorialOverlay() {
  const { reduceMotion } = useFeedback();

  return (
    <div
      className={cn(
        'absolute top-0 flex flex-col items-center space-y-2 text-center',
        !reduceMotion && 'animate-bounce'
      )}
    >
      <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        Tap the Box
      </span>
      <ArrowDown className="h-6 w-6 text-primary" aria-hidden />
    </div>
  );
}
