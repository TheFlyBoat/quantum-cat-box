import { cn } from '@/lib/utils';

export const GalaxyBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            <radialGradient id="galaxy-body-gradient" cx="50%" cy="50%" r="75%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#1a0033" />
                <stop offset="50%" stopColor="#330066" />
                <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            <linearGradient id="galaxy-lid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a0080" />
                <stop offset="100%" stopColor="#2a0040" />
            </linearGradient>

            <pattern id="star-pattern" patternUnits="userSpaceOnUse" width="5" height="5">
                <circle cx="1" cy="1" r="0.5" fill="white" opacity="0.7" />
                <circle cx="4" cy="3" r="0.3" fill="white" opacity="0.5" />
                <circle cx="2" cy="4" r="0.2" fill="white" opacity="0.9" />
            </pattern>

            <filter id="nebula-glow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -5" result="glow" />
                <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />

        {/* Lid */}
        <g className={cn("transition-transform duration-300", !isOpen && "group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
            <path
                d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z"
                fill="url(#galaxy-lid-gradient)"
                filter="url(#nebula-glow)"
            />
        </g>

        {/* Box Body */}
        <g>
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="url(#galaxy-body-gradient)"
            />
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="url(#star-pattern)"
            />
        </g>
    </svg>
);