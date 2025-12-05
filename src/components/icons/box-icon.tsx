import React from "react";
import { cn } from "@/lib/utils";

export const BoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            <linearGradient id="stripes" gradientTransform="rotate(45)">
                <stop offset="0%" stopColor="#A0522D" />
                <stop offset="10%" stopColor="#A0522D" />
                <stop offset="10%" stopColor="#8B4513" />
                <stop offset="20%" stopColor="#8B4513" />
                <stop offset="20%" stopColor="#A0522D" />
                <stop offset="30%" stopColor="#A0522D" />
                <stop offset="30%" stopColor="#8B4513" />
                <stop offset="40%" stopColor="#8B4513" />
                <stop offset="40%" stopColor="#A0522D" />
                <stop offset="50%" stopColor="#A0522D" />
                <stop offset="50%" stopColor="#8B4513" />
                <stop offset="60%" stopColor="#8B4513" />
                <stop offset="60%" stopColor="#A0522D" />
                <stop offset="70%" stopColor="#A0522D" />
                <stop offset="70%" stopColor="#8B4513" />
                <stop offset="80%" stopColor="#8B4513" />
                <stop offset="80%" stopColor="#A0522D" />
                <stop offset="90%" stopColor="#A0522D" />
                <stop offset="90%" stopColor="#8B4513" />
                <stop offset="100%" stopColor="#8B4513" />
            </linearGradient>
        </defs>

        <g className={cn("transition-transform duration-300", !isOpen && "group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
            <path d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z" fill={"#8B4513"} />
        </g>

        <g>
            <rect x="5" y="28" width="90" height="60" rx="5" fill={"url(#stripes)"} />
        </g>

        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />
    </svg>
);
