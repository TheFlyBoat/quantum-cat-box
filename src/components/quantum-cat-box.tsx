
'use client';

import { cn } from '@/lib/utils';
import { BoxIcon, CarbonBoxIcon, CardboardBoxIcon, BlackWoodenBoxIcon, SpecialXK6BoxIcon, StoneBoxIcon } from '@/components/icons';
import { CatState } from '@/lib/types';
import { CatDisplay } from './cat-display';
import { useBoxSkin } from '@/context/box-skin-context';
import { useFeedback } from '@/context/feedback-context';
import { Lock } from 'lucide-react';

interface QuantumCatBoxProps {
  onClick: () => void;
  isLoading: boolean;
  isRevealing?: boolean;
  isAmbientShaking?: boolean;
  catState: CatState;
  isLocked?: boolean;
  lockMessage?: string;
}

/**
 * A component that displays the quantum cat box.
 * It handles the box clicking, loading, and revealing animations.
 * @param onClick A function to call when the box is clicked.
 * @param isLoading Whether the box is loading.
 * @param isRevealing Whether the box is revealing.
 * @param isAmbientShaking Whether the box is shaking ambiently.
 * @param catState The state of the cat.
 * @param isLocked Whether the box is locked.
 * @param lockMessage The message to display when the box is locked.
 */
export function QuantumCatBox({ onClick, isLoading, isRevealing = false, catState, isAmbientShaking, isLocked = false, lockMessage }: QuantumCatBoxProps) {
  console.log('--- In QuantumCatBox: Received prop catState:', catState, '---');
  const { selectedSkin } = useBoxSkin();
      const { reduceMotion } = useFeedback();  const isOpen = catState.outcome !== 'initial' && !isLoading;
  const isGravityCat = catState.catId === 'gravity';

  let BoxComponent;
      switch (selectedSkin) {
          case 'carbon':
              BoxComponent = CarbonBoxIcon;
              break;
          case 'cardboard':
              BoxComponent = CardboardBoxIcon;
              break;
          case 'black-wooden':
              BoxComponent = BlackWoodenBoxIcon;
              break;
          case 'special-xk6':
              BoxComponent = SpecialXK6BoxIcon;
              break;
          case 'stone':
              BoxComponent = StoneBoxIcon;
              break;
    default:
      BoxComponent = BoxIcon;
      break;
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading || isOpen || isLocked}
      className={cn(
        'relative group transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-2xl',
        !isOpen && !isLoading && !isLocked && 'hover:scale-105',
        isLoading && !reduceMotion && 'animate-shake',
        isAmbientShaking && !reduceMotion && 'animate-subtle-shake',
        (isLoading || isOpen) ? 'cursor-default' : isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
      )}
      aria-label={isLocked ? 'Quantum cat box locked until tomorrow' : 'Open the quantum cat box'}
      aria-disabled={isLoading || isOpen || isLocked}
    >
      <BoxComponent className="w-52 h-52 md:w-56 md:h-56" isOpen={isOpen} />
      
      {catState.outcome !== 'initial' && catState.catId && !isGravityCat && (
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="w-full h-full scale-[0.6] translate-y-[25%]">
            <CatDisplay state={catState} />
          </div>
        </div>
      )}
      {isOpen && isGravityCat && (
          <div className={cn("absolute inset-x-0 top-0 flex justify-center transition-transform duration-300", isOpen && "-translate-y-4")}>
              <div className="w-full h-full scale-[0.6] -translate-y-[15%]">
                 <CatDisplay state={catState} />
              </div>
          </div>
      )}
      {isLocked && !isOpen && !isLoading && !isRevealing && lockMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm px-4 text-center">
          <Lock className="mb-1.5 h-6 w-6 text-primary" />
          <p className="text-xs font-semibold text-foreground">Quantum flux stabilizing</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{lockMessage}</p>
        </div>
      )}
    </button>
  );
}
