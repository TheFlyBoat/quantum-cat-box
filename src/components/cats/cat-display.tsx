
import { type CatState } from '@/lib/types';
import { catComponentMap, isCompactFullBleedCat, isAnimatedFrameCat } from '@/lib/cat-components';
import { CosmicBackdrop } from '@/components/cats/cosmic-cat';
import { cn } from '@/lib/utils';

import { useBoxSkin } from '@/context/box-skin-context';

interface CatDisplayProps {
  state: CatState;
}

/**
 * A component that displays the revealed cat(s).
 * Supports Double Cat (TARDIS timeline split), Dark Aura (Black Wooden), and Sparkle Burst (Plush).
 */
export function CatDisplay({ state }: CatDisplayProps) {
  const { outcome, catId, secondaryCatId } = state;
  const { selectedSkin } = useBoxSkin();

  if (outcome === 'initial' || !catId) return null;

  const CatComponent = catComponentMap[catId];
  const SecondaryCatComponent = secondaryCatId ? catComponentMap[secondaryCatId] : null;

  if (!CatComponent) return null;

  const isCosmic = catId === 'cosmic' || secondaryCatId === 'cosmic';
  const isDarkAura = selectedSkin === 'black-wooden' && outcome === 'dead';
  const isSparkleBurst = selectedSkin === 'plush' && outcome === 'alive';
  const isTemporalDouble = !!SecondaryCatComponent;

  return (
    <div className="animate-bounce-in relative overflow-visible flex items-center justify-center">
      {isCosmic && <CosmicBackdrop />}

      {/* Dark Aura for Black Wooden dead cat reveals */}
      {isDarkAura && (
        <div
          aria-hidden="true"
          className="absolute -inset-8 rounded-full bg-gradient-to-r from-purple-950/60 via-[#2E0249]/70 to-black/60 blur-xl animate-pulse pointer-events-none -z-10"
        />
      )}

      {/* Sparkle Burst ambient glow for Plush alive cat reveals */}
      {isSparkleBurst && (
        <div
          aria-hidden="true"
          className="absolute -inset-8 rounded-full bg-gradient-to-r from-pink-400/35 via-amber-300/30 to-violet-300/35 blur-xl animate-pulse pointer-events-none -z-10"
        />
      )}

      {/* Temporal Rift glow for Double Cat reveals */}
      {isTemporalDouble && (
        <div
          aria-hidden="true"
          className="absolute -inset-10 rounded-full bg-gradient-to-r from-cyan-400/40 via-blue-500/35 to-indigo-500/40 blur-2xl animate-pulse pointer-events-none -z-10"
        />
      )}

      {isTemporalDouble ? (
        // Double Cat Layout (Timeline Rift)
        <div className="relative flex items-center justify-center -space-x-10 overflow-visible">
          <div className="cat-living-breathe overflow-visible flex items-center justify-center shrink-0 w-[105px] h-[105px] -rotate-6 transition-transform duration-300 z-10 drop-shadow-md">
            <CatComponent className="w-full h-full overflow-visible" />
          </div>
          <div className="cat-living-breathe overflow-visible flex items-center justify-center shrink-0 w-[105px] h-[105px] rotate-6 transition-transform duration-300 z-20 drop-shadow-md">
            <SecondaryCatComponent className="w-full h-full overflow-visible" />
          </div>
        </div>
      ) : (
        // Standard Single Cat Layout
        <div
          className={cn(
            'cat-living-breathe overflow-visible flex items-center justify-center shrink-0 [&_svg]:size-full transition-transform duration-300',
            isCompactFullBleedCat(catId)
              ? 'w-[124px] h-[124px]'
              : isAnimatedFrameCat(catId)
              ? 'w-[136px] h-[136px]'
              : 'w-[132px] h-[132px]'
          )}
        >
          <CatComponent className="w-full h-full overflow-visible" />
        </div>
      )}
    </div>
  );
}
