import { CatDisplay } from '@/components/cats/CatDisplay';
import {
  BlackWoodenBoxIcon,
  BoxIcon,
  CarbonBoxIcon,
  CardboardBoxIcon,
  SpecialXK6BoxIcon,
  StoneBoxIcon,
  TardisBoxIcon,
} from '@/components/icons';
import { CircuitBoardBoxIcon } from '@/components/icons/circuit-board-box-icon';
import { CrystalBoxIcon } from '@/components/icons/crystal-box-icon';
import { GalaxyBoxIcon } from '@/components/icons/galaxy-box-icon';
import { PlushBoxIcon } from '@/components/icons/plush-box-icon';
import { SteampunkBoxIcon } from '@/components/icons/steampunk-box-icon';
import { type CatState } from '@/lib/types';
import catData from '@/lib/cat-data.json';
import type { BoxSkinId } from '@/lib/user-data';
import { cn } from '@/lib/utils';

type BoxSkin = BoxSkinId;

type ShareCardProps = {
  catState: CatState;
  message: string;
  boxSkin: BoxSkin;
  format?: 'story' | 'square';
  userName?: string;
};

const catCatalog = (catData.cats ?? []) as Array<{
  id: string;
  name: string;
  description: string;
  type: string;
  points: number;
  tagline: string;
}>;

const SKIN_COMPONENTS: Record<BoxSkin, typeof BoxIcon> = {
  default: BoxIcon,
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

const getTitleParts = (name?: string | null) => {
  if (!name) return { part1: 'The', part2: 'Quantum', part3: 'Cat' };
  if (name === 'Void') return { part1: 'The', part2: 'Void', part3: 'Cat' };
  if (name.endsWith(' Cat')) {
    const baseName = name.replace(/ Cat$/, '');
    const parts = baseName.split(' ');
    if (parts.length > 1) return { part1: 'The', part2: parts.join(' '), part3: 'Cat' };
    return { part1: 'The', part2: baseName, part3: 'Cat' };
  }
  return { part1: 'The', part2: name, part3: 'Cat' };
};

/**
 * Share card designed to look like a high-res screenshot of the main app interface.
 */
export function ShareCard({ catState, message, boxSkin, format = 'story', userName }: ShareCardProps) {
  const cat = catCatalog.find(entry => entry.id === catState.catId);
  const BoxComponent = SKIN_COMPONENTS[boxSkin] ?? BoxIcon;
  const isStory = format === 'story';
  const titleParts = getTitleParts(cat?.name ?? 'Quantum Cat');

  const sentences = message
    .split(/\r?\n/)
    .flatMap(segment => segment.split(/(?<=[.!?])\s+/))
    .map(sentence => sentence.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center bg-background text-foreground overflow-hidden font-body",
        isStory ? "h-[1920px] w-[1080px] pt-32 pb-24 px-16" : "h-[1080px] w-[1080px] pt-24 pb-16 px-16"
      )}
    >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.03] pointer-events-none" />

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-16 z-10">
            
            {/* 1. Title - Native sizing, no CSS scale */}
            <div className="flex items-center justify-center space-x-6 font-headline text-9xl font-bold tracking-tight">
                <span className="text-foreground">{titleParts.part1}</span>
                <span className="text-primary">{titleParts.part2}</span>
                <span className="text-foreground">{titleParts.part3}</span>
            </div>

            {/* 2. Quantum Box Visuals - Native sizing */}
            <div className="relative flex items-center justify-center">
                {/* Explicit large dimensions instead of scale() */}
                <div className="relative h-[32rem] w-[32rem]">
                    <BoxComponent className="h-full w-full" isOpen={true} />
                    
                    <div className="absolute inset-0 flex items-end justify-center">
                        <div className="h-full w-full translate-y-[25%] scale-[0.6]">
                            <CatDisplay state={catState} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Message Display - Native sizing */}
            <div className="w-full max-w-[90%] mt-4">
                <div className="rounded-[3rem] bg-muted/50 px-12 py-12 text-center shadow-sm border border-border/40">
                    <div className="font-fortune text-5xl font-semibold leading-relaxed text-primary">
                        {sentences.length > 0 ? (
                            sentences.map((sentence, index) => (
                                <p key={index} className="mb-6 last:mb-0">
                                    {sentence}
                                </p>
                            ))
                        ) : (
                            <p>A destiny revealed.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>

        {/* 4. Footer */}
        <footer className="flex flex-col items-center gap-4 z-10 mt-auto">
            <div className="text-4xl font-headline font-bold tracking-wider text-muted-foreground">
                TheQuantumCat.app
            </div>
            {userName && (
                <div className="text-3xl font-body font-medium text-muted-foreground/70">
                    Destiny Revealed for {userName}
                </div>
            )}
        </footer>
    </div>
  );
}
