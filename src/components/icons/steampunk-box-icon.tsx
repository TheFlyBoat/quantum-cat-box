import { cn } from '@/lib/utils';

export const SteampunkBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            <linearGradient id="brass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b58a00" />
                <stop offset="50%" stopColor="#e0b500" />
                <stop offset="100%" stopColor="#b58a00" />
            </linearGradient>

            <linearGradient id="copper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b87333" />
                <stop offset="50%" stopColor="#e09b50" />
                <stop offset="100%" stopColor="#b87333" />
            </linearGradient>

            <pattern id="rivet-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <circle cx="2" cy="2" r="1" fill="#6b4e00" />
                <circle cx="8" cy="8" r="1" fill="#6b4e00" />
            </pattern>

            <filter id="steampunk-glow">
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
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
                fill="url(#brass-gradient)"
                stroke="#6b4e00"
                strokeWidth="1"
                filter="url(#steampunk-glow)"
            />
            {/* Rivets on lid */}
            <circle cx="15" cy="25" r="1.5" fill="#6b4e00" />
            <circle cx="85" cy="25" r="1.5" fill="#6b4e00" />
        </g>

        {/* Box Body */}
        <g>
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="url(#copper-gradient)"
                stroke="#6b4e00"
                strokeWidth="1"
            />
            {/* Gears and pipes */}
            <circle cx="20" cy="45" r="8" fill="url(#brass-gradient)" stroke="#6b4e00" strokeWidth="0.5" />
            <path d="M20 45 L 35 45" stroke="url(#copper-gradient)" strokeWidth="2" />
            <circle cx="80" cy="70" r="10" fill="url(#brass-gradient)" stroke="#6b4e00" strokeWidth="0.5" />
            <rect x="10" y="70" width="15" height="5" fill="url(#copper-gradient)" />
            <rect x="70" y="35" width="5" height="15" fill="url(#copper-gradient)" />
        </g>
    </svg>
);