
'use client';

import { Heart, RotateCcw, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type QuantumMessageActionsProps = {
  onToggleDiaryEntry: () => void;
  onShareQuantumMessage: () => void;
  onRequestAnotherQuantumBox: () => void;
  isDiarySaved: boolean;
  hasSharedQuantumMessage: boolean;
  reduceMotion: boolean;
  isShareDisabled?: boolean;
  isResetDisabled?: boolean;
};

/**
 * Primary interactions shown after a Quantum Message is revealed.
 * Allows saving to the Cat Diary, sharing the Quantum Message, or spinning up a fresh Quantum Box.
 */
export function QuantumMessageActions({
  onToggleDiaryEntry,
  onShareQuantumMessage,
  onRequestAnotherQuantumBox,
  isDiarySaved,
  hasSharedQuantumMessage,
  reduceMotion,
  isShareDisabled = false,
  isResetDisabled = false,
}: QuantumMessageActionsProps) {
  const interactiveMotion = reduceMotion
    ? 'transition-colors duration-200 ease-in-out'
    : 'transition-transform duration-200 ease-in-out hover:scale-105';

  return (
    <div
      className={cn(
        'mt-4 flex w-full items-center justify-center gap-4',
        !reduceMotion && 'animate-bounce-in'
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-pressed={isDiarySaved}
        aria-label={isDiarySaved ? 'Remove from Cat Diary' : 'Save to Cat Diary'}
        className={cn(
          interactiveMotion,
          'border-transparent text-muted-foreground',
          isDiarySaved
            ? 'bg-[#FF809F]/20 text-[#FF809F] hover:bg-[#FF809F]/30'
            : 'hover:text-[#FF809F]'
        )}
        onClick={onToggleDiaryEntry}
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors',
            isDiarySaved ? 'fill-current text-[#FF809F]' : 'text-muted-foreground'
          )}
        />
      </Button>

      <Button
        type="button"
        size="sm"
        onClick={onShareQuantumMessage}
        className={cn(
          'flex items-center bg-gradient-to-r from-[#3696C9] via-[#A240FF] to-[#FF809F] text-white shadow-lg',
          interactiveMotion,
          hasSharedQuantumMessage && 'from-[#A9DB4A] via-[#A9DB4A] to-[#A9DB4A] text-[#002D41] hover:brightness-110'
        )}
        aria-pressed={hasSharedQuantumMessage}
        aria-label={hasSharedQuantumMessage ? 'Quantum Message shared' : 'Share'}
        disabled={isShareDisabled}
      >
        <Share2 className="mr-2 h-3.5 w-3.5" />
        {hasSharedQuantumMessage ? 'Shared!' : 'Share'}
     </Button>

      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={onRequestAnotherQuantumBox}
        className={cn(
          interactiveMotion,
          'text-muted-foreground hover:text-[#3696C9]',
          isResetDisabled && 'pointer-events-none opacity-50'
        )}
        disabled={isResetDisabled}
        aria-label="Reveal another Quantum Box"
      >
        <RotateCcw
          className={cn(
            'h-4 w-4 transition-colors',
            isResetDisabled ? 'text-muted-foreground/50' : 'text-[#3696C9]'
          )}
        />
      </Button>
    </div>
  );
}
