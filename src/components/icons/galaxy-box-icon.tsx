import React from "react";
import { cn } from "@/lib/utils";

export const GalaxyBoxIcon = ({
  className,
  isOpen,
}: {
  className?: string;
  isOpen?: boolean;
}) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("overflow-visible", className)}
  >
    <defs>
      {/* Deep Space Cosmic Gradients */}
      <linearGradient id="gx-body-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B021C" />
        <stop offset="35%" stopColor="#180736" />
        <stop offset="70%" stopColor="#0D0322" />
        <stop offset="100%" stopColor="#050110" />
      </linearGradient>

      <linearGradient id="gx-lid-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2D0B5A" />
        <stop offset="40%" stopColor="#1C063C" />
        <stop offset="80%" stopColor="#100226" />
        <stop offset="100%" stopColor="#250849" />
      </linearGradient>

      {/* Luminous Starlight Borders (Zero Gold: Celestial Cyan & Violet) */}
      <linearGradient id="gx-starlight-border" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A240FF" stopOpacity={0.85} />
        <stop offset="30%" stopColor="#C084FC" stopOpacity={0.7} />
        <stop offset="70%" stopColor="#38BDF8" stopOpacity={0.85} />
        <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.95} />
      </linearGradient>

      <linearGradient id="gx-starlight-bright" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E0E7FF" />
        <stop offset="50%" stopColor="#BAE6FD" />
        <stop offset="100%" stopColor="#67E8F9" />
      </linearGradient>

      {/* Luminous Nebula Gradients */}
      <radialGradient id="gx-nebula-magenta" cx="35%" cy="45%" r="45%">
        <stop offset="0%" stopColor="#FF3399" stopOpacity={0.85} />
        <stop offset="40%" stopColor="#D946EF" stopOpacity={0.5} />
        <stop offset="75%" stopColor="#A240FF" stopOpacity={0.2} />
        <stop offset="100%" stopColor="#A240FF" stopOpacity={0} />
      </radialGradient>

      <radialGradient id="gx-nebula-cyan" cx="68%" cy="62%" r="48%">
        <stop offset="0%" stopColor="#00F5FF" stopOpacity={0.8} />
        <stop offset="35%" stopColor="#38BDF8" stopOpacity={0.5} />
        <stop offset="70%" stopColor="#3B82F6" stopOpacity={0.2} />
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
      </radialGradient>

      <radialGradient id="gx-nebula-violet" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#C084FC" stopOpacity={0.6} />
        <stop offset="50%" stopColor="#7E22CE" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#3B0764" stopOpacity={0} />
      </radialGradient>

      {/* Singularity Core Gradient */}
      <radialGradient id="gx-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#FFF4FF" />
        <stop offset="55%" stopColor="#F0ABFC" stopOpacity={0.9} />
        <stop offset="80%" stopColor="#C084FC" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#A240FF" stopOpacity={0} />
      </radialGradient>

      {/* Planetary Ring Gradient */}
      <linearGradient id="gx-ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.9} />
        <stop offset="30%" stopColor="#E879F9" stopOpacity={0.8} />
        <stop offset="70%" stopColor="#BAE6FD" stopOpacity={0.85} />
        <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.9} />
      </linearGradient>

      {/* Cavity Interior Glow (When Open) */}
      <radialGradient id="gx-cavity-glow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#A240FF" stopOpacity={0.6} />
        <stop offset="40%" stopColor="#4C1D95" stopOpacity={0.4} />
        <stop offset="75%" stopColor="#1E0A3C" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#0B021A" />
      </radialGradient>

      {/* Star Glow Filters */}
      <filter id="gx-glow-soft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="gx-glow-intense" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="glow1" />
        <feGaussianBlur stdDeviation="1.5" result="glow2" />
        <feMerge>
          <feMergeNode in="glow1" />
          <feMergeNode in="glow2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Clip Paths */}
      <clipPath id="gx-body-clip">
        <rect x="6" y="28" width="88" height="60" rx="6" />
      </clipPath>

      <clipPath id="gx-lid-clip">
        <path d="M 7,28 H 93 C 96.5,28 96.5,21 93,21 L 7,21 C 3.5,21 3.5,28 7,28 Z" />
      </clipPath>
    </defs>

    {/* Ambient Deep Space Shadow / Nebula Reflection on Floor */}
    <ellipse cx="50" cy="94" rx="42" ry="5.5" fill="#000000" fillOpacity={0.35} />
    <ellipse
      cx="50"
      cy="94"
      rx="34"
      ry="4.5"
      fill="#7C3AED"
      fillOpacity={0.25}
      filter="url(#gx-glow-soft)"
    />

    {/* OPEN STATE: INTERIOR COSMIC PORTAL CAVITY */}
    {isOpen && (
      <g>
        {/* Dark Infinite Cavity */}
        <ellipse cx="50" cy="30" rx="42" ry="9" fill="#05010D" />
        <ellipse cx="50" cy="30" rx="40" ry="7.5" fill="url(#gx-cavity-glow)" />

        {/* Upward Cosmic Energy Rays from inside box */}
        <path d="M 30,30 L 18,6 L 36,29 Z" fill="url(#gx-nebula-cyan)" opacity={0.45} />
        <path d="M 50,30 L 48,0 L 54,29 Z" fill="url(#gx-nebula-magenta)" opacity={0.55} />
        <path d="M 70,30 L 82,6 L 64,29 Z" fill="url(#gx-nebula-cyan)" opacity={0.45} />

        {/* Inner Accretion Swirl Ring inside opening */}
        <ellipse
          cx="50"
          cy="30"
          rx="32"
          ry="5.5"
          fill="none"
          stroke="url(#gx-ring)"
          strokeWidth="1.2"
          strokeDasharray="6 3 2 3"
          opacity={0.8}
          filter="url(#gx-glow-soft)"
        />

        {/* Starlight floating up */}
        <circle cx="28" cy="18" r="1" fill="#FFF" filter="url(#gx-glow-soft)" />
        <circle cx="45" cy="10" r="1.3" fill="#67E8F9" filter="url(#gx-glow-soft)" />
        <circle cx="56" cy="14" r="0.9" fill="#38BDF8" filter="url(#gx-glow-soft)" />
        <circle cx="72" cy="19" r="1.1" fill="#F472B6" filter="url(#gx-glow-soft)" />
      </g>
    )}

    {/* BOX BODY */}
    <g>
      {/* Body Base Background */}
      <rect x="6" y="28" width="88" height="60" rx="6" fill="url(#gx-body-bg)" />

      {/* Clipped Cosmic Elements inside Body */}
      <g clipPath="url(#gx-body-clip)">
        {/* Glowing Nebula Clouds */}
        <ellipse cx="32" cy="46" rx="36" ry="24" fill="url(#gx-nebula-magenta)" />
        <ellipse cx="68" cy="66" rx="34" ry="26" fill="url(#gx-nebula-cyan)" />
        <ellipse cx="50" cy="38" rx="28" ry="18" fill="url(#gx-nebula-violet)" />
        <ellipse cx="48" cy="74" rx="26" ry="14" fill="url(#gx-nebula-magenta)" opacity={0.4} />

        {/* Subtle Cosmic Dust Veil */}
        <path
          d="M 4,40 Q 30,55 50,48 T 96,65"
          stroke="url(#gx-ring)"
          strokeWidth="8"
          fill="none"
          opacity={0.12}
          filter="url(#gx-glow-soft)"
        />

        {/* Cat Constellation (Ursa Feline) in Glowing Cyan Starlight */}
        <g opacity={0.75}>
          {/* Constellation lines */}
          <polyline
            points="20,40 24,34 30,37 36,34 40,40 30,44 20,40"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="0.5"
            strokeDasharray="1.5 1"
            opacity={0.7}
          />
          <line
            x1="24"
            y1="34"
            x2="30"
            y2="44"
            stroke="#7DD3FC"
            strokeWidth="0.4"
            strokeDasharray="1 1"
            opacity={0.5}
          />
          <line
            x1="36"
            y1="34"
            x2="30"
            y2="44"
            stroke="#7DD3FC"
            strokeWidth="0.4"
            strokeDasharray="1 1"
            opacity={0.5}
          />
          {/* Constellation star nodes */}
          <circle cx="20" cy="40" r="1" fill="#FFFFFF" filter="url(#gx-glow-soft)" />
          <circle cx="24" cy="34" r="1.3" fill="#BAE6FD" filter="url(#gx-glow-soft)" />
          <circle cx="30" cy="37" r="0.9" fill="#FFFFFF" />
          <circle cx="36" cy="34" r="1.3" fill="#BAE6FD" filter="url(#gx-glow-soft)" />
          <circle cx="40" cy="40" r="1" fill="#FFFFFF" filter="url(#gx-glow-soft)" />
          <circle cx="30" cy="44" r="1.2" fill="#67E8F9" filter="url(#gx-glow-soft)" />
        </g>

        {/* Cosmic Orbiting Rings (Tilted like Saturn / Quantum Orbital) */}
        <g transform="translate(52, 60) rotate(-14)">
          {/* Outer glowing dust ring */}
          <ellipse
            cx="0"
            cy="0"
            rx="33"
            ry="11"
            fill="none"
            stroke="url(#gx-ring)"
            strokeWidth="1.6"
            opacity={0.85}
            filter="url(#gx-glow-soft)"
            strokeDasharray="40 3 15 2 6 2"
          />
          {/* Inner fine orbit ring */}
          <ellipse
            cx="0"
            cy="0"
            rx="27"
            ry="8.5"
            fill="none"
            stroke="#E0E7FF"
            strokeWidth="0.6"
            opacity={0.6}
          />

          {/* Orbiting Quantum Moon / Violet Pearl */}
          <g transform="translate(26, 4)">
            <circle cx="0" cy="0" r="3.2" fill="#F472B6" />
            <circle cx="0" cy="0" r="2.4" fill="#C084FC" />
            <circle cx="-0.8" cy="-0.8" r="0.9" fill="#FFFFFF" />
            {/* Mini moon ring */}
            <ellipse
              cx="0"
              cy="0"
              rx="4.5"
              ry="1.5"
              fill="none"
              stroke="#67E8F9"
              strokeWidth="0.6"
              opacity={0.9}
            />
          </g>

          {/* Orbiting Cyan Sparkle Satellite */}
          <g transform="translate(-24, -3)">
            <circle cx="0" cy="0" r="1.6" fill="#38BDF8" filter="url(#gx-glow-soft)" />
            <circle cx="0" cy="0" r="0.8" fill="#FFFFFF" />
          </g>
        </g>

        {/* Swirling Galaxy Spiral Arms */}
        <g transform="translate(52, 60)">
          {/* Spiral Arm 1 */}
          <path
            d="M 0,0 C 8,-2 16,-8 18,-16 C 19,-22 15,-28 8,-31 C 0,-34 -12,-32 -20,-24"
            fill="none"
            stroke="url(#gx-nebula-magenta)"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity={0.7}
            filter="url(#gx-glow-soft)"
          />
          <path
            d="M 0,0 C 8,-2 16,-8 18,-16 C 19,-22 15,-28 8,-31"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.85}
          />

          {/* Spiral Arm 2 */}
          <path
            d="M 0,0 C -8,2 -16,8 -18,16 C -19,22 -15,28 -8,31 C 0,34 12,32 20,24"
            fill="none"
            stroke="url(#gx-nebula-cyan)"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity={0.7}
            filter="url(#gx-glow-soft)"
          />
          <path
            d="M 0,0 C -8,2 -16,8 -18,16 C -19,22 -15,28 -8,31"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.85}
          />

          {/* Core Singularity Glow & Event Horizon */}
          <circle cx="0" cy="0" r="12" fill="url(#gx-core)" />
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" filter="url(#gx-glow-intense)" />
          <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />

          {/* Radiant 8-Point Starlight Core Flare */}
          <path
            d="M -16,0 Q 0,0 0,-16 Q 0,0 16,0 Q 0,0 0,16 Q 0,0 -16,0 Z"
            fill="#FFFFFF"
            opacity={0.9}
            filter="url(#gx-glow-soft)"
          />
          <path
            d="M -9,-9 Q 0,0 9,-9 Q 0,0 9,9 Q 0,0 -9,9 Q 0,0 -9,-9 Z"
            fill="#67E8F9"
            opacity={0.75}
          />
        </g>

        {/* Sparkling Stars Field (Curated Celestial Diamonds) */}
        {/* 4-point Diamond Star (Top Left) */}
        <g transform="translate(15, 66)">
          <path
            d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z"
            fill="#FFFFFF"
            filter="url(#gx-glow-soft)"
          />
          <circle cx="0" cy="0" r="0.8" fill="#67E8F9" />
        </g>

        {/* 4-point Diamond Star (Top Right) */}
        <g transform="translate(82, 42)">
          <path
            d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z"
            fill="#FFFFFF"
            filter="url(#gx-glow-soft)"
          />
          <circle cx="0" cy="0" r="1" fill="#BAE6FD" />
        </g>

        {/* 4-point Diamond Star (Bottom Center-Right) */}
        <g transform="translate(76, 78)">
          <path
            d="M 0,-3.5 Q 0,0 3.5,0 Q 0,0 0,3.5 Q 0,0 -3.5,0 Q 0,0 0,-3.5 Z"
            fill="#FFFFFF"
            filter="url(#gx-glow-soft)"
          />
          <circle cx="0" cy="0" r="0.7" fill="#F472B6" />
        </g>

        {/* Micro Sparkles & Stars */}
        <circle cx="12" cy="52" r="0.7" fill="#FFF" opacity={0.8} />
        <circle cx="16" cy="80" r="0.9" fill="#BAE6FD" opacity={0.9} />
        <circle cx="25" cy="74" r="0.6" fill="#38BDF8" opacity={0.7} />
        <circle cx="34" cy="82" r="0.8" fill="#FFF" opacity={0.85} />
        <circle cx="48" cy="83" r="0.5" fill="#C084FC" opacity={0.7} />
        <circle cx="62" cy="79" r="0.7" fill="#FFF" opacity={0.8} />
        <circle cx="86" cy="62" r="0.8" fill="#67E8F9" opacity={0.85} />
        <circle cx="78" cy="35" r="0.6" fill="#FFF" opacity={0.7} />
        <circle cx="67" cy="36" r="0.9" fill="#38BDF8" opacity={0.9} />
        <circle cx="58" cy="42" r="0.5" fill="#F472B6" opacity={0.8} />
        <circle cx="46" cy="35" r="0.8" fill="#FFF" opacity={0.9} />
      </g>

      {/* PURE COSMIC STARLIGHT BORDER (Zero Gold) */}
      <rect
        x="6"
        y="28"
        width="88"
        height="60"
        rx="6"
        fill="none"
        stroke="url(#gx-starlight-border)"
        strokeWidth="1.4"
      />
      {/* Inner Fine Starlight Inset */}
      <rect
        x="8.5"
        y="30.5"
        width="83"
        height="55"
        rx="4.5"
        fill="none"
        stroke="#67E8F9"
        strokeWidth="0.5"
        opacity={0.5}
        strokeDasharray="30 4 8 4"
      />
    </g>

    {/* BOX LID (ANIMATED LIFT) */}
    <g
      className={cn(
        "transition-transform duration-300",
        !isOpen && "group-hover:-translate-y-1",
        isOpen && "-translate-y-4"
      )}
    >
      {/* Lid Drop Shadow when lifted */}
      {isOpen && (
        <ellipse
          cx="50"
          cy="30"
          rx="44"
          ry="4"
          fill="#000000"
          fillOpacity={0.4}
          filter="url(#gx-glow-soft)"
        />
      )}

      {/* Lid Base Structure */}
      <path
        d="M 7,28 H 93 C 96.5,28 96.5,21 93,21 L 7,21 C 3.5,21 3.5,28 7,28 Z"
        fill="url(#gx-lid-bg)"
        stroke="url(#gx-starlight-border)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* Lid Clipped Cosmic Dust */}
      <g clipPath="url(#gx-lid-clip)">
        <ellipse cx="28" cy="24.5" rx="20" ry="6" fill="url(#gx-nebula-magenta)" opacity={0.8} />
        <ellipse cx="72" cy="24.5" rx="22" ry="6" fill="url(#gx-nebula-cyan)" opacity={0.8} />
        {/* Lid stardust sparkles */}
        <circle cx="18" cy="24.5" r="0.6" fill="#FFF" />
        <circle cx="24" cy="23" r="0.9" fill="#67E8F9" />
        <circle cx="76" cy="23" r="0.8" fill="#FFF" />
        <circle cx="82" cy="25" r="0.6" fill="#BAE6FD" />
        <line x1="8" y1="22" x2="92" y2="22" stroke="#FFF" strokeWidth="0.5" opacity={0.4} />
      </g>

      {/* Starlight Center Medallion on Lid (Silver & Cyan Starlight, Zero Gold) */}
      <g transform="translate(50, 24.5)">
        {/* Starlight Crescent Moon */}
        <path
          d="M -3,-3.8 C -0.8,-3.8 1,-2 1,0 C 1,2 -0.8,3.8 -3,3.8 C -1.2,2.8 -0.2,1.5 -0.2,0 C -0.2,-1.5 -1.2,-2.8 -3,-3.8 Z"
          fill="url(#gx-starlight-bright)"
        />
        {/* Radiant Astral 4-Point Star */}
        <path
          d="M 2.5,-3 Q 2.5,0 5.5,0 Q 2.5,0 2.5,3 Q 2.5,0 -0.5,0 Q 2.5,0 2.5,-3 Z"
          fill="#FFFFFF"
          filter="url(#gx-glow-soft)"
        />
        <circle cx="2.5" cy="0" r="0.7" fill="#67E8F9" />
        {/* Flanking Starlight Dots */}
        <circle cx="-9" cy="0" r="0.7" fill="#C084FC" opacity="0.8" />
        <circle cx="-13" cy="0" r="0.5" fill="#67E8F9" opacity="0.7" />
        <circle cx="9" cy="0" r="0.7" fill="#C084FC" opacity="0.8" />
        <circle cx="13" cy="0" r="0.5" fill="#67E8F9" opacity="0.7" />
      </g>

      {/* Outer Lid Rim Starlight Highlights */}
      <line x1="10" y1="27.5" x2="90" y2="27.5" stroke="url(#gx-starlight-border)" strokeWidth="0.8" />
    </g>
  </svg>
);