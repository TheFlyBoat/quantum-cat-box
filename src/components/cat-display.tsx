
import { type CatState } from '@/lib/types';
import { catComponentMap } from '@/lib/cat-components';

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

  return CatComponent ? (
      <div className="animate-bounce-in">
        <CatComponent className="w-52 h-52 md:w-56 md:h-56" />
      </div>
  ) : null;
}
