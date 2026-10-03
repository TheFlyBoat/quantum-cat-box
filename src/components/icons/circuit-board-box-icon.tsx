import { cn } from '@/lib/utils';

export const CircuitBoardBoxIcon = ({ className, isOpen }: { className?: string; isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            {/* PCB Solder Mask Gradients */}
            <linearGradient id="pcb-body-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0E3D26" />
                <stop offset="40%" stopColor="#0A2E1C" />
                <stop offset="80%" stopColor="#062013" />
                <stop offset="100%" stopColor="#03140B" />
            </linearGradient>

            <linearGradient id="pcb-lid-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#134D31" />
                <stop offset="50%" stopColor="#0B331F" />
                <stop offset="100%" stopColor="#051E12" />
            </linearGradient>

            {/* Copper & Gold Bus Traces */}
            <linearGradient id="pcb-trace-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            <linearGradient id="pcb-gold-finger" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FACC15" />
                <stop offset="80%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>

            {/* Chip Gradient */}
            <linearGradient id="pcb-chip-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#262626" />
                <stop offset="50%" stopColor="#171717" />
                <stop offset="100%" stopColor="#0A0A0A" />
            </linearGradient>

            {/* Capacitor Gradients */}
            <linearGradient id="pcb-cap-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="35%" stopColor="#F1F5F9" />
                <stop offset="70%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* LED Glow Filters */}
            <filter id="pcb-glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="b" />
                <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="pcb-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Clip Paths */}
            <clipPath id="pcb-body-clip">
                <rect x="6" y="28" width="88" height="60" rx="5" />
            </clipPath>
        </defs>

        {/* Floor Shadow with Subtle Emerald Data Glow */}
        <ellipse cx="50" cy="94" rx="42" ry="5.5" fill="#000000" fillOpacity={0.35} />
        <ellipse cx="50" cy="94" rx="32" ry="4" fill="#10B981" fillOpacity={0.2} filter="url(#pcb-glow-emerald)" />

        {/* OPEN STATE: INTERNAL CYBER SOCKET & HOLOGRAPHIC DATA BEAMS */}
        {isOpen && (
            <g>
                {/* Deep Internal Socket */}
                <ellipse cx="50" cy="29" rx="41" ry="7.5" fill="#021208" />
                <ellipse cx="50" cy="29" rx="38" ry="6" fill="#06381C" />

                {/* Upward Cyber Hologram Energy Beams */}
                <path d="M 28,29 L 16,6 L 36,28 Z" fill="#34D399" opacity="0.35" />
                <path d="M 50,29 L 48,0 L 54,28 Z" fill="#06B6D4" opacity="0.45" />
                <path d="M 72,29 L 84,6 L 64,28 Z" fill="#34D399" opacity="0.35" />

                {/* Digital Data Sparkles / Floating Bits */}
                <circle cx="24" cy="18" r="1.1" fill="#6EE7B7" filter="url(#pcb-glow-emerald)" />
                <circle cx="45" cy="10" r="1.3" fill="#38BDF8" filter="url(#pcb-glow-cyan)" />
                <circle cx="58" cy="14" r="0.9" fill="#A7F3D0" filter="url(#pcb-glow-emerald)" />
                <circle cx="76" cy="19" r="1.2" fill="#6EE7B7" filter="url(#pcb-glow-emerald)" />
                <rect x="34" y="12" width="2" height="2" fill="#38BDF8" opacity="0.8" />
                <rect x="66" y="10" width="2" height="2" fill="#34D399" opacity="0.8" />
            </g>
        )}

        {/* BOX BODY */}
        <g>
            {/* PCB Solder Mask Base */}
            <rect x="6" y="28" width="88" height="60" rx="5" fill="url(#pcb-body-bg)" stroke="#10B981" strokeWidth="1.2" />

            {/* Clipped Circuit Traces & Silkscreen */}
            <g clipPath="url(#pcb-body-clip)">
                {/* Ground Plane Grid Meshing */}
                <g opacity="0.1" stroke="#34D399" strokeWidth="0.4">
                    <line x1="6" y1="36" x2="94" y2="36" />
                    <line x1="6" y1="44" x2="94" y2="44" />
                    <line x1="6" y1="52" x2="94" y2="52" />
                    <line x1="6" y1="60" x2="94" y2="60" />
                    <line x1="6" y1="68" x2="94" y2="68" />
                    <line x1="6" y1="76" x2="94" y2="76" />
                    <line x1="6" y1="84" x2="94" y2="84" />
                </g>

                {/* Golden PCB Bus Traces (Angled 45 deg) */}
                <g stroke="url(#pcb-trace-gold)" strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {/* Left bus traces */}
                    <path d="M 8,36 H 18 L 26,44 H 36" />
                    <path d="M 8,42 H 16 L 24,50 H 34" />
                    <path d="M 8,48 H 14 L 20,54 H 26 V 68 H 36" />
                    <path d="M 8,74 H 18 L 26,66 H 36" />
                    <path d="M 8,80 H 22 L 32,70 H 36" />

                    {/* Right bus traces */}
                    <path d="M 92,36 H 82 L 74,44 H 64" />
                    <path d="M 92,42 H 84 L 76,50 H 66" />
                    <path d="M 92,48 H 86 L 80,54 H 74 V 68 H 64" />
                    <path d="M 92,74 H 82 L 74,66 H 64" />
                    <path d="M 92,80 H 78 L 68,70 H 64" />

                    {/* Bottom power rails */}
                    <path d="M 38,82 H 62" stroke="#34D399" strokeWidth="1.2" opacity="0.6" />
                    <path d="M 42,85 H 58" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
                </g>

                {/* Gold Solder Pads & Vias */}
                <g fill="url(#pcb-trace-gold)">
                    <circle cx="18" cy="36" r="1.3" />
                    <circle cx="26" cy="44" r="1.3" />
                    <circle cx="16" cy="42" r="1.3" />
                    <circle cx="24" cy="50" r="1.3" />
                    <circle cx="18" cy="74" r="1.3" />
                    <circle cx="26" cy="66" r="1.3" />
                    <circle cx="82" cy="36" r="1.3" />
                    <circle cx="74" cy="44" r="1.3" />
                    <circle cx="84" cy="42" r="1.3" />
                    <circle cx="76" cy="50" r="1.3" />
                    <circle cx="82" cy="74" r="1.3" />
                    <circle cx="74" cy="66" r="1.3" />
                </g>
                {/* Via drill holes */}
                <g fill="#062013">
                    <circle cx="18" cy="36" r="0.5" />
                    <circle cx="26" cy="44" r="0.5" />
                    <circle cx="16" cy="42" r="0.5" />
                    <circle cx="24" cy="50" r="0.5" />
                    <circle cx="18" cy="74" r="0.5" />
                    <circle cx="26" cy="66" r="0.5" />
                    <circle cx="82" cy="36" r="0.5" />
                    <circle cx="74" cy="44" r="0.5" />
                    <circle cx="84" cy="42" r="0.5" />
                    <circle cx="76" cy="50" r="0.5" />
                    <circle cx="82" cy="74" r="0.5" />
                    <circle cx="74" cy="66" r="0.5" />
                </g>

                {/* Surface Mount Components (SMD) */}
                <g>
                    <rect x="11" y="58" width="5" height="2.5" rx="0.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="0.4" />
                    <rect x="11" y="64" width="5" height="2.5" rx="0.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="0.4" />
                    <rect x="84" y="58" width="5" height="2.5" rx="0.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="0.4" />
                    <rect x="84" y="64" width="5" height="2.5" rx="0.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="0.4" />
                </g>

                {/* Cylindrical Aluminum Capacitors (Top corners) */}
                <g transform="translate(14, 32)">
                    <circle cx="0" cy="0" r="3.2" fill="url(#pcb-cap-metal)" stroke="#475569" strokeWidth="0.5" />
                    <line x1="-1.8" y1="0" x2="1.8" y2="0" stroke="#334155" strokeWidth="0.5" />
                    <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#334155" strokeWidth="0.5" />
                </g>
                <g transform="translate(86, 32)">
                    <circle cx="0" cy="0" r="3.2" fill="url(#pcb-cap-metal)" stroke="#475569" strokeWidth="0.5" />
                    <line x1="-1.8" y1="0" x2="1.8" y2="0" stroke="#334155" strokeWidth="0.5" />
                    <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#334155" strokeWidth="0.5" />
                </g>

                {/* White Silkscreen Markings */}
                <g fill="#FFFFFF" opacity="0.75" fontFamily="monospace" fontSize="2.6" fontWeight="bold">
                    <text x="10" y="32">C1</text>
                    <text x="82" y="32">C2</text>
                    <text x="10" y="86">GND</text>
                    <text x="79" y="86">+5V</text>
                    <text x="40" y="35" fontSize="2.2">REV 2.0</text>
                </g>

                {/* Status LEDs with Luminous Glow */}
                <g transform="translate(20, 84)">
                    <circle cx="0" cy="0" r="1.3" fill="#10B981" filter="url(#pcb-glow-emerald)" />
                    <circle cx="0" cy="0" r="0.7" fill="#A7F3D0" />
                    <text x="3" y="1" fill="#FFF" opacity="0.7" fontFamily="monospace" fontSize="2">PWR</text>
                </g>
                <g transform="translate(32, 84)">
                    <circle cx="0" cy="0" r="1.3" fill="#06B6D4" filter="url(#pcb-glow-cyan)" />
                    <circle cx="0" cy="0" r="0.7" fill="#E0F2FE" />
                    <text x="3" y="1" fill="#FFF" opacity="0.7" fontFamily="monospace" fontSize="2">ACT</text>
                </g>
                <g transform="translate(68, 84)">
                    <circle cx="0" cy="0" r="1.3" fill="#F59E0B" filter="url(#pcb-glow-emerald)" />
                    <circle cx="0" cy="0" r="0.7" fill="#FEF08A" />
                    <text x="3" y="1" fill="#FFF" opacity="0.7" fontFamily="monospace" fontSize="2">TX</text>
                </g>

                {/* CENTRAL MAIN PROCESSOR (Q-CAT 9000 QUANTUM CHIP) */}
                <g transform="translate(50, 57)">
                    {/* Top pins */}
                    <rect x="-11" y="-15" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="-7" y="-15" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="-3" y="-15" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="1" y="-15" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="5" y="-15" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="9" y="-15" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    {/* Bottom pins */}
                    <rect x="-11" y="12" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="-7" y="12" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="-3" y="12" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="1" y="12" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="5" y="12" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    <rect x="9" y="12" width="1.2" height="3" fill="url(#pcb-trace-gold)" />
                    {/* Left pins */}
                    <rect x="-15" y="-11" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="-15" y="-7" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="-15" y="-3" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="-15" y="1" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="-15" y="5" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="-15" y="9" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    {/* Right pins */}
                    <rect x="12" y="-11" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="12" y="-7" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="12" y="-3" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="12" y="1" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="12" y="5" width="3" height="1.2" fill="url(#pcb-trace-gold)" />
                    <rect x="12" y="9" width="3" height="1.2" fill="url(#pcb-trace-gold)" />

                    {/* Silkscreen outline box for IC */}
                    <rect x="-14" y="-14" width="28" height="28" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.7" />

                    {/* Chip Body */}
                    <rect x="-12" y="-12" width="24" height="24" rx="2" fill="url(#pcb-chip-bg)" stroke="#38BDF8" strokeWidth="0.8" />

                    {/* Pin 1 Dot Marker */}
                    <circle cx="-9" cy="-9" r="0.9" fill="#94A3B8" />

                    {/* Cute Cyber Cat Silkscreen Logo */}
                    <g transform="translate(0, -3)">
                        <path d="M -5,-2 L -3,3 H 3 L 5,-2 L 3,1 H -3 Z" fill="#34D399" opacity="0.9" />
                        <circle cx="-2" cy="4" r="0.8" fill="#38BDF8" filter="url(#pcb-glow-cyan)" />
                        <circle cx="2" cy="4" r="0.8" fill="#38BDF8" filter="url(#pcb-glow-cyan)" />
                        <polygon points="0,5.5 -0.8,6.5 0.8,6.5" fill="#34D399" />
                    </g>

                    {/* Text on Chip */}
                    <text x="0" y="8" fill="#E2E8F0" fontFamily="monospace" fontSize="2.6" fontWeight="bold" textAnchor="middle">Q-CAT</text>
                    <text x="0" y="10.5" fill="#64748B" fontFamily="monospace" fontSize="1.6" textAnchor="middle">QC-9000X</text>
                </g>
            </g>
        </g>

        {/* BOX LID (PCB Edge Connector with Gold Finger Contacts) */}
        <g className={cn("transition-transform duration-300 group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
            {isOpen && (
                <ellipse cx="50" cy="30" rx="44" ry="4" fill="#000000" fillOpacity={0.4} filter="url(#pcb-glow-emerald)" />
            )}

            {/* Lid Base Structure */}
            <path
                d="M 7,28 H 93 C 96,28 96,21 93,21 L 7,21 C 4,21 4,28 7,28 Z"
                fill="url(#pcb-lid-bg)"
                stroke="#10B981"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />

            {/* Gold Finger Contact Strips (20 contacts) */}
            <g transform="translate(10, 24)">
                {Array.from({ length: 20 }).map((_, i) => (
                    <rect key={i} x={i * 4} y="0" width="2" height="3.6" rx="0.5" fill="url(#pcb-gold-finger)" />
                ))}
            </g>

            {/* Top Silkscreen Legend on Lid */}
            <line x1="9" y1="22.5" x2="91" y2="22.5" stroke="#FFFFFF" strokeWidth="0.4" opacity="0.6" />
            <circle cx="12" cy="22.5" r="0.6" fill="#34D399" />
            <circle cx="88" cy="22.5" r="0.6" fill="#34D399" />
        </g>
    </svg>
);