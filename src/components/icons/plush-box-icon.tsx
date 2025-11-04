import { cn } from '@/lib/utils';

export const PlushBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            <linearGradient id="plush-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>

            <linearGradient id="plush-lid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <filter id="soft-blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
                <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
                <feFlood floodColor="#ffffff" floodOpacity="0.3" result="flood" />
                <feComposite in="flood" in2="offsetBlur" operator="in" result="shadow" />
                <feMerge>
                    <feMergeNode in="shadow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />

        {/* Lid */}
        <g className={cn("transition-transform duration-300", !isOpen && "group-hover:-translate-y-1", isOpen && "-translate-y-4")} filter="url(#soft-blur)">
            <path
                d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z"
                fill="url(#plush-lid-gradient)"
                rx="3" ry="3" 
                stroke="#db2777" 
                strokeWidth="0.5"
                strokeDasharray="2 1"
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
                fill="url(#plush-body-gradient)"
                stroke="#db2777" 
                strokeWidth="0.5"
                strokeDasharray="2 1"
            />
            {/* Soft texture overlay */}
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="#ffffff"
                fillOpacity="0.1"
            />
        </g>
    </svg>
);