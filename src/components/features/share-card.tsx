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
import { Card } from '@/components/ui/card';
import { type CatState } from '@/lib/types';
import catData from '@/lib/cat-data.json';

type BoxSkin =
  | 'default'
  | 'carbon'
  | 'cardboard'
  | 'black-wooden'
  | 'special-xk6'
  | 'stone'
  | 'tardis';

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
      className="relative flex h-full w-full flex-col items-center rounded-[32px] border border-white/20 bg-[linear-gradient(135deg,#5eead4_0%,#67e8f9_32%,#f0abfc_66%,#c4b5fd_100%)] px-6 pb-8 pt-6 text-center font-body text-white shadow-[0_25px_70px_-35px_rgba(79,70,229,0.45)]"
    >
      <div className="flex h-full w-full flex-col items-center justify-between gap-4">
        <header className="flex w-full flex-col items-center gap-3">
          <Image
            src="/favicon.svg"
            alt="The Quantum Cat logo"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <div className="flex items-center justify-center space-x-2 font-headline text-3xl font-bold tracking-tight text-black">
            <span>{titleParts.part1}</span>
            <span>{titleParts.part2}</span>
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

          <div className="w-full max-w-[260px]">
            <div className="rounded-xl bg-white/85 px-4 py-3 text-center shadow-sm backdrop-blur">
              <div className="font-fortune text-base font-semibold leading-relaxed text-primary">
                {sentences.length > 0 ? (
                  sentences.map((sentence, index) => (
                    <p key={`${sentence}-${index}`} className="mb-1 last:mb-0">
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

        <footer className="w-full pt-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          thequantumcat.app
        </footer>
      </div>
    </Card>
  );
}
