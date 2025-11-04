import { cn } from '@/lib/utils';

export const CrystalBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            <radialGradient id="crystal-body-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.9" />
            </radialGradient>

            <linearGradient id="crystal-lid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>

            <filter id="crystal-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />

        {/* Lid */}
        <g className={cn("transition-transform duration-300", !isOpen && "group-hover:-translate-y-1", isOpen && "-translate-y-4")} filter="url(#crystal-glow)">
            <path
                d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z"
                fill="url(#crystal-lid-gradient)"
                stroke="#e9d5ff" 
                strokeWidth="0.5"
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
                fill="url(#crystal-body-gradient)"
                stroke="#c084fc" 
                strokeWidth="0.5"
            />
            {/* Facets */}
            <path d="M 5 28 L 50 58 L 95 28 Z" fill="#d8b4fe" opacity="0.2" />
            <path d="M 5 88 L 50 58 L 5 28 Z" fill="#e9d5ff" opacity="0.2" />
            <path d="M 95 88 L 50 58 L 95 28 Z" fill="#c084fc" opacity="0.2" />
        </g>
    </svg>
);