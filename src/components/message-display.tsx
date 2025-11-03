
'use client';

import { type CatState } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Fish } from 'lucide-react';
import { useFeedback } from '@/context/feedback-context';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/audio';

interface MessageDisplayProps {
  message: string;
  catState: CatState;
}

import { LoadingFishes } from '@/components/ui/loading-fishes';


/**
 * A component that displays the message from the cat.
 * It also has a loading animation while the message is being generated.
 * @param message The message to display.
 * @param catState The state of the cat.
 */
export function MessageDisplay({ message, catState }: MessageDisplayProps) {
      const { reduceMotion } = useFeedback();
  useEffect(() => {
    if (message) {
      if (catState.outcome === 'alive') {
        playSound('message-alive');
      } else if (catState.outcome === 'dead') {
        playSound('message-dead');
      } else {
        playSound('message-default');
      }
    }
  }, [message, catState.outcome]);
  
  if (catState.outcome === 'initial') {
    return <div className="h-8" />;
  }

  if (!message) {
    return (
      <div className="flex items-center justify-center h-8">
        <LoadingFishes />
      </div>
    );
  }

  const sentences = message.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim().length > 0);

  return (
    <div className={cn("w-full max-w-2xl", !reduceMotion && "animate-bounce-in")}>
      <div className="rounded-xl p-4 bg-muted/50">
        <div className={`font-fortune font-semibold text-lg text-center text-primary`}>
            {sentences.map((sentence, index) => (
                <p key={index}>{sentence}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
