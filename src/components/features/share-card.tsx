import { CatDisplay } from '@/components/cats/CatDisplay';
import { TitleDisplay } from '@/components/title-display';
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

/**
 * Share card designed to look like a high-res screenshot of the main app interface.
 */
export function ShareCard({ catState, message, boxSkin, format = 'story', userName }: ShareCardProps) {
  const cat = catCatalog.find(entry => entry.id === catState.catId);
  const BoxComponent = SKIN_COMPONENTS[boxSkin] ?? BoxIcon;
  const isStory = format === 'story';

  // Pre-split message for display
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
        {/* Background Pattern (Subtle grid to match app texture if any, or just clean) */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.03] pointer-events-none" />

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-12 z-10">
            
            {/* 1. Title - Scaled up to look good at 1080p */}
            <div className="scale-[3] origin-center mb-8">
                <TitleDisplay name={cat?.name ?? 'Quantum Cat'} onTitleClick={() => {}} reduceMotion={true} />
            </div>

            {/* 2. Quantum Box Visuals */}
            <div className={cn("relative flex items-center justify-center", isStory ? "scale-[2.5]" : "scale-[2.0]")}>
                {/* The exact box sizing and cat positioning from QuantumCatBox */}
                <div className="relative h-56 w-56">
                    <BoxComponent className="h-full w-full drop-shadow-2xl" isOpen={true} />
                    
                    <div className="absolute inset-0 flex items-end justify-center">
                        <div className="h-full w-full translate-y-[25%] scale-[0.6]">
                            <CatDisplay state={catState} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Message Display - Styled like the app's QuantumMessageDisplay */}
            <div className="w-full max-w-[90%] mt-8">
                <div className="rounded-[3rem] bg-muted/50 px-10 py-10 text-center shadow-sm border border-border/40">
                    <div className="font-fortune text-5xl font-semibold leading-relaxed text-primary">
                        {sentences.length > 0 ? (
                            sentences.map((sentence, index) => (
                                <p key={index} className="mb-4 last:mb-0">
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
                <div className="text-2xl font-body font-medium text-muted-foreground/70">
                    Destiny Revealed for {userName}
                </div>
            )}
        </footer>
    </div>
  );
}
