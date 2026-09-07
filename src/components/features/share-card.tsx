'use client';

import React from 'react';
import { CatDisplay } from '@/components/cats/CatDisplay';
import {
  BlackWoodenBoxIcon,
  BoxIcon,
  CarbonBoxIcon,
  CardboardBoxIcon,
  SpecialXK6BoxIcon,
  StoneBoxIcon,
  TardisBoxIcon,
  CatPaw,
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

export type ShareCardProps = {
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

const getCatTitleParts = (name?: string | null) => {
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

const STATE_CONFIG: Record<
  string,
  { label: string; dotColor: string; badgeBg: string; badgeText: string; borderColor: string }
> = {
  alive: {
    label: 'ALIVE',
    dotColor: '#3696C9',
    badgeBg: 'rgba(54, 150, 201, 0.18)',
    badgeText: '#68BAE5',
    borderColor: 'rgba(54, 150, 201, 0.4)',
  },
  dead: {
    label: 'DEAD',
    dotColor: '#FF809F',
    badgeBg: 'rgba(255, 128, 159, 0.18)',
    badgeText: '#FFA4BC',
    borderColor: 'rgba(255, 128, 159, 0.4)',
  },
  paradox: {
    label: 'PARADOX',
    dotColor: '#A240FF',
    badgeBg: 'rgba(162, 64, 255, 0.18)',
    badgeText: '#C084FC',
    borderColor: 'rgba(162, 64, 255, 0.4)',
  },
};

/**
 * High-resolution collectible card designed for social media sharing (Story 9:16 and Square 1:1).
 * Strictly adheres to The Quantum Cat design rules (fonts, palette, storybook aesthetic).
 */
export function ShareCard({ catState, message, boxSkin, format = 'story', userName }: ShareCardProps) {
  const cat = catCatalog.find(entry => entry.id === catState.catId);
  const BoxComponent = SKIN_COMPONENTS[boxSkin] ?? BoxIcon;
  const isStory = format === 'story';
  const titleParts = getCatTitleParts(cat?.name ?? 'Quantum Cat');
  const outcomeKey = catState.outcome === 'initial' ? 'paradox' : catState.outcome;
  const stateStyle = STATE_CONFIG[outcomeKey] ?? STATE_CONFIG.paradox;

  // Clean sentences for readable quote rendering
  const sentences = message
    .split(/\r?\n/)
    .flatMap(segment => segment.split(/(?<=[.!?])\s+/))
    .map(sentence => sentence.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        width: isStory ? '540px' : '600px',
        height: isStory ? '960px' : '600px',
        fontFamily: 'var(--font-body), "Nunito", sans-serif',
        background: 'linear-gradient(155deg, #09011a 0%, #160733 45%, #001726 100%)',
      }}
      className={cn(
        'relative flex flex-col justify-between text-white overflow-hidden select-none',
        isStory ? 'p-8' : 'p-6'
      )}
    >
      {/* 1. Ambient Background Glows & Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 18%, rgba(162, 64, 255, 0.28), transparent 55%),
            radial-gradient(circle at 85% 75%, rgba(54, 150, 201, 0.22), transparent 50%),
            radial-gradient(circle at 15% 85%, rgba(255, 128, 159, 0.18), transparent 50%)
          `,
        }}
      />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.04] pointer-events-none" />

      {/* Decorative Outer Border */}
      <div className="absolute inset-3 rounded-[28px] border border-white/10 pointer-events-none shadow-2xl" />

      {/* 2. Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between w-full pt-1 px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#A240FF]/25 border border-[#A240FF]/40 text-[#A240FF]">
            <CatPaw className="h-4 w-4" />
          </div>
          <span
            style={{ fontFamily: 'var(--font-headline), "Patrick Hand", cursive' }}
            className="text-lg font-bold tracking-wider text-white/90 uppercase"
          >
            The Quantum Cat
          </span>
        </div>

        {/* State Badge Chip */}
        <div
          style={{
            backgroundColor: stateStyle.badgeBg,
            color: stateStyle.badgeText,
            borderColor: stateStyle.borderColor,
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-widest uppercase shadow-sm"
        >
          <span
            style={{ backgroundColor: stateStyle.dotColor }}
            className="h-2 w-2 rounded-full animate-pulse"
          />
          {stateStyle.label}
        </div>
      </header>

      {/* 3. Main Center Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center text-center my-auto">
        {/* Cat Name Headline */}
        <h1
          style={{ fontFamily: 'var(--font-headline), "Patrick Hand", cursive' }}
          className={cn(
            'font-bold tracking-tight mb-2',
            isStory ? 'text-4xl' : 'text-3xl'
          )}
        >
          <span className="text-white/90">{titleParts.part1} </span>
          <span className="text-[#A240FF] drop-shadow-[0_2px_12px_rgba(162,64,255,0.4)]">
            {titleParts.part2}{' '}
          </span>
          <span className="text-white/90">{titleParts.part3}</span>
        </h1>

        {/* Quantum Box & Revealed Cat */}
        <div
          className={cn(
            'relative flex items-center justify-center',
            isStory ? 'h-44 w-44 my-3' : 'h-36 w-36 my-1'
          )}
        >
          <div className="relative h-full w-full">
            <BoxComponent className="h-full w-full [&_svg]:size-full" isOpen={true} />
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              <div className="h-full w-full translate-y-[24%] scale-[0.65] flex items-center justify-center">
                <CatDisplay state={catState} />
              </div>
            </div>
          </div>
        </div>

        {/* Quantum Message Card */}
        <div className="w-full max-w-[94%] mt-2">
          <div className="relative rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md px-5 py-4 shadow-xl text-center">
            <span
              style={{ fontFamily: 'var(--font-fortune), "Quicksand", sans-serif' }}
              className="absolute -top-3 left-4 text-3xl font-serif text-[#A240FF]/80 leading-none select-none"
            >
              “
            </span>
            <div
              style={{ fontFamily: 'var(--font-fortune), "Quicksand", sans-serif' }}
              className={cn(
                'font-semibold text-white/95 leading-snug',
                isStory ? 'text-base' : 'text-sm'
              )}
            >
              {sentences.length > 0 ? (
                sentences.map((sentence, idx) => (
                  <p key={idx} className="mb-1 last:mb-0">
                    {sentence}
                  </p>
                ))
              ) : (
                <p>A destiny revealed from beyond the box.</p>
              )}
            </div>
            <span
              style={{ fontFamily: 'var(--font-fortune), "Quicksand", sans-serif' }}
              className="absolute -bottom-4 right-4 text-3xl font-serif text-[#A240FF]/80 leading-none select-none"
            >
              ”
            </span>
          </div>
        </div>
      </main>

      {/* 4. Footer & Viral CTA */}
      <footer className="relative z-10 flex flex-col items-center gap-1.5 w-full pb-1">
        {userName && (
          <p className="text-xs text-white/60 font-medium">
            Destiny revealed for <span className="text-[#3696C9] font-bold">@{userName}</span>
          </p>
        )}

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm shadow-md">
          <span className="text-[11px] font-medium text-white/70">
            Open your daily box at
          </span>
          <span
            style={{ fontFamily: 'var(--font-headline), "Patrick Hand", cursive' }}
            className="text-sm font-bold text-[#A9DB4A] tracking-wide"
          >
            thequantumcat.app
          </span>
        </div>
      </footer>
    </div>
  );
}
