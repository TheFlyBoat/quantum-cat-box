import React from "react";
import { cn } from "@/lib/utils";

export const CarbonBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="shiny-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#434343" />
                <stop offset="100%" stopColor="#000000" />
            </linearGradient>

            <linearGradient id="shiny-lid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#666666" />
                <stop offset="100%" stopColor="#222222" />
            </linearGradient>

            <linearGradient id="neon-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(270 100% 70%)" />
                <stop offset="100%" stopColor="hsl(280 100% 60%)" />
            </linearGradient>

            <filter id="glow">
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
                fill="url(#shiny-lid-gradient)"
            />
            <rect
                x="8"
                y="27.5"
                width="84"
                height="1"
                fill="url(#neon-purple)"
                filter="url(#glow)"
            />
            <path
                d="M48 20 L52 20 L52 16 L48 16 Z"
                fill="hsl(var(--primary, 270 100% 60%))"
                filter="url(#glow)"
            />
        </g>

        <g>
            <rect
                x="5"
                y="28"
                width="90"
                height="60"
                rx="5"
                fill="url(#shiny-body-gradient)"
            />
            <path
                d="M20 40 L80 40
                    M20 50 L80 50
                    M20 60 L80 60
                    M20 70 L80 70"
                stroke="url(#neon-purple)"
                strokeWidth="1.2"
                filter="url(#glow)"
            />
        </g>

        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />
    </svg>
);
