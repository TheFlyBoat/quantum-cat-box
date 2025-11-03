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
import { cn } from '@/lib/utils';
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

const GRADIENT_BY_TYPE: Record<string, string> = {
  alive: 'from-[#A9DB4A]/80 via-[#3696C9]/70 to-[#A240FF]/80',
  dead: 'from-[#002D41]/90 via-[#3696C9]/55 to-[#FF809F]/55',
  paradox: 'from-[#FF809F]/70 via-[#A240FF]/80 to-[#D14002]/65',
  default: 'from-[#A240FF]/60 via-[#FF809F]/60 to-[#3696C9]/60',
};

const SKIN_COMPONENTS: Record<BoxSkin, typeof BoxIcon> = {
  default: BoxIcon,
  carbon: CarbonBoxIcon,
  cardboard: CardboardBoxIcon,
  'black-wooden': BlackWoodenBoxIcon,
  'special-xk6': SpecialXK6BoxIcon,
  stone: StoneBoxIcon,
  tardis: TardisBoxIcon,
};

const HASH_TAG = '#thequantumcat';

const formatHeadline = (name?: string) => {
  if (!name) return 'A Quantum Cat Appeared!';
  return name.startsWith('The') ? name : `The ${name}`;
};

/**
 * Styled share card used for exporting Quantum Messages to social platforms.
 * Includes the revealed cat, Quantum Message, and current Quantum Box skin.
 */
export function ShareCard({ catState, message, boxSkin }: ShareCardProps) {
  const cat = catCatalog.find(entry => entry.id === catState.catId);
  const headline = formatHeadline(cat?.name);
  const typeKey = cat?.type?.toLowerCase() ?? 'default';
  const gradientClass = GRADIENT_BY_TYPE[typeKey] ?? GRADIENT_BY_TYPE.default;
  const BoxComponent = SKIN_COMPONENTS[boxSkin] ?? BoxIcon;

  return (
    <Card
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br p-6 text-center font-body shadow-2xl',
        gradientClass
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-between space-y-4">
        <header className="flex w-full flex-col items-center space-y-2 text-[#002D41]/80">
          <Image
            src="/favicon.svg"
            alt="The Quantum Cat logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <p className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#002D41]">
            Quantum Message
          </p>
          <h3 className="rounded-lg bg-[#002D41]/80 px-4 py-1 font-headline text-xl font-semibold text-white shadow-sm">
            {headline}
          </h3>
          {cat?.tagline && (
            <p className="max-w-sm text-sm text-white/80">{cat.tagline}</p>
          )}
        </header>

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <div className="relative h-44 w-44">
            <BoxComponent className="h-full w-full" isOpen />
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="h-full w-full translate-y-[20%] scale-[0.62]">
                <CatDisplay state={catState} />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-2">
          <div className="flex min-h-[6.5rem] items-center justify-center rounded-xl bg-white/75 p-4 text-[#002D41] shadow-inner backdrop-blur">
            <p className="font-semibold leading-tight">
              &ldquo;{message.trim()}&rdquo;
            </p>
          </div>
          <p className="mt-3 text-right text-xs font-semibold uppercase tracking-[0.25em] text-white drop-shadow">
            {HASH_TAG}
          </p>
        </div>

        <footer className="pt-1 font-headline text-sm font-semibold uppercase tracking-[0.3em] text-white/85">
          thequantumcat.app
        </footer>
      </div>
    </Card>
  );
}
