import React from "react";
import { cn } from "@/lib/utils";

export const AliveCatIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={cn(className)}>
        <g style={{ strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none', stroke: 'currentColor' }}>
            <path d="M30 90 C 10 90, 10 60, 30 60 L 70 60 C 90 60, 90 90, 70 90 Z" />
            <path d="M 35 60 C 25 30, 75 30, 65 60 Z" />
            <path d="M 35 40 C 30 25, 20 30, 30 40" />
            <path d="M 65 40 C 70 25, 80 30, 70 40" />
            <path d="M 80 90 C 95 85, 95 70, 85 70" />
            <circle cx="45" cy="50" r="2" fill="currentColor" />
            <circle cx="55" cy="50" r="2" fill="currentColor" />
            <path d="M 48 55 Q 50 58, 52 55" />
        </g>
    </svg>
);
