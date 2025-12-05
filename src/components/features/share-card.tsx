import Image from 'next/image';

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
import { Card } from '@/components/ui/card';
import { type CatState } from '@/lib/types';
import catData from '@/lib/cat-data.json';
import type { BoxSkinId } from '@/lib/user-data';

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

  if (name === 'Void') {
    return { part1: 'The', part2: 'Void', part3: 'Cat' };
  }

  if (name.endsWith(' Cat')) {
    const baseName = name.replace(/ Cat$/, '');
    const parts = baseName.split(' ');
    if (parts.length > 1) {
      return { part1: 'The', part2: parts.join(' '), part3: 'Cat' };
    }
    return { part1: 'The', part2: baseName, part3: 'Cat' };
  }

  return { part1: 'The', part2: name, part3: 'Cat' };
};

/**
 * Share card aligned with the in-app reveal screen styling.
 * Presents the title, revealed cat, and message in a layout mirroring the app.
 */
export function ShareCard({ catState, message, boxSkin, format = 'story', userName }: ShareCardProps) {
  const cat = catCatalog.find(entry => entry.id === catState.catId);
  const titleParts = getTitleParts(cat?.name ?? null);
  const BoxComponent = SKIN_COMPONENTS[boxSkin] ?? BoxIcon;
  const sentences = message
    .split(/\r?\n/)
    .flatMap(segment => segment.split(/(?<=[.!?])\s+/))
    .map(sentence => sentence.trim())
    .filter(Boolean);

  const isStory = format === 'story';

  return (
    <div
      className={`relative flex w-full flex-col items-center overflow-hidden bg-slate-950 text-center font-body text-white shadow-2xl ${
        isStory ? 'h-[1920px] w-[1080px] p-16' : 'h-[1080px] w-[1080px] p-12'
      }`}
    >
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#4c1d95_0%,#0f172a_60%,#020617_100%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
      
      {/* Stars/Particles (CSS only for simplicity) */}
      <div className="absolute top-20 left-20 h-2 w-2 rounded-full bg-white opacity-60 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      <div className="absolute top-40 right-32 h-1.5 w-1.5 rounded-full bg-purple-300 opacity-50" />
      <div className="absolute bottom-32 left-1/4 h-1 w-1 rounded-full bg-blue-300 opacity-40" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between">
        {/* Header */}
        <header className="flex w-full flex-col items-center gap-6">
          <div className="flex items-center justify-center space-x-3 opacity-90">
             <Image
                src="/favicon.svg"
                alt="Logo"
                width={64}
                height={64}
                className="h-16 w-16 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                unoptimized
             />
             <span className="font-headline text-3xl font-bold tracking-widest text-purple-200 uppercase">
                The Oracle
             </span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-baseline justify-center space-x-3 font-headline text-6xl font-bold tracking-tight text-white drop-shadow-md">
              <span className="text-purple-200">{titleParts.part1}</span>
              <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                {titleParts.part2}
              </span>
              <span className="text-purple-200">{titleParts.part3}</span>
            </div>
            {cat?.tagline && (
                <span className="mt-2 font-fortune text-2xl italic text-purple-200/80">
                    {cat.tagline}
                </span>
            )}
          </div>
        </header>

        {/* Main Visual */}
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-12">
          <div className={`relative flex items-center justify-center ${isStory ? 'scale-150' : 'scale-125'}`}>
             <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
             <div className="relative h-80 w-80">
                <BoxComponent className="h-full w-full drop-shadow-2xl" isOpen />
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div className="h-[90%] w-[90%]">
                    <CatDisplay state={catState} />
                  </div>
                </div>
             </div>
          </div>

          {/* Message Card */}
          <div className="w-full max-w-2xl">
            <div className="relative rounded-3xl border border-white/10 bg-black/60 px-10 py-8 text-center shadow-2xl">
              <div className="font-fortune text-3xl font-semibold leading-relaxed text-white/90 drop-shadow-sm">
                {sentences.length > 0 ? (
                  sentences.map((sentence, index) => (
                    <p key={`${sentence}-${index}`} className="mb-4 last:mb-0">
                      {sentence}
                    </p>
                  ))
                ) : (
                  <p>A destiny revealed.</p>
                )}
              </div>
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 h-4 w-4 border-l-2 border-t-2 border-purple-400/50" />
              <div className="absolute top-4 right-4 h-4 w-4 border-r-2 border-t-2 border-purple-400/50" />
              <div className="absolute bottom-4 left-4 h-4 w-4 border-l-2 border-b-2 border-purple-400/50" />
              <div className="absolute bottom-4 right-4 h-4 w-4 border-r-2 border-b-2 border-purple-400/50" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex w-full flex-col items-center gap-2 pb-4 text-purple-200/60">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="text-xl font-bold uppercase tracking-[0.3em]">
            thequantumcat.app
          </div>
          <div className="text-sm font-medium tracking-wider text-purple-300/50">
            {userName ? `Destiny Revealed for ${userName}` : '#OracleCat'}
          </div>
        </footer>
      </div>
    </div>
  );
}
