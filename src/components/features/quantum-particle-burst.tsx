'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useFeedback } from '@/context/feedback-context';

export interface QuantumParticleBurstProps {
  outcome: 'alive' | 'dead' | 'paradox';
  className?: string;
}

interface ParticleConfig {
  id: number;
  angle: number; // degrees
  distance: number; // px
  size: number; // px
  delay: number; // seconds
  type: 'star' | 'circle' | 'diamond' | 'ring';
}

// Deterministic particle layout (100% hydration safe - no Math.random in render)
const STATIC_PARTICLES: ParticleConfig[] = [
  { id: 1, angle: 15, distance: 95, size: 10, delay: 0.0, type: 'star' },
  { id: 2, angle: 38, distance: 130, size: 7, delay: 0.04, type: 'circle' },
  { id: 3, angle: 62, distance: 85, size: 12, delay: 0.08, type: 'diamond' },
  { id: 4, angle: 88, distance: 140, size: 8, delay: 0.02, type: 'ring' },
  { id: 5, angle: 112, distance: 100, size: 11, delay: 0.06, type: 'star' },
  { id: 6, angle: 135, distance: 120, size: 6, delay: 0.1, type: 'circle' },
  { id: 7, angle: 158, distance: 90, size: 13, delay: 0.03, type: 'diamond' },
  { id: 8, angle: 182, distance: 135, size: 9, delay: 0.07, type: 'star' },
  { id: 9, angle: 205, distance: 80, size: 7, delay: 0.01, type: 'circle' },
  { id: 10, angle: 228, distance: 125, size: 11, delay: 0.05, type: 'ring' },
  { id: 11, angle: 252, distance: 105, size: 8, delay: 0.09, type: 'diamond' },
  { id: 12, angle: 275, distance: 140, size: 12, delay: 0.02, type: 'star' },
  { id: 13, angle: 298, distance: 90, size: 6, delay: 0.06, type: 'circle' },
  { id: 14, angle: 320, distance: 125, size: 10, delay: 0.04, type: 'diamond' },
  { id: 15, angle: 342, distance: 110, size: 8, delay: 0.08, type: 'ring' },
  { id: 16, angle: 48, distance: 75, size: 9, delay: 0.03, type: 'star' },
  { id: 17, angle: 170, distance: 65, size: 8, delay: 0.07, type: 'circle' },
  { id: 18, angle: 290, distance: 70, size: 10, delay: 0.05, type: 'diamond' },
];

const THEME_COLORS: Record<'alive' | 'dead' | 'paradox', string[]> = {
  alive: ['#3696C9', '#A9DB4A', '#FFD166', '#FFFFFF'],
  dead: ['#FF809F', '#CDC1E1', '#E2E8F0', '#FFAAC1'],
  paradox: ['#A240FF', '#00F5D4', '#FF007A', '#FFFFFF'],
};

export function QuantumParticleBurst({ outcome, className }: QuantumParticleBurstProps) {
  const [active, setActive] = useState(true);
  const { reduceMotion } = useFeedback();

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  if (!active || reduceMotion) return null;

  const colors = THEME_COLORS[outcome] ?? THEME_COLORS.paradox;

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-40',
        className
      )}
      aria-hidden="true"
    >
      {STATIC_PARTICLES.map((p, idx) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        const color = colors[idx % colors.length];

        return (
          <div
            key={p.id}
            className="absolute rounded-full transition-transform"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: 'translate(0, 0) scale(0)',
              animation: `quantum-particle-burst 1.05s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: `${p.delay}s`,
              ['--tx' as string]: `${tx}px`,
              ['--ty' as string]: `${ty}px`,
            }}
          >
            {p.type === 'star' && (
              <svg viewBox="0 0 24 24" className="w-full h-full" style={{ fill: color }}>
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41Z" />
              </svg>
            )}
            {p.type === 'diamond' && (
              <div
                className="w-full h-full rotate-45 rounded-sm shadow-sm"
                style={{ backgroundColor: color }}
              />
            )}
            {p.type === 'ring' && (
              <div
                className="w-full h-full rounded-full border-2"
                style={{ borderColor: color }}
              />
            )}
            {p.type === 'circle' && (
              <div
                className="w-full h-full rounded-full shadow-sm"
                style={{ backgroundColor: color }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
