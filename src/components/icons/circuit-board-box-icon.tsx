import { cn } from '@/lib/utils';

export const CircuitBoardBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            <linearGradient id="circuit-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#002200" />
                <stop offset="100%" stopColor="#001100" />
            </linearGradient>

            <linearGradient id="circuit-lid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#004400" />
                <stop offset="100%" stopColor="#002200" />
            </linearGradient>

            <pattern id="circuit-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <path d="M0 5 H10 M5 0 V10" stroke="#00ff00" strokeWidth="0.5" opacity="0.3" />
                <circle cx="5" cy="5" r="1" fill="#00ff00" opacity="0.3" />
            </pattern>

            <filter id="glow-green">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <g className={cn("transition-transform duration-300 group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
            <path
                d="M8,28 H92 C96,28 96,22 92,22 L8,22 C4,22 4,28 8,28 Z"
                fill="url(#circuit-lid-gradient)"
            />
            <rect
                x="8"
                y="27.5"
                width="84"
                height="1"
                fill="#00ff00"
                filter="url(#glow-green)"
            />
        </g>

        <g>
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="url(#circuit-body-gradient)"
            />
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="url(#circuit-pattern)"
            />
        </g>

        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />
    </svg>
);