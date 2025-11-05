
'use client';

import { useEffect } from 'react';
import { useTypewriter } from '@/hooks/use-typewriter';

import { LoadingFishes } from '@/components/ui/loading-fishes';
import { useFeedback } from '@/context/feedback-context';
import { playFeedback, type SoundType } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { type CatState } from '@/lib/types';

type QuantumMessageDisplayProps = {
  message: string;
  catState: CatState;
};

const SOUND_BY_OUTCOME: Record<CatState['outcome'], SoundType> = {
  alive: 'message-alive',
  dead: 'message-dead',
  paradox: 'message-default',
  initial: 'message-default',
};

/**
 * Presents the Quantum Message once the Quantum Box reveals its secret.
 * Handles loading state, motion preferences, and thematic audio cues.
 */
export function QuantumMessageDisplay({ message, catState }: QuantumMessageDisplayProps) {
  const { reduceMotion } = useFeedback();
  const typedMessage = useTypewriter(message, 50);

  useEffect(() => {
    if (!message) return;

    const soundId = SOUND_BY_OUTCOME[catState.outcome] ?? SOUND_BY_OUTCOME.paradox;
    playFeedback(soundId);
  }, [message, catState.outcome]);

  if (catState.outcome === 'initial') {
    return <div className="h-8" aria-hidden />;
  }

  if (!message) {
    return (
      <div className="flex h-8 items-center justify-center" aria-live="polite" aria-busy>
        <LoadingFishes />
      </div>
    );
  }

  const sentences = typedMessage
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(Boolean);

  return (
    <div className={cn('w-full max-w-2xl', !reduceMotion && 'animate-bounce-in')}>
      <div className="rounded-xl bg-muted/50 px-4 py-5 text-center shadow-sm">
        <div className="font-fortune text-lg font-semibold leading-relaxed text-primary sm:text-xl" aria-live="polite">
          {sentences.map((sentence, index) => (
            <p key={`${sentence}-${index}`} className="mb-1 last:mb-0">
              {sentence}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
