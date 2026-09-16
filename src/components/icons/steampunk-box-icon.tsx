import { cn } from '@/lib/utils';

// Helper to generate a gear path with N teeth
const generateGear = (cx: number, cy: number, outerR: number, innerR: number, teeth: number) => {
    let d = '';
    const step = (Math.PI * 2) / teeth;
    const halfTooth = step * 0.25;

    for (let i = 0; i < teeth; i++) {
        const a = i * step;
        const x0 = cx + Math.cos(a - halfTooth * 1.3) * innerR;
        const y0 = cy + Math.sin(a - halfTooth * 1.3) * innerR;
        const x1 = cx + Math.cos(a - halfTooth * 0.8) * outerR;
        const y1 = cy + Math.sin(a - halfTooth * 0.8) * outerR;
        const x2 = cx + Math.cos(a + halfTooth * 0.8) * outerR;
        const y2 = cy + Math.sin(a + halfTooth * 0.8) * outerR;
        const x3 = cx + Math.cos(a + halfTooth * 1.3) * innerR;
        const y3 = cy + Math.sin(a + halfTooth * 1.3) * innerR;

        if (i === 0) d += `M ${x0.toFixed(2)},${y0.toFixed(2)} `;
        else d += `L ${x0.toFixed(2)},${y0.toFixed(2)} `;
        d += `L ${x1.toFixed(2)},${y1.toFixed(2)} `;
        d += `L ${x2.toFixed(2)},${y2.toFixed(2)} `;
        d += `L ${x3.toFixed(2)},${y3.toFixed(2)} `;
    }
    d += 'Z';
    return d;
};

const LARGE_GEAR_PATH = generateGear(42, 60, 15, 11.5, 12);
const SMALL_GEAR_PATH = generateGear(64, 46, 10, 7.5, 8);
const LID_GEAR_PATH = generateGear(50, 24.5, 4.5, 3.2, 6);

const SPOKE_ANGLES = [0, 60, 120, 180, 240, 300];
const BEZEL_SCREW_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const SteampunkBoxIcon = ({ className, isOpen }: { className?: string; isOpen?: boolean }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(className)}
    >
        <defs>
            {/* Steampunk Metal Gradients */}
            <linearGradient id="sp-copper-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C26B38" />
                <stop offset="35%" stopColor="#9C4B23" />
                <stop offset="70%" stopColor="#783413" />
                <stop offset="100%" stopColor="#4D1F08" />
            </linearGradient>

            <linearGradient id="sp-lid-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97A43" />
                <stop offset="45%" stopColor="#AB5326" />
                <stop offset="100%" stopColor="#6E2F0F" />
            </linearGradient>

            {/* Antique Polished Brass */}
            <linearGradient id="sp-brass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#D97706" />
                <stop offset="85%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="sp-brass-light" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="50%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Steel / Iron Banding */}
            <linearGradient id="sp-iron" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Copper Steam Pipe Gradient */}
            <linearGradient id="sp-pipe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="40%" stopColor="#FDBA74" />
                <stop offset="80%" stopColor="#C2410C" />
                <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>

            {/* Furnace Glow Gradient (Open State) */}
            <radialGradient id="sp-furnace-glow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="25%" stopColor="#F97316" stopOpacity={0.9} />
                <stop offset="60%" stopColor="#C2410C" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#3C1004" />
            </radialGradient>

            {/* Steam Cloud Filter / Glow */}
            <filter id="sp-steam-soft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            <filter id="sp-metal-bevel" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.6" result="b" />
                <feOffset dx="0.5" dy="0.8" in="b" result="offset" />
                <feMerge>
                    <feMergeNode in="offset" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Clip Paths */}
            <clipPath id="sp-body-clip">
                <rect x="6" y="28" width="88" height="60" rx="5" />
            </clipPath>
        </defs>

        {/* Floor Shadow with Warm Amber Steam Glow */}
        <ellipse cx="50" cy="94" rx="42" ry="5.5" fill="#000000" fillOpacity={0.4} />
        <ellipse cx="50" cy="94" rx="34" ry="4.5" fill="#EA580C" fillOpacity={0.25} filter="url(#sp-steam-soft)" />

        {/* OPEN STATE: INCANDESCENT FURNACE CAVITY & GOLDEN STEAM PUFFS */}
        {isOpen && (
            <g>
                {/* Furnace Fire Cavity */}
                <ellipse cx="50" cy="29" rx="41" ry="8" fill="#1A0702" />
                <ellipse cx="50" cy="29" rx="39" ry="6.5" fill="url(#sp-furnace-glow)" />

                {/* Billowing Golden Steam Clouds rising from furnace */}
                <g filter="url(#sp-steam-soft)" opacity={0.85}>
                    <circle cx="28" cy="15" r="9" fill="#FEF08A" opacity={0.6} />
                    <circle cx="48" cy="8" r="11" fill="#FFFBEB" opacity={0.8} />
                    <circle cx="68" cy="14" r="9.5" fill="#FED7AA" opacity={0.6} />
                    <circle cx="38" cy="18" r="7" fill="#FDBA74" opacity={0.5} />
                    <circle cx="58" cy="17" r="8" fill="#FDBA74" opacity={0.5} />
                </g>

                {/* Flying Heat Sparks */}
                <circle cx="30" cy="10" r="1" fill="#FEF08A" filter="url(#sp-steam-soft)" />
                <circle cx="52" cy="2" r="1.3" fill="#FFFFFF" filter="url(#sp-steam-soft)" />
                <circle cx="64" cy="7" r="0.9" fill="#F97316" filter="url(#sp-steam-soft)" />
                <circle cx="42" cy="5" r="1.1" fill="#FEF08A" />
            </g>
        )}

        {/* BOX BODY */}
        <g>
            {/* Burnished Copper Boiler Hull */}
            <rect x="6" y="28" width="88" height="60" rx="5" fill="url(#sp-copper-bg)" stroke="#78350F" strokeWidth="1.2" />

            {/* Clipped Steampunk Machinery Inside */}
            <g clipPath="url(#sp-body-clip)">
                {/* Boiler Plate Seams (Horizontal riveted panels) */}
                <line x1="6" y1="48" x2="94" y2="48" stroke="#4D1F08" strokeWidth="0.8" />
                <line x1="6" y1="48.8" x2="94" y2="48.8" stroke="#FDBA74" strokeWidth="0.3" opacity={0.5} />
                <line x1="6" y1="68" x2="94" y2="68" stroke="#4D1F08" strokeWidth="0.8" />
                <line x1="6" y1="68.8" x2="94" y2="68.8" stroke="#FDBA74" strokeWidth="0.3" opacity={0.5} />

                {/* Steam Exhaust Pipes (Left side copper piping) */}
                <g fill="none" stroke="url(#sp-pipe)" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 14,84 V 40 Q 14,35 19,35 H 32" strokeWidth="3.2" />
                    <rect x="11.5" y="74" width="5" height="2" rx="0.5" fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.4" />
                    <rect x="11.5" y="52" width="5" height="2" rx="0.5" fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.4" />
                    <rect x="25" y="32.5" width="2" height="5" rx="0.5" fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.4" />
                </g>

                {/* Pressure Relief Valve Handwheel */}
                <g transform="translate(14, 62)">
                    <circle cx="0" cy="0" r="3.5" fill="none" stroke="url(#sp-brass)" strokeWidth="1.2" />
                    <line x1="-3" y1="0" x2="3" y2="0" stroke="url(#sp-brass)" strokeWidth="1" />
                    <line x1="0" y1="-3" x2="0" y2="3" stroke="url(#sp-brass)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.2" fill="#78350F" />
                </g>

                {/* INTERLOCKING GEAR TRAIN */}
                {/* 1. Large Main Drive Gear (Antique Brass) */}
                <g filter="url(#sp-metal-bevel)">
                    <path d={LARGE_GEAR_PATH} fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.6" />
                    <circle cx="42" cy="60" r="7.5" fill="none" stroke="#78350F" strokeWidth="0.6" />
                    {SPOKE_ANGLES.map((deg) => (
                        <circle
                            key={deg}
                            cx={42 + Math.cos((deg * Math.PI) / 180) * 5.2}
                            cy={60 + Math.sin((deg * Math.PI) / 180) * 5.2}
                            r={1.6}
                            fill="#4D1F08"
                        />
                    ))}
                    <circle cx="42" cy="60" r="3" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.6" />
                    <circle cx="42" cy="60" r="1.3" fill="#1E293B" />
                </g>

                {/* 2. Small Intermeshing Pinion Gear (Dark Cast Steel) */}
                <g filter="url(#sp-metal-bevel)">
                    <path d={SMALL_GEAR_PATH} fill="url(#sp-iron)" stroke="#0F172A" strokeWidth="0.6" />
                    <circle cx="64" cy="46" r="4" fill="#1E293B" />
                    <circle cx="64" cy="46" r="2.2" fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.5" />
                    <circle cx="64" cy="46" r="0.9" fill="#000" />
                </g>

                {/* 3. VICTORIAN STEAM PRESSURE GAUGE */}
                <g transform="translate(73, 67)" filter="url(#sp-metal-bevel)">
                    <circle cx="0" cy="0" r="13" fill="url(#sp-brass)" stroke="#78350F" strokeWidth="1" />
                    {BEZEL_SCREW_ANGLES.map((deg) => (
                        <circle
                            key={deg}
                            cx={Math.cos((deg * Math.PI) / 180) * 11.8}
                            cy={Math.sin((deg * Math.PI) / 180) * 11.8}
                            r={0.6}
                            fill="#4D1F08"
                        />
                    ))}
                    <circle cx="0" cy="0" r="10" fill="#FDF8EC" stroke="#78350F" strokeWidth="0.5" />
                    <path d="M 4,-7.5 A 8.5 8.5 0 0 1 7.5,-4" fill="none" stroke="#EF4444" strokeWidth="1.8" />
                    <path
                        d="M -7,0 H -5 M 7,0 H 5 M 0,-7 V -5 M -5,-5 L -3.5,-3.5 M 5,-5 L 3.5,-3.5 M -5,5 L -3.5,3.5 M 5,5 L 3.5,3.5"
                        stroke="#78350F"
                        strokeWidth="0.6"
                    />
                    <text x="0" y="5" fontFamily="serif" fontSize="2.2" fontWeight="bold" fill="#78350F" textAnchor="middle">
                        PSI
                    </text>
                    <line x1="0" y1="0" x2="5.5" y2="-5.5" stroke="#DC2626" strokeWidth="0.9" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="2" fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.5" />
                    <circle cx="0" cy="0" r="0.8" fill="#4D1F08" />
                    <path d="M -7,-5 A 8.5 8.5 0 0 1 5,-7" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity={0.6} />
                </g>
            </g>

            {/* Brass Corner Brackets with Rivets */}
            {/* Top Left */}
            <g transform="translate(6, 28)">
                <path d="M 0,14 L 0,0 L 14,0" fill="none" stroke="url(#sp-brass)" strokeWidth="2.5" />
                <circle cx="4" cy="4" r="1.1" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="4" cy="11" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="11" cy="4" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
            </g>
            {/* Top Right */}
            <g transform="translate(94, 28)">
                <path d="M 0,14 L 0,0 L -14,0" fill="none" stroke="url(#sp-brass)" strokeWidth="2.5" />
                <circle cx="-4" cy="4" r="1.1" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="-4" cy="11" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="-11" cy="4" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
            </g>
            {/* Bottom Left */}
            <g transform="translate(6, 88)">
                <path d="M 0,-14 L 0,0 L 14,0" fill="none" stroke="url(#sp-brass)" strokeWidth="2.5" />
                <circle cx="4" cy="-4" r="1.1" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="4" cy="-11" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="11" cy="-4" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
            </g>
            {/* Bottom Right */}
            <g transform="translate(94, 88)">
                <path d="M 0,-14 L 0,0 L -14,0" fill="none" stroke="url(#sp-brass)" strokeWidth="2.5" />
                <circle cx="-4" cy="-4" r="1.1" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="-4" cy="-11" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="-11" cy="-4" r="0.9" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
            </g>

            {/* Base Brass Plinth Trim with Rivets */}
            <rect x="18" y="85" width="64" height="2" rx="0.5" fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.4" />
            <circle cx="28" cy="86" r="0.8" fill="url(#sp-brass-light)" />
            <circle cx="42" cy="86" r="0.8" fill="url(#sp-brass-light)" />
            <circle cx="58" cy="86" r="0.8" fill="url(#sp-brass-light)" />
            <circle cx="72" cy="86" r="0.8" fill="url(#sp-brass-light)" />
        </g>

        {/* BOX LID (HEAVY BOILER PLATE WITH BRASS HINGES & STEAM VALVE) */}
        <g className={cn("transition-transform duration-300 group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
            {isOpen && (
                <ellipse cx="50" cy="30" rx="44" ry="4" fill="#000000" fillOpacity={0.4} filter="url(#sp-steam-soft)" />
            )}

            {/* Lid Base Structure */}
            <path
                d="M 7,28 H 93 C 96.5,28 96.5,21 93,21 L 7,21 C 3.5,21 3.5,28 7,28 Z"
                fill="url(#sp-lid-bg)"
                stroke="url(#sp-brass)"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />

            {/* Riveted Iron Strap across lid */}
            <line x1="8" y1="24.5" x2="92" y2="24.5" stroke="url(#sp-iron)" strokeWidth="1.8" />
            {/* Lid Rivets */}
            <g fill="url(#sp-brass-light)">
                <circle cx="14" cy="24.5" r="0.8" />
                <circle cx="24" cy="24.5" r="0.8" />
                <circle cx="34" cy="24.5" r="0.8" />
                <circle cx="66" cy="24.5" r="0.8" />
                <circle cx="76" cy="24.5" r="0.8" />
                <circle cx="86" cy="24.5" r="0.8" />
            </g>

            {/* Center Brass Cog Crest */}
            <g filter="url(#sp-metal-bevel)">
                <path d={LID_GEAR_PATH} fill="url(#sp-brass)" stroke="#78350F" strokeWidth="0.5" />
                <circle cx="50" cy="24.5" r="1.5" fill="url(#sp-brass-light)" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="50" cy="24.5" r="0.7" fill="#4D1F08" />
            </g>
        </g>
    </svg>
);