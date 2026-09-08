'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { StandardCat } from './shared/standard-cat';
import type { CatComponentProps } from './shared/types';

const SCHRODINGER_BASE_PROPS: CatComponentProps = {
  body: '#2e1065',
  accent: '#A240FF',
  catId: 'schrodinger',
};

const SCHRODINGER_STYLES = `
  .cat.schrodinger {
    position: relative;
    overflow: visible;
    filter: drop-shadow(0 0 16px rgba(162, 64, 255, 0.35));
  }

  .cat.schrodinger .quantum-vial-glow {
    animation: vial-bubble 2.4s infinite ease-in-out;
    transform-origin: 10500px 14500px;
  }

  @keyframes vial-bubble {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      filter: drop-shadow(0 0 12px rgba(0, 245, 212, 0.85));
    }
    50% {
      transform: scale(1.06) rotate(3deg);
      filter: drop-shadow(0 0 24px rgba(162, 64, 255, 0.95));
    }
  }

  .cat.schrodinger .quantum-goggles-lens {
    animation: lens-shimmer 3.5s infinite linear;
  }

  @keyframes lens-shimmer {
    0%, 100% {
      opacity: 0.9;
    }
    50% {
      opacity: 0.6;
    }
  }

  .cat.schrodinger .superposition-half {
    mix-blend-mode: screen;
    opacity: 0.75;
    animation: quantum-flicker 4s infinite ease-in-out;
  }

  @keyframes quantum-flicker {
    0%, 100% { opacity: 0.75; }
    45% { opacity: 0.88; }
    50% { opacity: 0.45; }
    55% { opacity: 0.82; }
  }

  .cat.schrodinger .orbital-ring {
    animation: orbital-spin 6s linear infinite;
    transform-origin: 10500px 15800px;
  }

  @keyframes orbital-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const SchrodingerCatIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('relative cat schrodinger w-full h-full', className)}>
      <style>{SCHRODINGER_STYLES}</style>

      {/* Paradox Cat Base (Cosmic Violet body & Electric Violet accents) */}
      <StandardCat
        {...SCHRODINGER_BASE_PROPS}
        eyeColor="#00F5D4"
        noseColor="#A240FF"
      >
        {/* Right Half Superposition Phase Shift Mask (Cyan & Violet Hologram) */}
        <path
          className="superposition-half"
          d="M10582 200 L18000 3000 L18000 18000 L10582 18000 Z"
          fill="url(#superpositionGradient)"
        />

        {/* Quantum Superposition Wave Division Line down the center */}
        <line
          x1="10582"
          y1="800"
          x2="10582"
          y2="13500"
          stroke="url(#waveDividingGrad)"
          strokeWidth="120"
          strokeDasharray="300 150"
          opacity="0.85"
        />

        {/* Subtle Constellation & Particle Flecks across the Paradox silhouette */}
        <g fill="#00F5D4" opacity="0.8">
          <circle cx="7500" cy="5200" r="80" />
          <circle cx="8200" cy="4800" r="60" />
          <circle cx="13200" cy="5200" r="80" fill="#A240FF" />
          <circle cx="12600" cy="4800" r="60" fill="#A240FF" />
        </g>

        {/* Quantum Lab Goggles resting on the forehead */}
        <g className="quantum-goggles">
          {/* Goggle strap */}
          <path
            d="M6200 4800 Q10500 4400 14800 4800"
            fill="none"
            stroke="#1e293b"
            strokeWidth="380"
            strokeLinecap="round"
          />
          {/* Left Lens Frame (Cyan Quantum Channel) */}
          <circle cx="8800" cy="4600" r="1300" fill="#0f172a" stroke="#A240FF" strokeWidth="260" />
          <circle cx="8800" cy="4600" r="1050" fill="#00F5D4" className="quantum-goggles-lens" opacity="0.85" />
          <circle cx="8500" cy="4300" r="320" fill="white" opacity="0.9" />

          {/* Bridge */}
          <path d="M10050 4600 L11050 4600" stroke="#A240FF" strokeWidth="260" strokeLinecap="round" />

          {/* Right Lens Frame (Violet Probability Channel) */}
          <circle cx="12300" cy="4600" r="1300" fill="#0f172a" stroke="#00F5D4" strokeWidth="260" />
          <circle cx="12300" cy="4600" r="1050" fill="#A240FF" className="quantum-goggles-lens" opacity="0.85" />
          <circle cx="12000" cy="4300" r="320" fill="white" opacity="0.9" />
        </g>

        {/* Glowing Quantum Flask / Radioactive Vial in Paws */}
        <g className="quantum-vial-glow">
          {/* Flask Body */}
          <path
            d="M10100 13200 L10900 13200 L10900 14200 L12200 16200 Q12500 16800 11800 17000 L9200 17000 Q8500 16800 8800 16200 L10100 14200 Z"
            fill="url(#flaskFluidGradient)"
            stroke="#e2e8f0"
            strokeWidth="160"
            strokeLinejoin="round"
          />
          {/* Cork / Cap */}
          <rect x="10000" y="12800" width="1000" height="420" rx="120" fill="#475569" stroke="#334155" strokeWidth="90" />
          {/* Liquid highlight & atom nucleus inside flask */}
          <circle cx="10500" cy="15800" r="280" fill="#FFFFFF" opacity="0.95" />
          {/* Spinning atomic orbital rings */}
          <g className="orbital-ring">
            <ellipse cx="10500" cy="15800" rx="840" ry="280" fill="none" stroke="#00F5D4" strokeWidth="90" transform="rotate(35 10500 15800)" />
            <ellipse cx="10500" cy="15800" rx="840" ry="280" fill="none" stroke="#A240FF" strokeWidth="90" transform="rotate(-35 10500 15800)" />
          </g>
        </g>

        {/* Definitions for Quantum Gradients */}
        <defs>
          <linearGradient id="superpositionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#A240FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF007A" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="waveDividingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="50%" stopColor="#A240FF" />
            <stop offset="100%" stopColor="#00F5D4" />
          </linearGradient>
          <linearGradient id="flaskFluidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="60%" stopColor="#A240FF" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
      </StandardCat>
    </div>
  );
};

