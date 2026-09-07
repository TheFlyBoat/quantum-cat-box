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
} from '@/components/icons';
import { CircuitBoardBoxIcon } from '@/components/icons/circuit-board-box-icon';
import { CrystalBoxIcon } from '@/components/icons/crystal-box-icon';
import { GalaxyBoxIcon } from '@/components/icons/galaxy-box-icon';
import { PlushBoxIcon } from '@/components/icons/plush-box-icon';
import { SteampunkBoxIcon } from '@/components/icons/steampunk-box-icon';
import { type CatState } from '@/lib/types';
import catData from '@/lib/cat-data.json';
import type { BoxSkinId } from '@/lib/user-data';
import { PATRICK_HAND_BASE64 } from '@/lib/font-base64';
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

const getFormattedCatTitle = (name?: string | null) => {
  if (!name) return 'The Quantum Cat';
  if (name.toLowerCase().startsWith('the ')) return name;
  return `The ${name}`;
};

// 4-pointed sparkle star doodle
const StarDoodle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn('text-[#C084FC]', className)}
    style={style}
    aria-hidden="true"
  >
    <path d="M12 0C12 7.5 16.5 12 24 12C16.5 12 12 16.5 12 24C12 16.5 7.5 12 0 12C7.5 12 12 7.5 12 0Z" />
  </svg>
);

// Cute outline fish doodle (facing left by default)
const FishDoodle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 44 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('text-[#D8B4FE]', className)}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M3 13C3 6.5 18 3 32 13C18 23 3 19.5 3 13Z"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 13L41 6.5C40 10 40 16 41 19.5L32 13Z"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="11" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Left decorative rays beside title: radiating outwards up-left and horizontal left
const LeftTitleAccents = ({ className }: { className?: string }) => (
  <svg width="34" height="28" viewBox="0 0 34 28" fill="none" className={cn('text-[#B78AF7]', className)} aria-hidden="true">
    <path d="M26 16L8 6" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M24 23H4" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

// Right decorative rays beside title: radiating outwards up-right and horizontal right
const RightTitleAccents = ({ className }: { className?: string }) => (
  <svg width="34" height="28" viewBox="0 0 34 28" fill="none" className={cn('text-[#B78AF7]', className)} aria-hidden="true">
    <path d="M8 16L26 6" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M10 23H30" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

// Playful box action lines on the upper right of the box
const BoxAccents = ({ className }: { className?: string }) => (
  <svg width="28" height="30" viewBox="0 0 28 30" fill="none" className={cn('text-[#B78AF7]', className)} aria-hidden="true">
    <path d="M6 24L20 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M14 30L26 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Whimsical puffy clouds along the bottom edge
const BottomClouds = () => (
  <svg
    viewBox="0 0 540 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute bottom-0 left-0 w-full pointer-events-none"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M -30 140 V 90 Q 30 40 110 75 Q 180 35 270 70 Q 360 30 440 65 Q 510 35 570 85 V 140 Z"
      fill="#E8DCF9"
      fillOpacity="0.75"
    />
    <path
      d="M -30 140 V 105 Q 40 65 130 90 Q 220 55 310 85 Q 400 55 490 80 Q 540 65 570 100 V 140 Z"
      fill="#F6F0FD"
      fillOpacity="0.92"
    />
  </svg>
);

/**
 * Storybook Social Share Card.
 * Faithfully matches the app design and reference layout:
 * - Soft pastel lavender/lilac gradient
 * - Inline Patrick Hand @font-face for 100% reliable image export
 * - Floating whimsical doodles (sparkle stars & outline fish)
 * - Large box with lifted lid and proud foreground cat
 * - Warm soft peach wisdom quote card
 * - Whimsical bottom clouds and TheQuantumCat.app footer
 */
export function ShareCard({ catState, message, boxSkin, format = 'story' }: ShareCardProps) {
  const cat = catCatalog.find(entry => entry.id === catState.catId);
  const BoxComponent = SKIN_COMPONENTS[boxSkin] ?? BoxIcon;
  const isStory = format === 'story';
  const formattedTitle = getFormattedCatTitle(cat?.name);

  return (
    <div
      style={{
        width: isStory ? '540px' : '600px',
        height: isStory ? '960px' : '600px',
        fontFamily: "'Patrick Hand', cursive, sans-serif",
        background: 'linear-gradient(180deg, #FBF8FE 0%, #F5EEFC 48%, #EAE0F9 100%)',
      }}
      className={cn(
        'share-card-root relative flex flex-col items-center justify-between overflow-hidden select-none',
        isStory ? 'is-story pt-14 pb-5 px-8' : 'is-square pt-7 pb-4 px-6'
      )}
    >
      {/* Inline Font Definition and Clean Snapshot Styles */}
      <style>{`
        @font-face {
          font-family: 'Patrick Hand';
          src: url('data:font/woff2;base64,${PATRICK_HAND_BASE64}') format('woff2');
          font-weight: 400 700;
          font-style: normal;
          font-display: block;
        }
        .share-card-root {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .share-card-root .cat-living-breathe,
        .share-card-root .animate-bounce-in {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
        .share-card-root .box-stage svg {
          overflow: visible !important;
        }
        .share-card-root.is-story .box-stage svg g.-translate-y-4 {
          transform: translateY(-22px) !important;
        }
        .share-card-root.is-square .box-stage svg g.-translate-y-4 {
          transform: translateY(-16px) !important;
        }
      `}</style>

      {/* 1. Whimsical Floating Background Doodles */}
      {/* Top Left Sparkle Star */}
      <StarDoodle
        className="absolute w-6 h-6 opacity-85"
        style={{ top: isStory ? '6.5%' : '3.5%', left: isStory ? '17%' : '12%' }}
      />
      {/* Top Center-Left Fish (swimming left) */}
      <FishDoodle
        className="absolute w-9 h-5 -rotate-12 opacity-85"
        style={{ top: isStory ? '8.5%' : '3%', left: isStory ? '33%' : '24%' }}
      />
      {/* Top Right Sparkle Star */}
      <StarDoodle
        className="absolute w-5 h-5 opacity-85"
        style={{ top: isStory ? '12.5%' : '7%', right: isStory ? '14%' : '12%' }}
      />
      {/* Upper Right Fish (swimming right) */}
      <FishDoodle
        className="absolute w-9 h-5 rotate-12 -scale-x-100 opacity-85"
        style={{ top: isStory ? '28%' : '23%', right: '6%' }}
      />
      {/* Mid Left Fish (swimming right) */}
      <FishDoodle
        className="absolute w-8 h-5 rotate-12 -scale-x-100 opacity-85"
        style={{ top: isStory ? '31%' : '27%', left: '5%' }}
      />
      {/* Mid Left Sparkle Star */}
      <StarDoodle
        className="absolute w-7 h-7 opacity-85"
        style={{ top: isStory ? '52%' : '47%', left: '8%' }}
      />
      {/* Mid Right Sparkle Star */}
      <StarDoodle
        className="absolute w-6 h-6 opacity-85"
        style={{ top: isStory ? '51%' : '45%', right: '8%' }}
      />
      {/* Lower Right Fish (swimming left) */}
      <FishDoodle
        className="absolute w-8 h-5 -rotate-12 opacity-85"
        style={{ top: isStory ? '61.5%' : '56%', right: '7%' }}
      />

      {/* 2. Top Title Header */}
      <div className={cn('relative z-10 flex items-center justify-center gap-3 w-full', isStory ? 'mt-4' : 'mt-1')}>
        <LeftTitleAccents className={isStory ? 'w-9 h-8' : 'w-7 h-6'} />
        <h1
          style={{ fontFamily: "'Patrick Hand', cursive, sans-serif" }}
          className={cn(
            'font-bold tracking-tight text-[#261C37] whitespace-nowrap text-center',
            isStory ? 'text-[48px] leading-none' : 'text-[32px] leading-none'
          )}
        >
          {formattedTitle}
        </h1>
        <RightTitleAccents className={isStory ? 'w-9 h-8' : 'w-7 h-6'} />
      </div>

      {/* 3. Center Box & Cat Stage */}
      <div className="relative z-10 flex flex-1 items-center justify-center my-auto">
        <div className={cn('box-stage relative flex items-center justify-center', isStory ? 'w-[320px] h-[320px]' : 'w-[230px] h-[230px]')}>
          {/* Ground shadow beneath box and cat */}
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-[#402060]/15 blur-[2px] pointer-events-none',
              isStory ? 'bottom-[16px] w-[270px] h-[20px]' : 'bottom-[10px] w-[190px] h-[14px]'
            )}
          />

          {/* Box with open lifted lid */}
          <BoxComponent className="w-full h-full [&_svg]:size-full" isOpen={true} />

          {/* Cat standing proudly in the foreground */}
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 flex items-end justify-center pointer-events-none z-10',
              '[&_.animate-bounce-in]:!transform-none [&_.animate-bounce-in]:!opacity-100',
              '[&_.cat-living-breathe]:!w-full [&_.cat-living-breathe]:!h-full',
              '[&_svg]:!w-full [&_svg]:!h-full',
              isStory
                ? 'bottom-[36px] w-[210px] h-[225px]'
                : 'bottom-[25px] w-[145px] h-[155px]'
            )}
          >
            <CatDisplay state={catState} />
          </div>

          {/* Playful box action lines */}
          <BoxAccents
            className={cn(
              'absolute pointer-events-none',
              isStory ? 'top-[78px] -right-[18px] w-7 h-8' : 'top-[54px] -right-[12px] w-5 h-6'
            )}
          />
        </div>
      </div>

      {/* 4. Quantum Message Quote Card */}
      <div className={cn('relative z-10 flex justify-center w-full', isStory ? 'mb-6' : 'mb-3')}>
        <div
          className={cn(
            'w-full rounded-[28px] border-2 border-[#FBD9C8] bg-[#FFF0E6] shadow-[0_4px_16px_rgba(200,160,180,0.12)] text-center flex items-center justify-center',
            isStory ? 'max-w-[465px] px-8 py-6' : 'max-w-[440px] px-6 py-4'
          )}
        >
          <p
            style={{ fontFamily: "'Nunito', 'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif" }}
            className={cn(
              'font-semibold text-[#5A3E94] leading-[1.45]',
              isStory ? 'text-[22px]' : 'text-[15px]'
            )}
          >
            {message || 'Chaos is merely a pattern you have not yet recognised.'}
          </p>
        </div>
      </div>

      {/* 5. Bottom Clouds & Footer */}
      <BottomClouds />

      <footer className={cn('relative z-10 flex flex-col items-center justify-center w-full', isStory ? 'pb-2' : 'pb-1')}>
        <span
          style={{ fontFamily: "'Nunito', sans-serif" }}
          className={cn('font-bold text-[#7E45DE] tracking-wide', isStory ? 'text-[16px]' : 'text-[14px]')}
        >
          TheQuantumCat.app
        </span>
      </footer>
    </div>
  );
}
