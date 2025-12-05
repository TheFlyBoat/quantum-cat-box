import React from "react";
import { cn } from "@/lib/utils";

export const BlackWoodenBoxIcon = ({ className, isOpen }: { className?: string, isOpen?: boolean }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="blackwood-stripes" gradientTransform="rotate(45)">
                <stop offset="0%" stopColor="#2c1e1e" />
                <stop offset="10%" stopColor="#2c1e1e" />
                <stop offset="10%" stopColor="#1a1212" />
                <stop offset="20%" stopColor="#1a1212" />
                <stop offset="20%" stopColor="#2c1e1e" />
                <stop offset="30%" stopColor="#2c1e1e" />
                <stop offset="30%" stopColor="#1a1212" />
                <stop offset="40%" stopColor="#1a1212" />
                <stop offset="40%" stopColor="#2c1e1e" />
                <stop offset="50%" stopColor="#2c1e1e" />
                <stop offset="50%" stopColor="#1a1212" />
                <stop offset="60%" stopColor="#1a1212" />
                <stop offset="60%" stopColor="#2c1e1e" />
                <stop offset="70%" stopColor="#2c1e1e" />
                <stop offset="70%" stopColor="#1a1212" />
                <stop offset="80%" stopColor="#1a1212" />
                <stop offset="80%" stopColor="#2c1e1e" />
                <stop offset="90%" stopColor="#2c1e1e" />
                <stop offset="90%" stopColor="#1a1212" />
                <stop offset="100%" stopColor="#1a1212" />
            </linearGradient>
        </defs>
        <g transform={isOpen ? 'translate(0, -15) rotate(-15, 50, 80)' : ''} style={{ transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)' }}>
            <path d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z" fill={"#1a1212"} />
        </g>
        <g>
            <rect x="5" y="28" width="90" height="60" rx="5" fill={"url(#blackwood-stripes)"} />
        </g>
        <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />
    </svg>
);
