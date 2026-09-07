'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { StandardCat } from './shared/standard-cat';
import type { CatComponentProps } from './shared/types';

const SCHRODINGER_BASE_PROPS: CatComponentProps = {
  body: '#ea580c',
  accent: '#c2410c',
  catId: 'schrodinger',
};

const SCHRODINGER_STYLES = `
  .cat.schrodinger {
    position: relative;
    overflow: visible;
  }

  .cat.schrodinger .quantum-vial-glow {
    animation: vial-bubble 2.4s infinite ease-in-out;
    transform-origin: 10500px 14500px;
  }

  @keyframes vial-bubble {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      filter: drop-shadow(0 0 10px rgba(0, 245, 212, 0.7));
    }
    50% {
      transform: scale(1.06) rotate(3deg);
      filter: drop-shadow(0 0 20px rgba(162, 64, 255, 0.9));
    }
  }

  .cat.schrodinger .quantum-goggles-lens {
    animation: lens-shimmer 4s infinite linear;
  }

  @keyframes lens-shimmer {
    0%, 100% {
      opacity: 0.85;
    }
    50% {
      opacity: 0.55;
    }
  }

  .cat.schrodinger .superposition-half {
    mix-blend-mode: screen;
    opacity: 0.65;
    animation: quantum-flicker 5s infinite ease-in-out;
  }

  @keyframes quantum-flicker {
    0%, 100% { opacity: 0.65; }
    45% { opacity: 0.75; }
    50% { opacity: 0.35; }
    55% { opacity: 0.7; }
  }
`;

export const SchrodingerCatIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('relative cat schrodinger w-full h-full', className)}>
      <style>{SCHRODINGER_STYLES}</style>

      {/* Base Cat (Ginger Tabby side) */}
      <StandardCat
        {...SCHRODINGER_BASE_PROPS}
        eyeColor="#00F5D4"
        noseColor="#f43f5e"
      >
        {/* Right Half Superposition Mask (Cyan / Violet Hologram Half) */}
        <path
          className="superposition-half"
          d="M10582 200 L18000 3000 L18000 18000 L10582 18000 Z"
          fill="url(#superpositionGradient)"
        />

        {/* Quantum Lab Goggles resting on the forehead */}
        <g className="quantum-goggles">
          {/* Goggle strap */}
          <path
            d="M6200 4800 Q10500 4400 14800 4800"
            fill="none"
            stroke="#475569"
            strokeWidth="380"
            strokeLinecap="round"
          />
          {/* Left Lens Frame */}
          <circle cx="8800" cy="4600" r="1300" fill="#334155" stroke="#f59e0b" strokeWidth="260" />
          <circle cx="8800" cy="4600" r="1050" fill="#00F5D4" className="quantum-goggles-lens" opacity="0.8" />
          <circle cx="8500" cy="4300" r="320" fill="white" opacity="0.85" />

          {/* Bridge */}
          <path d="M10050 4600 L11050 4600" stroke="#f59e0b" strokeWidth="260" strokeLinecap="round" />

          {/* Right Lens Frame */}
          <circle cx="12300" cy="4600" r="1300" fill="#334155" stroke="#f59e0b" strokeWidth="260" />
          <circle cx="12300" cy="4600" r="1050" fill="#A240FF" className="quantum-goggles-lens" opacity="0.8" />
          <circle cx="12000" cy="4300" r="320" fill="white" opacity="0.85" />
        </g>

        {/* Glowing Quantum Flask / Vial in Paws */}
        <g className="quantum-vial-glow">
          {/* Flask Body */}
          <path
            d="M10100 13200 L10900 13200 L10900 14200 L12200 16200 Q12500 16800 11800 17000 L9200 17000 Q8500 16800 8800 16200 L10100 14200 Z"
            fill="url(#flaskFluidGradient)"
            stroke="#f8fafc"
            strokeWidth="160"
            strokeLinejoin="round"
          />
          {/* Cork */}
          <rect x="10000" y="12800" width="1000" height="420" rx="120" fill="#b45309" stroke="#78350f" strokeWidth="90" />
          {/* Liquid highlight & atom symbol inside flask */}
          <circle cx="10500" cy="15800" r="280" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="10500" cy="15800" rx="800" ry="260" fill="none" stroke="#FFFFFF" strokeWidth="80" transform="rotate(30 10500 15800)" />
          <ellipse cx="10500" cy="15800" rx="800" ry="260" fill="none" stroke="#FFFFFF" strokeWidth="80" transform="rotate(-30 10500 15800)" />
        </g>

        {/* Definitions for Gradients */}
        <defs>
          <linearGradient id="superpositionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#A240FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="flaskFluidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="100%" stopColor="#A240FF" />
          </linearGradient>
        </defs>
      </StandardCat>
    </div>
  );
};
