import React, { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { StandardCat } from './shared/standard-cat';
import type { CatComponentProps } from './shared/types';

const COSMIC_BASE_PROPS: CatComponentProps = {
    body: '#0c0a3e',
    accent: '#3a3285',
    catId: 'cosmic',
};

const COSMIC_STARS = [
    { id: 1, cx: 5200, cy: 4800, r: 65 },
    { id: 2, cx: 6400, cy: 8200, r: 40 },
    { id: 3, cx: 7600, cy: 6200, r: 55 },
    { id: 4, cx: 8900, cy: 9100, r: 35 },
    { id: 5, cx: 10100, cy: 5400, r: 48 },
    { id: 6, cx: 11200, cy: 7600, r: 32 },
    { id: 7, cx: 12400, cy: 8700, r: 45 },
    { id: 8, cx: 13600, cy: 6100, r: 52 },
    { id: 9, cx: 14800, cy: 9400, r: 37 },
    { id: 10, cx: 16000, cy: 5600, r: 42 },
    { id: 11, cx: 17100, cy: 7800, r: 58 },
    { id: 12, cx: 18300, cy: 6300, r: 44 },
    { id: 13, cx: 19500, cy: 8900, r: 36 },
    { id: 14, cx: 20700, cy: 7200, r: 50 },
    { id: 15, cx: 7200, cy: 10400, r: 46 },
    { id: 16, cx: 8500, cy: 11700, r: 38 },
    { id: 17, cx: 9700, cy: 10200, r: 60 },
    { id: 18, cx: 11300, cy: 11300, r: 34 },
    { id: 19, cx: 12700, cy: 10300, r: 48 },
    { id: 20, cx: 14100, cy: 11600, r: 40 },
    { id: 21, cx: 15500, cy: 10100, r: 54 },
    { id: 22, cx: 16900, cy: 11000, r: 33 },
    { id: 23, cx: 18200, cy: 9900, r: 47 },
    { id: 24, cx: 19600, cy: 10800, r: 39 },
    { id: 25, cx: 21000, cy: 9500, r: 35 },
];

const COSMIC_STAR_TIMINGS = [
    { id: 1, delay: 0.0, duration: 2.8 },
    { id: 2, delay: 0.7, duration: 3.4 },
    { id: 3, delay: 1.2, duration: 3.0 },
    { id: 4, delay: 2.1, duration: 2.6 },
    { id: 5, delay: 1.8, duration: 3.8 },
    { id: 6, delay: 0.3, duration: 4.4 },
    { id: 7, delay: 2.4, duration: 2.9 },
    { id: 8, delay: 1.5, duration: 3.2 },
    { id: 9, delay: 3.1, duration: 4.0 },
    { id: 10, delay: 2.7, duration: 2.7 },
    { id: 11, delay: 1.0, duration: 3.6 },
    { id: 12, delay: 3.3, duration: 2.5 },
    { id: 13, delay: 0.9, duration: 4.2 },
    { id: 14, delay: 1.9, duration: 3.1 },
    { id: 15, delay: 0.4, duration: 3.5 },
    { id: 16, delay: 2.6, duration: 2.4 },
    { id: 17, delay: 1.4, duration: 3.9 },
    { id: 18, delay: 3.5, duration: 2.8 },
    { id: 19, delay: 0.2, duration: 4.1 },
    { id: 20, delay: 2.2, duration: 3.3 },
    { id: 21, delay: 1.6, duration: 2.7 },
    { id: 22, delay: 0.8, duration: 3.7 },
    { id: 23, delay: 2.9, duration: 2.9 },
    { id: 24, delay: 1.1, duration: 4.5 },
    { id: 25, delay: 3.7, duration: 3.2 },
];

const COSMIC_STYLES = `
    .cat.cosmic {
        animation: cosmic-float 6s infinite ease-in-out;
        overflow: visible;
    }

    .cat.cosmic .cosmic-figure {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .cat.cosmic .cosmic-figure-inner {
        width: 100%;
        height: 100%;
        transform-origin: 54% 62%;
        transform: translate(10%, -12%);
    }

    .cat.cosmic .cosmic-nebula {
        pointer-events: none;
        mix-blend-mode: screen;
    }

    .cat.cosmic .cosmic-nebula .nebula-layer {
        opacity: 0.35;
        transform-box: fill-box;
        transform-origin: center;
        animation: cosmic-nebula-pulse 16s ease-in-out infinite;
    }

    .cat.cosmic .cosmic-nebula .nebula-layer--2 {
        opacity: 0.28;
        animation-duration: 22s;
        animation-delay: -6s;
    }

    @keyframes cosmic-float {
        0%, 100% { transform: translate(-50%, 0); }
        50% { transform: translate(-50%, -2%); }
    }

    .cat.cosmic .blinking-eye.eye-part {
        animation: cosmic-eye-glow 4s infinite ease-in-out alternate, cosmic-blink 8s infinite ease-in-out;
        transform-origin: center;
    }

    @keyframes cosmic-nebula-pulse {
        0%, 100% {
            opacity: 0.25;
            transform: scale(0.92) rotate(-1deg);
        }
        50% {
            opacity: 0.55;
            transform: scale(1.06) rotate(1deg);
        }
    }

    @keyframes cosmic-eye-glow {
        from {
            filter: drop-shadow(0 0 8px #fceeb2) brightness(1.2);
        }
        to {
            filter: drop-shadow(0 0 20px #fceeb2) drop-shadow(0 0 10px #fff) brightness(1.8);
        }
    }

    @keyframes cosmic-blink {
        0%, 97%, 100% { transform: scaleY(1); }
        98.5% { transform: scaleY(0.1); }
    }

    .cat.cosmic .cosmic-orbit {
        pointer-events: none;
        transform-box: fill-box;
        animation: cosmic-orbit-spin 24s linear infinite;
    }

    .cat.cosmic .cosmic-orbit--inner {
        animation-duration: 16s;
        animation-direction: reverse;
    }

    .cat.cosmic .cosmic-orbit .orbit-path {
        fill: none;
        stroke: rgba(147, 197, 253, 0.18);
        stroke-width: 140;
        stroke-dasharray: 260 160;
    }

    .cat.cosmic .cosmic-orbit .orbit-path--inner {
        stroke-width: 110;
        stroke-dasharray: 200 140;
        stroke: rgba(236, 233, 255, 0.2);
    }

    .cat.cosmic .cosmic-orbit .orbit-star {
        fill: #fceeb2;
        filter: drop-shadow(0 0 18px rgba(252, 238, 178, 0.85));
    }

    @keyframes cosmic-orbit-spin {
        to { transform: rotate(360deg); }
    }

    .cat.cosmic .cosmic-tail-trail {
        pointer-events: none;
    }

    .cat.cosmic .cosmic-tail-trail .trail-dot {
        fill: rgba(165, 243, 252, 0.75);
        transform-box: fill-box;
        transform-origin: center;
        animation: cosmic-trail-fade 4.8s ease-in-out infinite;
    }

    @keyframes cosmic-trail-fade {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        12% {
            opacity: 1;
            transform: translateY(-420px) scale(0.6);
        }
        60% {
            opacity: 0.5;
            transform: translateY(-920px) scale(0.35);
        }
        100% {
            opacity: 0;
            transform: translateY(-1200px) scale(0);
        }
    }

    .cat.cosmic .ear-left-base {
        animation: cosmic-ear-twitch-left 7s infinite ease-in-out;
        transform-origin: 8000px 3200px;
    }

    .cat.cosmic .ear-right-base {
        animation: cosmic-ear-twitch-right 7s infinite ease-in-out 0.4s;
        transform-origin: 14800px 3200px;
    }

    @keyframes cosmic-ear-twitch-left {
        0%, 15%, 100% { transform: rotate(0); }
        7% { transform: rotate(-5deg); }
    }

    @keyframes cosmic-ear-twitch-right {
        0%, 15%, 100% { transform: rotate(0); }
        7% { transform: rotate(5deg); }
    }

    .cat.cosmic .whisker-left {
        animation: cosmic-whisker-left 6s infinite ease-in-out;
        transform-origin: 7600px 9200px;
    }

    .cat.cosmic .whisker-right {
        animation: cosmic-whisker-right 6s infinite ease-in-out 0.2s;
        transform-origin: 14000px 9200px;
    }

    @keyframes cosmic-whisker-left {
        0%, 10%, 100% { transform: rotate(0deg); }
        5% { transform: rotate(3deg); }
    }

    @keyframes cosmic-whisker-right {
        0%, 10%, 100% { transform: rotate(0deg); }
        5% { transform: rotate(-3deg); }
    }

    .cat.cosmic .wag-tail {
        animation: cosmic-wag-tail 5s infinite ease-in-out;
        transform-origin: 4000px 14500px;
    }

    @keyframes cosmic-wag-tail {
        0%, 100% { transform: rotate(5deg); }
        50% { transform: rotate(-5deg); }
    }

    .cosmic-stars .star {
        animation-name: cosmic-twinkle;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
    }

    @keyframes cosmic-twinkle {
        0%, 100% {
            opacity: 0.5;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
    }

    ${COSMIC_STAR_TIMINGS.map(({ id, delay, duration }) => `.cosmic-stars .star[data-star-id="${id}"] { animation-delay: ${delay}s; animation-duration: ${duration}s; }`).join('\n')}
`;

const tailTrailDots = [
    { id: 1, cx: 2600, cy: 15200, r: 260, delay: 0 },
    { id: 2, cx: 2950, cy: 14650, r: 210, delay: 0.6 },
    { id: 3, cx: 3280, cy: 14120, r: 170, delay: 1.2 },
    { id: 4, cx: 3630, cy: 13580, r: 140, delay: 1.8 },
    { id: 5, cx: 4010, cy: 13040, r: 120, delay: 2.4 },
    { id: 6, cx: 4380, cy: 12520, r: 100, delay: 3.1 },
];

const CosmicFigure: React.FC<CatComponentProps> = ({ body, accent, catId }) => {
    const nebulaGradientId1 = useId();
    const nebulaGradientId2 = useId();

    return (
    <StandardCat body={body} accent={accent} catId={catId} eyeColor="#fceeb2">
        <g className="cosmic-nebula" aria-hidden="true">
            <defs>
                <radialGradient id={nebulaGradientId1} cx="11000" cy="9000" r="7600" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
                    <stop offset="40%" stopColor="#4f46e5" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0c0a3e" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={nebulaGradientId2} cx="8300" cy="10400" r="5800" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.48" />
                    <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.26" />
                    <stop offset="100%" stopColor="#0c0a3e" stopOpacity="0" />
                </radialGradient>
            </defs>
            <ellipse className="nebula-layer nebula-layer--1" cx="11000" cy="8800" rx="8000" ry="5200" fill={`url(#${nebulaGradientId1})`} />
            <ellipse className="nebula-layer nebula-layer--2" cx="8600" cy="10400" rx="6200" ry="4200" fill={`url(#${nebulaGradientId2})`} />
        </g>

        <g
            className="cosmic-orbit"
            aria-hidden="true"
            style={{ transformOrigin: '10500px 8800px' }}
        >
            <ellipse className="orbit-path" cx="10500" cy="8800" rx="8200" ry="4600" />
            <circle className="orbit-star" cx="10500" cy="4200" r="260" />
        </g>

        <g
            className="cosmic-orbit cosmic-orbit--inner"
            aria-hidden="true"
            style={{ transformOrigin: '10500px 8800px' }}
        >
            <ellipse className="orbit-path orbit-path--inner" cx="10500" cy="8800" rx="5200" ry="3200" />
            <circle className="orbit-star orbit-star--inner" cx="10500" cy="5600" r="200" />
        </g>

        <g className="cosmic-stars" aria-hidden="true">
            {COSMIC_STARS.map(star => (
                <circle
                    key={star.id}
                    className="star"
                    data-star-id={star.id}
                    cx={star.cx}
                    cy={star.cy}
                    r={star.r}
                    fill="#FFFFFF"
                />
            ))}
        </g>

        <g className="cosmic-tail-trail" aria-hidden="true">
            {tailTrailDots.map(dot => (
                <circle
                    key={dot.id}
                    className="trail-dot"
                    cx={dot.cx}
                    cy={dot.cy}
                    r={dot.r}
                    style={{ animationDelay: `${dot.delay}s` }}
                />
            ))}
        </g>
    </StandardCat>
    );
};

export const CosmicCatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('relative cat cosmic', className)}>
        <style>{COSMIC_STYLES}</style>
        <div className="cosmic-figure">
            <div className="cosmic-figure-inner">
                <CosmicFigure {...COSMIC_BASE_PROPS} />
            </div>
        </div>
    </div>
);

const COSMIC_BACKDROP_STYLES = `
  .cosmic-backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    background: radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.18), transparent 55%),
                radial-gradient(circle at 20% 80%, rgba(192, 132, 252, 0.22), transparent 60%);
    mix-blend-mode: screen;
  }

  .cosmic-backdrop__layer {
    position: absolute;
    inset: -20vh;
    width: 140vw;
    height: 140vh;
    opacity: 0.7;
  }

  .cosmic-backdrop__layer--field {
    background-image:
      radial-gradient(2px 2px at 25% 20%, rgba(255,255,255,0.45) 50%, transparent 60%),
      radial-gradient(2px 2px at 60% 40%, rgba(255,255,255,0.35) 50%, transparent 60%),
      radial-gradient(2.5px 2.5px at 80% 70%, rgba(255,255,255,0.5) 50%, transparent 60%),
      radial-gradient(1.5px 1.5px at 40% 80%, rgba(120,213,255,0.45) 50%, transparent 60%);
    background-size: 40% 40%, 40% 40%, 45% 45%, 35% 35%;
    animation: cosmic-backdrop-drift 90s linear infinite;
  }

  .cosmic-backdrop__layer--twinkle {
    background-image:
      radial-gradient(2px 2px at 10% 30%, rgba(255,255,255,0.35) 50%, transparent 60%),
      radial-gradient(2.5px 2.5px at 70% 60%, rgba(255,255,255,0.55) 50%, transparent 60%),
      radial-gradient(2px 2px at 45% 75%, rgba(147,197,253,0.45) 50%, transparent 60%),
      radial-gradient(1.8px 1.8px at 85% 25%, rgba(252,231,243,0.4) 50%, transparent 60%);
    background-size: 38% 38%, 42% 42%, 36% 36%, 34% 34%;
    animation: cosmic-backdrop-twinkle 6s ease-in-out infinite;
  }

  .cosmic-backdrop__shooting {
    position: absolute;
    inset: 0;
  }

  .cosmic-backdrop__shooting-star {
    position: absolute;
    width: 220px;
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0) 100%);
    opacity: 0;
    transform: translate3d(0,0,0) scaleX(0);
    animation-name: cosmic-backdrop-shoot;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
  }

  @keyframes cosmic-backdrop-drift {
    0% { transform: translate3d(0, 0, 0); opacity: 0.45; }
    50% { transform: translate3d(-10vw, -6vh, 0); opacity: 0.8; }
    100% { transform: translate3d(-20vw, -12vh, 0); opacity: 0.45; }
  }

  @keyframes cosmic-backdrop-twinkle {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.75; }
  }

  @keyframes cosmic-backdrop-shoot {
    0% {
      opacity: 0;
      transform: translate3d(var(--start-x, 0), var(--start-y, 0), 0) scaleX(0.2);
    }
    10% {
      opacity: 1;
      transform: translate3d(calc(var(--start-x, 0) + 4vw), calc(var(--start-y, 0) + var(--delta-y, -4vh)), 0) scaleX(1);
    }
    100% {
      opacity: 0;
      transform: translate3d(calc(var(--start-x, 0) + var(--delta-x, 20vw)), calc(var(--start-y, 0) + calc(var(--delta-y, -4vh) * 5)), 0) scaleX(0);
    }
  }
`;

let cosmicBackdropRoot: HTMLDivElement | null = null;
let cosmicBackdropMounts = 0;

const ensureBackdropRoot = () => {
    if (cosmicBackdropRoot) {
        return cosmicBackdropRoot;
    }
    const root = document.createElement('div');
    root.id = 'cosmic-backdrop-root';
    root.style.position = 'fixed';
    root.style.inset = '0';
    root.style.zIndex = '9999';
    root.style.pointerEvents = 'none';
    document.body.appendChild(root);
    cosmicBackdropRoot = root;
    return root;
};

const shootingStarConfigs = [
    { id: 1, delay: 0, duration: 6, startX: '-15vw', startY: '20vh', deltaX: '120vw', deltaY: '-12vh' },
    { id: 2, delay: 2.5, duration: 7.5, startX: '10vw', startY: '10vh', deltaX: '90vw', deltaY: '18vh' },
    { id: 3, delay: 4.4, duration: 6.8, startX: '-10vw', startY: '60vh', deltaX: '110vw', deltaY: '-30vh' },
    { id: 4, delay: 6.8, duration: 8.5, startX: '5vw', startY: '70vh', deltaX: '85vw', deltaY: '-25vh' },
    { id: 5, delay: 9.2, duration: 7.2, startX: '-20vw', startY: '40vh', deltaX: '130vw', deltaY: '10vh' },
];

export const CosmicBackdrop: React.FC = () => {
    const [containerNode] = useState<HTMLDivElement | null>(() => {
        if (typeof document === 'undefined') {
            return null;
        }
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.inset = '0';
        return container;
    });

    useEffect(() => {
        if (typeof document === 'undefined' || !containerNode) {
            return;
        }

        const root = ensureBackdropRoot();
        root.appendChild(containerNode);
        cosmicBackdropMounts += 1;

        return () => {
            cosmicBackdropMounts = Math.max(0, cosmicBackdropMounts - 1);
            if (containerNode.parentNode === root) {
                root.removeChild(containerNode);
            }
            if (cosmicBackdropMounts === 0 && cosmicBackdropRoot) {
                cosmicBackdropRoot.remove();
                cosmicBackdropRoot = null;
            }
        };
    }, [containerNode]);

    if (typeof document === 'undefined' || !containerNode) {
        return null;
    }

    return createPortal(
        <>
            <style>{COSMIC_BACKDROP_STYLES}</style>
            <div className="cosmic-backdrop">
                <div className="cosmic-backdrop__layer cosmic-backdrop__layer--field" />
                <div className="cosmic-backdrop__layer cosmic-backdrop__layer--twinkle" />
                <div className="cosmic-backdrop__shooting">
                    {shootingStarConfigs.map(star => {
                        const style = {
                            animationDelay: `${star.delay}s`,
                            animationDuration: `${star.duration}s`,
                        } as React.CSSProperties & Record<string, string>;
                        style['--start-x'] = star.startX;
                        style['--start-y'] = star.startY;
                        style['--delta-x'] = star.deltaX;
                        style['--delta-y'] = star.deltaY;

                        return (
                            <span
                                key={star.id}
                                className="cosmic-backdrop__shooting-star"
                                style={style}
                            />
                        );
                    })}
                </div>
            </div>
        </>,
        containerNode
    );
};
