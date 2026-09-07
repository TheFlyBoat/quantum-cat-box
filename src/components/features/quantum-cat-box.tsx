
'use client';

import { type ComponentType, useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { CatDisplay } from '@/components/cats/CatDisplay';
import {
  BlackWoodenBoxIcon,
  BoxIcon,
  CarbonBoxIcon,
  CardboardBoxIcon,
  CircuitBoardBoxIcon,
  CrystalBoxIcon,
  GalaxyBoxIcon,
  PlushBoxIcon,
  SpecialXK6BoxIcon,
  StoneBoxIcon,
  SteampunkBoxIcon,
  TardisBoxIcon,
} from '@/components/icons';
import { useBoxSkin } from '@/context/box-skin-context';
import { useFeedback } from '@/context/feedback-context';
import { cn } from '@/lib/utils';
import { type CatState } from '@/lib/types';

interface QuantumCatBoxProps {
  onClick: () => void;
  isLoading: boolean;
  isRevealing?: boolean;
  isAmbientShaking?: boolean;
  catState: CatState;
  isLocked?: boolean;
  lockMessage?: string;
  onUnlockRequested?: () => void;
}

type BoxComponentProps = {
  className?: string;
  isOpen?: boolean;
};

const SKIN_COMPONENTS: Record<string, ComponentType<BoxComponentProps>> = {
  carbon: CarbonBoxIcon,
  cardboard: CardboardBoxIcon,
  'black-wooden': BlackWoodenBoxIcon,
  'special-xk6': SpecialXK6BoxIcon,
  stone: StoneBoxIcon,
  tardis: TardisBoxIcon,
  'circuit-board': CircuitBoardBoxIcon,
  crystal: CrystalBoxIcon,
  galaxy: GalaxyBoxIcon,
  plush: PlushBoxIcon,
  steampunk: SteampunkBoxIcon,
};

/**
 * Displays the Quantum Box and handles interaction states such as locking, loading,
 * and ambient motion. Once opened, the revealed cat hovers above the box.
 */
export function QuantumCatBox({
  onClick,
  isLoading,
  isRevealing = false,
  catState,
  isAmbientShaking,
  isLocked = false,
  lockMessage,
  onUnlockRequested,
}: QuantumCatBoxProps) {
  const { selectedSkin } = useBoxSkin();
  const { reduceMotion } = useFeedback();

  const BoxComponent = SKIN_COMPONENTS[selectedSkin] ?? BoxIcon;
  const isOpen = catState.outcome !== 'initial' && !isLoading;
  const isGravityCat = catState.catId === 'gravity';

  const [showLockFeedback, setShowLockFeedback] = useState(false);

  const handleClick = () => {
    if (isLocked) {
      if (onUnlockRequested) {
        onUnlockRequested();
        return;
      }
      setShowLockFeedback(true);
      setTimeout(() => setShowLockFeedback(false), 2000);
      onClick(); 
    } else {
      onClick();
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      disabled={isLoading || isOpen}
      className={cn(
        'group relative h-52 w-52 md:h-56 md:w-56 p-0 hover:bg-transparent rounded-2xl transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-[#A240FF] focus-visible:ring-offset-4 focus-visible:ring-offset-background [&_svg]:size-full disabled:opacity-100',
        !isOpen && !isLoading && !isLocked && 'hover:scale-105',
        isLoading && !reduceMotion && 'animate-shake',
        isAmbientShaking && !reduceMotion && 'animate-subtle-shake',
        isLocked && 'cursor-default', // Changed from cursor-not-allowed to let them click
        (isLoading || isOpen) && !isLocked && 'cursor-pointer',
        (isLoading || isOpen) && isLocked && 'cursor-default'
      )}
      aria-label={isLocked ? 'Quantum Box locked until tomorrow' : 'Open the Quantum Box'}
      aria-disabled={isLoading || isOpen}
    >
      <div className="relative h-full w-full flex items-center justify-center">
        <BoxComponent className="h-full w-full" isOpen={isOpen} />
      </div>

      {/* Always show cat if revealed, even if locked */}
      {catState.outcome !== 'initial' && catState.catId && !isGravityCat && (
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="h-full w-full translate-y-[25%] scale-[0.6]">
            <CatDisplay state={catState} />
          </div>
        </div>
      )}

      {isOpen && isGravityCat && (
        <div
          className={cn(
            'absolute inset-x-0 top-0 flex justify-center transition-transform duration-300',
            isOpen && '-translate-y-4'
          )}
        >
          <div className="h-full w-full -translate-y-[15%] scale-[0.6]">
            <CatDisplay state={catState} />
          </div>
        </div>
      )}

      {showLockFeedback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-background/60 backdrop-blur-[2px] animate-in fade-in zoom-in duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-sm">
            <Lock className="!size-6 text-rose-500" />
          </div>
          <span className="rounded-xl bg-background/90 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 shadow-sm text-center leading-tight max-w-[80%]">
            The Box is closed for now.<br/>Come back tomorrow!
          </span>
        </div>
      )}
      
    </Button>
  );
}
