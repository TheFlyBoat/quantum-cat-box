
import { type CatState } from '@/lib/types';
import { catComponentMap } from '@/lib/cat-components';
import { CosmicBackdrop } from '@/components/cats/cosmic-cat';

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
    <div className="animate-bounce-in relative">
      {isCosmic && <CosmicBackdrop />}
      <CatComponent className="w-52 h-52 md:w-56 md:h-56" />
    </div>
  );
}
