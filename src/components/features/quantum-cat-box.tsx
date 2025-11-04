
'use client';

import { type ComponentType } from 'react';
import { Lock } from 'lucide-react';

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
}: QuantumCatBoxProps) {
  const { selectedSkin } = useBoxSkin();
  const { reduceMotion } = useFeedback();

  const BoxComponent = SKIN_COMPONENTS[selectedSkin] ?? BoxIcon;
  const isOpen = catState.outcome !== 'initial' && !isLoading;
  const isGravityCat = catState.catId === 'gravity';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || isOpen || isLocked}
      className={cn(
        'group relative rounded-2xl transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-[#A240FF] focus-visible:ring-offset-4 focus-visible:ring-offset-background',
        !isOpen && !isLoading && !isLocked && 'hover:scale-105',
        isLoading && !reduceMotion && 'animate-shake',
        isAmbientShaking && !reduceMotion && 'animate-subtle-shake',
        isLocked && 'cursor-not-allowed opacity-70',
        (isLoading || isOpen) && 'cursor-default'
      )}
      aria-label={isLocked ? 'Quantum Box locked until tomorrow' : 'Open the Quantum Box'}
      aria-disabled={isLoading || isOpen || isLocked}
    >
      <BoxComponent className="h-52 w-52 md:h-56 md:w-56" isOpen={isOpen} />

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

      {isLocked && !isOpen && !isLoading && !isRevealing && lockMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#002D41]/85 px-4 text-center shadow-inner backdrop-blur-md">
          <Lock className="mb-1.5 h-6 w-6 text-[#A240FF]" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A9DB4A]">
            Quantum flux stabilizing
          </p>
          <p className="mt-1 text-[11px] text-white/80">{lockMessage}</p>
        </div>
      )}
    </button>
  );
}
