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
export function ShareCard({ catState, message, boxSkin }: ShareCardProps) {
  const cat = catCatalog.find(entry => entry.id === catState.catId);
  const titleParts = getTitleParts(cat?.name ?? null);
  const BoxComponent = SKIN_COMPONENTS[boxSkin] ?? BoxIcon;
  const sentences = message
    .split(/\r?\n/)
    .flatMap(segment => segment.split(/(?<=[.!?])\s+/))
    .map(sentence => sentence.trim())
    .filter(Boolean);

  return (
    <Card
      className="relative flex h-full w-full flex-col items-center rounded-[32px] border border-white/20 bg-[linear-gradient(135deg,#67e8f9_0%,#f0abfc_50%,#c4b5fd_100%)] p-6 text-center font-body text-white shadow-[0_25px_70px_-35px_rgba(79,70,229,0.45)]"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-20" />
      <div className="relative flex h-full w-full flex-col items-center justify-between gap-4">
        <header className="flex w-full flex-col items-center gap-2">
          <Image
            src="/favicon.svg"
            alt="The Quantum Cat logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <div className="flex items-center justify-center space-x-1.5 font-headline text-2xl font-bold tracking-tight text-black">
            <span>{titleParts.part1}</span>
            <span className="text-white">{titleParts.part2}</span>
            <span>{titleParts.part3}</span>
          </div>
        </header>

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
          <div className="relative h-36 w-36">
            <BoxComponent className="h-full w-full" isOpen />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full scale-[0.8]">
                <CatDisplay state={catState} />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[280px]">
            <div className="rounded-xl bg-white/90 px-4 py-3 text-center shadow-lg backdrop-blur-sm">
              <div className="font-fortune text-lg font-semibold leading-snug text-primary">
                {sentences.length > 0 ? (
                  sentences.map((sentence, index) => (
                    <p key={`${sentence}-${index}`} className="mb-1.5 last:mb-0">
                      {sentence}
                    </p>
                  ))
                ) : (
                  <p>A curious fortune emerges.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
          thequantumcat.app • #QuantumCat
        </footer>
      </div>
    </Card>
  );
}
