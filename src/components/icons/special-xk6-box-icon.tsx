import React from "react";
import { cn } from "@/lib/utils";

export const SpecialXK6BoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="xk6-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#d0d0d0" />
            </linearGradient>

            <linearGradient id="xk6-lid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e0e0e0" />
            </linearGradient>

            <linearGradient id="xk6-neon-light" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(210 100% 80%)" />
                <stop offset="100%" stopColor="hsl(200 100% 70%)" />
            </linearGradient>

            <filter id="xk6-glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <g className={cn("transition-transform duration-300 group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
            <path
                d="M8,28 H92 C96,28 96,22 92,22 L8,22 C4,22 4,28 8,28 Z"
                fill="url(#xk6-lid-gradient)"
            />
            <rect
                x="8"
                y="27.5"
                width="84"
                height="1"
                fill="url(#xk6-neon-light)"
                filter="url(#xk6-glow)"
            />
            <path
                d="M48 20 L52 20 L52 16 L48 16 Z"
                fill="hsl(var(--primary, 210 100% 70%))"
                filter="url(#xk6-glow)"
            />
        </g>

        <g>
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="url(#xk6-body-gradient)"
            />
            <path
                d="M20 40 L80 40
                    M20 50 L80 50
                    M20 60 L80 60
                    M20 70 L80 70"
                stroke="url(#xk6-neon-light)"
                strokeWidth="1.2"
                filter="url(#xk6-glow)"
            />
        </g>

        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />
    </svg>
);
