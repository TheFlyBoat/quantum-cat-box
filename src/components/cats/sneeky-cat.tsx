import React from 'react';
import { cn } from '@/lib/utils';
import { StandardCat } from './shared/standard-cat';
import type { CatComponentProps } from './shared/types';

const SNEEKY_BASE_PROPS: CatComponentProps = {
    body: '#4A5568',
    accent: '#2D3748',
    catId: 'sneeky',
};

const SNEEKY_STYLES = `
    .cat.sneeky {
        transform: none;
        overflow: hidden;
    }

    .sneeky-head {
        position: absolute;
        left: 50%;
        bottom: 8%;
        width: min(92%, 260px);
        height: 100%;
        transform: translate(-50%, 118%);
        clip-path: url(#sneeky-head-clip);
        animation: sneeky-peek-head 10s ease-in-out infinite;
        animation-delay: -2.5s;
    }

    .sneeky-head svg {
        display: block;
        transform-origin: center bottom;
    }

    .sneeky-head .pupil {
        animation: sneeky-look-around 10s infinite ease-in-out;
        transform-origin: center;
    }

    .sneeky-head .eye-part {
        overflow: hidden;
    }

    .sneeky-head .blinking-eye {
        animation: sneeky-eye-widen 10s infinite ease-in-out;
    }

    @keyframes sneeky-peek-head {
        0%,
        2% {
            transform: translate(-50%, 118%);
        }
        8% {
            transform: translate(-50%, 114%);
        }
        24% {
            transform: translate(-50%, 104%);
        }
        44% {
            transform: translate(-50%, 88%);
        }
        60% {
            transform: translate(-50%, 70%);
        }
        66%,
        72% {
            transform: translate(-50%, 56%);
        }
        74% {
            transform: translate(-50%, 58%);
        }
        78% {
            transform: translate(-50%, 60%);
        }
        82% {
            transform: translate(-50%, 120%);
        }
        86% {
            transform: translate(-50%, 118%);
        }
        90% {
            transform: translate(-50%, 114%);
        }
        100% {
            transform: translate(-50%, 118%);
        }
    }

    @keyframes sneeky-look-around {
        0%,
        54%,
        100% {
            transform: translateX(0);
        }
        58% {
            transform: translateX(-200px);
        }
        64% {
            transform: translateX(220px);
        }
        70% {
            transform: translateX(-140px);
        }
        72% {
            transform: translateX(-60px);
        }
        74% {
            transform: translateX(0);
        }
        76% {
            transform: translateX(0) scale(1.05);
        }
        78% {
            transform: translateX(0);
        }
    }

    @keyframes sneeky-eye-widen {
        0%,
        54%,
        100% {
            transform: scaleY(1);
        }
        60% {
            transform: scaleY(1.1);
        }
        68% {
            transform: scaleY(0.7);
        }
        74% {
            transform: scaleY(1);
        }
    }
`;

const SneekyFigure: React.FC<CatComponentProps> = ({ body, accent, catId }) => (
    <>
        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                <clipPath id="sneeky-head-clip">
                    <rect x="0" y="0" width="21164.08" height="4200" />
                </clipPath>
            </defs>
        </svg>
        <div className="sneeky-head">
            <StandardCat body={body} accent={accent} catId={catId} />
        </div>
    </>
);

export const SneekyCatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn('relative cat sneeky', className)}>
        <style>{SNEEKY_STYLES}</style>
        <SneekyFigure {...SNEEKY_BASE_PROPS} />
    </div>
);
