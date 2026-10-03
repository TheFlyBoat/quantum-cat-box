
'use client';
import { type ComponentType, useState, useRef } from 'react';
import { Lock, Fish } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { CatDisplay } from '@/components/cats/CatDisplay';
import { QuantumParticleBurst } from '@/components/features/quantum-particle-burst';
import { playFeedback } from '@/lib/audio';
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
  rechargeCost?: number;
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
  rechargeCost = 10,
  onUnlockRequested,
}: QuantumCatBoxProps) {
  const { selectedSkin } = useBoxSkin();
  const { reduceMotion } = useFeedback();

  const BoxComponent = SKIN_COMPONENTS[selectedSkin] ?? BoxIcon;
  const isOpen = catState.outcome !== 'initial' && !isLoading;
  const isGravityCat = catState.catId === 'gravity';

  const [showLockFeedback, setShowLockFeedback] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; char: string; color: string }[]>([]);
  const [isPetting, setIsPetting] = useState(false);
  const sparkleCounterRef = useRef(0);

  const handleCatPet = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    playFeedback('click-1');
    setIsPetting(true);
    setTimeout(() => setIsPetting(false), 450);

    const colors = ['#A240FF', '#FF809F', '#3696C9', '#A9DB4A', '#FFD166'];
    const chars = ['✦', '✨', '💖', '★'];
    const newId = ++sparkleCounterRef.current;
    const newSparkle = {
      id: newId,
      x: 45 + ((newId * 17) % 20) - 10,
      y: 20 + ((newId * 13) % 15) - 8,
      char: chars[newId % chars.length],
      color: colors[newId % colors.length],
    };

    setSparkles((prev) => [...prev.slice(-3), newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newId));
    }, 900);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isOpen) {
      handleCatPet(e);
      return;
    }
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

  const boxButton = (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'group relative h-52 w-52 md:h-56 md:w-56 p-0 hover:bg-transparent rounded-2xl transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-[#A240FF] focus-visible:ring-offset-4 focus-visible:ring-offset-background [&_svg]:size-full disabled:opacity-100 overflow-visible',
        !isOpen && !isLoading && !isLocked && 'hover:scale-105',
        isLoading && !reduceMotion && 'animate-shake',
        isAmbientShaking && !reduceMotion && 'animate-subtle-shake',
        isLocked && !isOpen && 'cursor-pointer',
        isLocked && isOpen && 'cursor-default',
        isOpen && 'cursor-pointer'
      )}
      aria-label={isLocked ? 'Quantum Box locked until tomorrow' : isOpen ? 'Pet your revealed cat' : 'Open the Quantum Box'}
      aria-disabled={isLoading}
    >
      <div
        className={cn(
          'relative h-full w-full flex items-center justify-center overflow-visible transition-opacity duration-300 [&_svg]:size-full',
          isLocked && !isOpen && 'opacity-50'
        )}
      >
        <BoxComponent className="h-full w-full" isOpen={isOpen} />
      </div>

      {/* Locked Overlay Tag with Lock & Fish Cost (Clean Pill) */}
      {isLocked && !isOpen && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/50 text-white backdrop-blur-sm shadow-md transition-transform duration-200 group-hover:scale-110">
            <Lock className="!h-6 !w-6 !size-6 text-white drop-shadow shrink-0" />
          </div>
          <div className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-full bg-white dark:bg-card px-3.5 py-1 text-xs font-bold text-foreground shadow-lg border border-border/60 transition-transform duration-200 group-hover:scale-105">
            <Fish className="!h-3.5 !w-3.5 !size-3.5 shrink-0 text-[#3696C9]" />
            <span className="font-bold leading-none text-foreground">{rechargeCost}</span>
          </div>
        </div>
      )}

      {/* State-Themed Quantum Particle Burst on Reveal (Phase 2) */}
      {isOpen && catState.outcome !== 'initial' && (
        <QuantumParticleBurst
          key={`${catState.outcome}-${catState.catId ?? ''}`}
          outcome={catState.outcome}
        />
      )}

      {/* Always show cat if revealed, even if locked */}
      {catState.outcome !== 'initial' && catState.catId && !isGravityCat && (
        <div
          onClick={handleCatPet}
          className={cn(
            'absolute inset-0 flex items-center justify-center select-none transition-transform overflow-visible',
            isPetting && 'cat-pet-squish'
          )}
          title="Pet your cat! ✨"
        >
          <div
            className="relative overflow-visible transition-all duration-300 translate-y-[38%]"
          >
            <CatDisplay state={catState} />
            {/* Floating pet sparkles (Phase 3) */}
            {sparkles.map((sp) => (
              <span
                key={sp.id}
                className="animate-pet-sparkle absolute text-sm font-bold pointer-events-none select-none z-50 drop-shadow-sm"
                style={{ left: `${sp.x}%`, top: `${sp.y}%`, color: sp.color }}
              >
                {sp.char}
              </span>
            ))}
          </div>
        </div>
      )}

      {isOpen && isGravityCat && (
        <div
          onClick={handleCatPet}
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-transform duration-300 select-none overflow-visible',
            isPetting && 'cat-pet-squish'
          )}
          title="Pet your cat! ✨"
        >
          <div className="relative overflow-visible transition-all duration-300 -translate-y-[28%]">
            <CatDisplay state={catState} />
            {/* Floating pet sparkles (Phase 3) */}
            {sparkles.map((sp) => (
              <span
                key={sp.id}
                className="animate-pet-sparkle absolute text-sm font-bold pointer-events-none select-none z-50 drop-shadow-sm"
                style={{ left: `${sp.x}%`, top: `${sp.y}%`, color: sp.color }}
              >
                {sp.char}
              </span>
            ))}
          </div>
        </div>
      )}
    </Button>
  );

  if (isLocked && !isOpen) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            {boxButton}
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={14}
            className="z-50 max-w-[240px] rounded-2xl border border-border/60 bg-popover px-4 py-3 text-center shadow-2xl backdrop-blur-md"
          >
            <p className="font-headline text-base font-bold text-foreground">Quantum Box Locked</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Recharge immediately with Fish Points instead of waiting until tomorrow.
            </p>
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-[#A240FF]">
              <Fish className="h-3.5 w-3.5 shrink-0 text-[#3696C9]" />
              <span>10 Fish Points</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return boxButton;
}
