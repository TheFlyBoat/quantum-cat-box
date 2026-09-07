'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { StandardCat } from './shared/standard-cat';
import type { CatComponentProps } from './shared/types';

const CHESHIRE_BASE_PROPS: CatComponentProps = {
  body: '#2e1065',
  accent: '#7e22ce',
  catId: 'cheshire',
};

const CHESHIRE_STYLES = `
  .cat.cheshire {
    position: relative;
    overflow: visible;
  }

  .cat.cheshire .cheshire-body-fader {
    animation: cheshire-phase 6s infinite ease-in-out;
  }

  @keyframes cheshire-phase {
    0%, 100% {
      opacity: 0.95;
      filter: drop-shadow(0 0 10px rgba(162, 64, 255, 0.4));
    }
    35% {
      opacity: 0.25;
      filter: drop-shadow(0 0 4px rgba(162, 64, 255, 0.2));
    }
    60% {
      opacity: 0.15;
    }
    75% {
      opacity: 0.6;
    }
  }

  .cat.cheshire .cheshire-grin {
    animation: cheshire-glow 3s infinite alternate ease-in-out;
    filter: drop-shadow(0 0 16px rgba(0, 245, 212, 0.85));
  }

  @keyframes cheshire-glow {
    0% {
      filter: drop-shadow(0 0 8px rgba(0, 245, 212, 0.7));
    }
    100% {
      filter: drop-shadow(0 0 24px rgba(0, 245, 212, 1));
    }
  }

  .cat.cheshire .cheshire-eyes {
    animation: cheshire-eye-pulse 4s infinite ease-in-out;
    filter: drop-shadow(0 0 14px rgba(255, 209, 102, 0.9));
  }

  @keyframes cheshire-eye-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

export const CheshireCatIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('relative cat cheshire w-full h-full', className)}>
      <style>{CHESHIRE_STYLES}</style>
      
      {/* Phasing Cat Body */}
      <div className="cheshire-body-fader w-full h-full">
        <StandardCat
          {...CHESHIRE_BASE_PROPS}
          eyeColor="#00F5D4"
          noseColor="#c084fc"
        >
          {/* Subtle cosmic stripes on forehead & chest */}
          <g fill="#a855f7" opacity="0.6">
            <path d="M10200 4000 Q10500 5200 10800 4000 Z" />
            <path d="M9200 4400 Q9800 5400 9400 4400 Z" />
            <path d="M11600 4400 Q11200 5400 11800 4400 Z" />
          </g>
        </StandardCat>
      </div>

      {/* Floating Persistent Grin & Piercing Eyes that never fade out */}
      <svg
        viewBox="0 0 21164.08 18861.8"
        className="absolute inset-0 pointer-events-none w-full h-full"
      >
        {/* Luminous Cheshire Grin */}
        <g className="cheshire-grin">
          <path
            d="M8000 10400 Q10500 13200 13000 10400 Q10500 11400 8000 10400 Z"
            fill="#00F5D4"
          />
          {/* Grin Teeth lines */}
          <g stroke="#0f172a" strokeWidth="80" strokeLinecap="round" opacity="0.7">
            <line x1="9000" y1="10700" x2="9200" y2="11400" />
            <line x1="9800" y1="10800" x2="10000" y2="11900" />
            <line x1="10500" y1="10900" x2="10500" y2="12000" />
            <line x1="11200" y1="10800" x2="11000" y2="11900" />
            <line x1="12000" y1="10700" x2="11800" y2="11400" />
            <path d="M8200 10800 Q10500 11600 12800 10800" fill="none" strokeWidth="60" />
          </g>
        </g>

        {/* Persistent Glowing Slit Pupils */}
        <g className="cheshire-eyes">
          <ellipse cx="9100" cy="7400" rx="90" ry="380" fill="#FFD166" />
          <ellipse cx="13600" cy="7400" rx="90" ry="380" fill="#FFD166" />
        </g>
      </svg>
    </div>
  );
};
