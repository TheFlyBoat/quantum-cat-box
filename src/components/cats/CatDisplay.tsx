
import { type CatState } from '@/lib/types';
import { catComponentMap, isCompactFullBleedCat, isAnimatedFrameCat } from '@/lib/cat-components';
import { CosmicBackdrop } from '@/components/cats/cosmic-cat';
import { cn } from '@/lib/utils';

interface CatDisplayProps {
  state: CatState;
}

/**
 * A component that displays the correct cat icon based on the catId.
 * @param state The state of the cat.
 */
export function CatDisplay({ state }: CatDisplayProps) {
  const { outcome, catId } = state;

  if (outcome === 'initial' || !catId) return null;

  const CatComponent = catComponentMap[catId];

  if (!CatComponent) return null;

  const isCosmic = catId === 'cosmic';

  return (
    <div className="animate-bounce-in relative overflow-visible flex items-center justify-center">
      {isCosmic && <CosmicBackdrop />}
      <div className={cn(
        "cat-living-breathe overflow-visible flex items-center justify-center shrink-0 [&_svg]:size-full transition-transform duration-300",
        isCompactFullBleedCat(catId)
          ? "w-[124px] h-[124px]"
          : isAnimatedFrameCat(catId)
          ? "w-[136px] h-[136px]"
          : "w-[132px] h-[132px]"
      )}>
        <CatComponent className="w-full h-full overflow-visible" />
      </div>
    </div>
  );
}
