import React from "react";
import { cn } from "@/lib/utils";

export const StoneBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="stone-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8f8f8f" />
                <stop offset="25%" stopColor="#6b8e23" />
                <stop offset="50%" stopColor="#6b6b6b" />
                <stop offset="75%" stopColor="#6b8e23" />
                <stop offset="100%" stopColor="#8f8f8f" />
            </linearGradient>
            <linearGradient id="stone-lid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9f9f9f" />
                <stop offset="50%" stopColor="#8fbc8f" />
                <stop offset="100%" stopColor="#9f9f9f" />
            </linearGradient>
        </defs>
        <g className={cn("transition-transform duration-300", !isOpen && "group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
            <path d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z" fill={"#8B4513"} />
        </g>
        <g>
            <rect x="5" y="28" width="90" height="60" rx="5" fill={"url(#stone-body-gradient)"} />
        </g>
        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />
    </svg>
);
