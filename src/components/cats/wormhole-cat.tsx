'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { StandardCat } from './shared/standard-cat';
import type { CatComponentProps } from './shared/types';

const WORMHOLE_BASE_PROPS: CatComponentProps = {
  body: '#1e1b4b',
  accent: '#6366f1',
  catId: 'wormhole',
};

const WORMHOLE_STYLES = `
  .cat.wormhole {
    position: relative;
    overflow: visible;
  }

  .cat.wormhole .portal-ring-primary {
    animation: portal-spin 8s linear infinite;
    transform-origin: 10500px 14500px;
  }

  .cat.wormhole .portal-ring-secondary {
    animation: portal-spin-reverse 6s linear infinite;
    transform-origin: 10500px 14500px;
  }

  @keyframes portal-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes portal-spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  .cat.wormhole .mini-portal {
    animation: portal-hover 3s ease-in-out infinite alternate;
  }

  @keyframes portal-hover {
    0% { transform: translateY(0px) rotate(-4deg); }
    100% { transform: translateY(-8px) rotate(4deg); }
  }
`;

export const WormholeCatIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('relative cat wormhole w-full h-full', className)}>
      <style>{WORMHOLE_STYLES}</style>

      {/* Swirling Cosmic Portal behind/around cat */}
      <svg
        viewBox="0 0 21164.08 18861.8"
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      >
        <defs>
          <linearGradient id="portalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A240FF" />
            <stop offset="50%" stopColor="#00F5D4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="portalGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF007A" />
            <stop offset="100%" stopColor="#A240FF" />
          </linearGradient>
        </defs>

        {/* Primary Accretion Ring around bottom where cat emerges */}
        <g className="portal-ring-primary">
          <ellipse
            cx="10500"
            cy="14500"
            rx="5200"
            ry="2100"
            fill="none"
            stroke="url(#portalGrad1)"
            strokeWidth="480"
            strokeDasharray="1800 600"
            opacity="0.8"
          />
        </g>
        <g className="portal-ring-secondary">
          <ellipse
            cx="10500"
            cy="14500"
            rx="4600"
            ry="1800"
            fill="none"
            stroke="url(#portalGrad2)"
            strokeWidth="320"
            strokeDasharray="1200 800"
            opacity="0.85"
          />
        </g>
      </svg>

      {/* Main Cat emerging from the primary portal */}
      <div className="relative z-10 w-full h-full">
        <StandardCat
          {...WORMHOLE_BASE_PROPS}
          eyeColor="#00F5D4"
          noseColor="#818cf8"
        >
          {/* Constellation Star Markings on chest & ears */}
          <g fill="#FFFFFF" opacity="0.85">
            <circle cx="9500" cy="5500" r="140" />
            <circle cx="11500" cy="5500" r="140" />
            <circle cx="10500" cy="6200" r="180" />
            <line x1="9500" y1="5500" x2="10500" y2="6200" stroke="#00F5D4" strokeWidth="40" opacity="0.6" />
            <line x1="11500" y1="5500" x2="10500" y2="6200" stroke="#00F5D4" strokeWidth="40" opacity="0.6" />
          </g>
        </StandardCat>
      </div>

      {/* Secondary Entangled Mini Portal with Tail emerging */}
      <svg
        viewBox="0 0 21164.08 18861.8"
        className="absolute inset-0 pointer-events-none w-full h-full z-20 mini-portal"
      >
        {/* Floating Mini Portal on the upper left */}
        <ellipse
          cx="3800"
          cy="7500"
          rx="1800"
          ry="900"
          fill="#09011a"
          stroke="url(#portalGrad1)"
          strokeWidth="300"
          transform="rotate(-25 3800 7500)"
        />
        {/* Fluffy tail tip popping out of the mini portal */}
        <path
          d="M3600 7600 Q2800 6800 3200 5800 Q3600 5200 4200 5600 Q4000 6600 4200 7400 Z"
          fill="#6366f1"
        />
        <circle cx="3400" cy="6200" r="110" fill="#00F5D4" opacity="0.9" />
      </svg>
    </div>
  );
};
