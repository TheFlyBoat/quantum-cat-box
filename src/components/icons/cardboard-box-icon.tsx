
import React from "react";
import { cn } from "@/lib/utils";

export const CardboardBoxIcon = ({ className, isOpen }: { className?: string; isOpen?: boolean }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <defs>
      {/* Cardboard Body Gradient */}
      <linearGradient id="cb-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#EBC899" />
        <stop offset="30%" stopColor="#DEB782" />
        <stop offset="85%" stopColor="#C2935B" />
        <stop offset="100%" stopColor="#A67742" />
      </linearGradient>

      {/* Cardboard Inner Cavity */}
      <linearGradient id="cb-inside" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#381D08" />
        <stop offset="40%" stopColor="#542E10" />
        <stop offset="100%" stopColor="#703F18" />
      </linearGradient>

      {/* Flap Gradients */}
      <linearGradient id="cb-flap-back" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F2D7B1" />
        <stop offset="100%" stopColor="#CB9F68" />
      </linearGradient>

      <linearGradient id="cb-flap-side" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DEB782" />
        <stop offset="100%" stopColor="#B5864E" />
      </linearGradient>

      {/* Tape Gradients */}
      <linearGradient id="cb-tape" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E4BF88" stopOpacity={0.9} />
        <stop offset="50%" stopColor="#FFF3DC" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#DCB478" stopOpacity={0.9} />
      </linearGradient>

      <linearGradient id="cb-tape-v" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D9AE71" stopOpacity={0.85} />
        <stop offset="40%" stopColor="#FFF0D4" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#CFA163" stopOpacity={0.85} />
      </linearGradient>

      {/* Subtle Corrugation Flutes Pattern */}
      <pattern id="cb-flutes" width="3.5" height="4" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#8C5C2E" strokeWidth="0.5" strokeOpacity={0.13} />
      </pattern>

      {/* Drop Shadow Filter */}
      <filter id="cb-shadow" x="-8%" y="-8%" width="116%" height="116%">
        <feDropShadow dx="0.5" dy="1.2" stdDeviation="0.8" floodColor="#4A260B" floodOpacity={0.22} />
      </filter>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="50" cy="94" rx="42" ry="5.5" fill="#000000" fillOpacity={0.18} />

    {/* Inside Dark Cavity (visible when open) */}
    {isOpen && (
      <g>
        <path d="M 9,32 L 91,32 L 87,58 L 13,58 Z" fill="url(#cb-inside)" />
        <line x1="13" y1="32" x2="87" y2="32" stroke="#2B1404" strokeWidth="1.5" />
      </g>
    )}

    {/* Box Body */}
    <g>
      <rect x="7" y="32" width="86" height="58" rx="4" fill="url(#cb-body)" stroke="#704118" strokeWidth="1.3" />
      {/* Corrugation Texture */}
      <rect x="7" y="32" width="86" height="58" rx="4" fill="url(#cb-flutes)" />

      {/* 3D Edge Bevels */}
      <line x1="8" y1="34" x2="8" y2="88" stroke="#FFF0D4" strokeWidth="0.9" strokeOpacity={0.6} />
      <line x1="92" y1="34" x2="92" y2="88" stroke="#704118" strokeWidth="1" strokeOpacity={0.6} />
      <path d="M 9,86 L 91,86 L 89,89.5 L 11,89.5 Z" fill="#5E3512" fillOpacity={0.18} />

      {/* Vertical Center Packing Tape */}
      <rect x="46" y="32" width="8" height="58" fill="url(#cb-tape-v)" stroke="#B88A52" strokeWidth="0.4" filter="url(#cb-shadow)" />
      <line x1="50" y1="32" x2="50" y2="90" stroke="#704118" strokeWidth="0.5" strokeDasharray="1.5 1" strokeOpacity="0.4" />

      {/* Delivery Shipping Label (Left) */}
      <g transform="translate(12, 43) rotate(-3)" filter="url(#cb-shadow)">
        <rect x="0" y="0" width="27" height="34" rx="1.8" fill="#FFFCF5" stroke="#DFD0BC" strokeWidth="0.5" />
        {/* Orange header bar */}
        <rect x="0" y="0" width="27" height="6.5" rx="1.8" fill="#D14002" />
        <text x="13.5" y="4.8" textAnchor="middle" fontFamily="'Nunito', sans-serif" fontWeight="900" fontSize="3.5" fill="#FFFFFF" letterSpacing="0.3">CAT EXPRESS</text>
        
        {/* Cute Cat Paw Print */}
        <ellipse cx="7.5" cy="13" rx="2.2" ry="1.8" fill="#FF809F" />
        <circle cx="4.8" cy="9.2" r="0.8" fill="#FF809F" />
        <circle cx="7.5" cy="8.3" r="0.8" fill="#FF809F" />
        <circle cx="10.2" cy="9.2" r="0.8" fill="#FF809F" />

        {/* Address Lines */}
        <line x1="13" y1="10.5" x2="24" y2="10.5" stroke="#8C7660" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="13" y1="13.5" x2="22" y2="13.5" stroke="#8C7660" strokeWidth="0.9" strokeLinecap="round" />
        
        <line x1="2" y1="18" x2="25" y2="18" stroke="#E5D9C8" strokeWidth="0.6" />

        {/* Barcode */}
        <rect x="3" y="20" width="1.2" height="9.5" fill="#241508" />
        <rect x="5.5" y="20" width="0.6" height="9.5" fill="#241508" />
        <rect x="7" y="20" width="2" height="9.5" fill="#241508" />
        <rect x="10.2" y="20" width="0.8" height="9.5" fill="#241508" />
        <rect x="12" y="20" width="1.5" height="9.5" fill="#241508" />
        <rect x="14.5" y="20" width="0.6" height="9.5" fill="#241508" />
        <rect x="16.5" y="20" width="2.2" height="9.5" fill="#241508" />
        <rect x="19.8" y="20" width="0.8" height="9.5" fill="#241508" />
        <rect x="21.8" y="20" width="1.6" height="9.5" fill="#241508" />
        
        <text x="13.5" y="32" textAnchor="middle" fontFamily="monospace" fontSize="2.2" fontWeight="bold" fill="#665544">QC-CAT-BOX</text>
      </g>

      {/* Red 'FRAGILE / PURR INSIDE' Stamp (Right) */}
      <g transform="translate(61, 45) rotate(4)" filter="url(#cb-shadow)">
        <rect x="0" y="0" width="25" height="16" rx="2" fill="#C0392B" fillOpacity={0.08} stroke="#B83220" strokeWidth="1.2" strokeDasharray="100" strokeOpacity={0.85} />
        
        {/* Cute Cat Head Silhouette */}
        <path d="M 4,9.5 L 6.5,4.5 L 8.5,9.5 Z" fill="#B83220" opacity={0.85} />
        <path d="M 9.5,9.5 L 11.5,4.5 L 14,9.5 Z" fill="#B83220" opacity={0.85} />
        <circle cx="9" cy="9.8" r="3.2" fill="#B83220" opacity={0.85} />
        
        <text x="18.5" y="8" textAnchor="middle" fontFamily="'Nunito', sans-serif" fontWeight="900" fontSize="3.2" fill="#B83220" letterSpacing="0.3">FRAGILE</text>
        <text x="18.5" y="12.2" textAnchor="middle" fontFamily="'Nunito', sans-serif" fontWeight="800" fontSize="2.3" fill="#B83220">PURR INSIDE</text>
      </g>

      {/* 'THIS WAY UP' Arrows (Right bottom) */}
      <g transform="translate(68, 67)" stroke="#704118" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
        <line x1="4" y1="12" x2="4" y2="3.5" />
        <polyline points="1,6.5 4,2.5 7,6.5" />
        <line x1="12" y1="12" x2="12" y2="3.5" />
        <polyline points="9,6.5 12,2.5 15,6.5" />
        <line x1="0" y1="14" x2="16" y2="14" strokeWidth="1.5" />
      </g>
    </g>

    {/* Flaps / Lid */}
    {isOpen ? (
      /* OPEN FLAPS (Lifted backdrop for cat) */
      <g className={cn("transition-transform duration-300", isOpen && "-translate-y-4")}>
        {/* Back Wide Flap standing up */}
        <polygon points="12,32 88,32 84,14 16,14" fill="url(#cb-flap-back)" stroke="#704118" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Tape remnant on back flap */}
        <polygon points="46,32 54,32 53.5,14 46.5,14" fill="url(#cb-tape)" opacity={0.8} />
        <line x1="16" y1="15.5" x2="84" y2="15.5" stroke="#FFE9CA" strokeWidth="0.8" strokeOpacity={0.7} />

        {/* Left Flap angling outward */}
        <polygon points="7,32 7,37 -6,27 -4,18" fill="url(#cb-flap-side)" stroke="#704118" strokeWidth="1.2" strokeLinejoin="round" />
        <line x1="-3" y1="19.5" x2="6" y2="33" stroke="#FFE9CA" strokeWidth="0.8" strokeOpacity={0.6} />

        {/* Right Flap angling outward */}
        <polygon points="93,32 93,37 106,27 104,18" fill="url(#cb-flap-side)" stroke="#704118" strokeWidth="1.2" strokeLinejoin="round" />
        <line x1="103" y1="19.5" x2="94" y2="33" stroke="#FFE9CA" strokeWidth="0.8" strokeOpacity={0.6} />

        {/* Front Flap folded down over box lip */}
        <polygon points="9,32 91,32 87,38.5 13,38.5" fill="url(#cb-flap-back)" stroke="#704118" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Front flap center tape tab */}
        <polygon points="46,32 54,32 53,38.5 47,38.5" fill="url(#cb-tape)" />
        <line x1="10" y1="32.5" x2="90" y2="32.5" stroke="#FFF2DB" strokeWidth="0.9" strokeOpacity={0.8} />
      </g>
    ) : (
      /* CLOSED FLAPS (Interactive Hover Lift Group) */
      <g className={cn("transition-transform duration-300", !isOpen && "group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
        {/* Back shadow under closed flaps */}
        <rect x="6" y="24" width="88" height="9" rx="3" fill="#5E3512" opacity={0.25} />

        {/* Main Top Closed Flaps */}
        <path d="M 8,22 H 92 C 95.5,22 95.5,31 92,31 L 8,31 C 4.5,31 4.5,22 8,22 Z" fill="url(#cb-flap-back)" stroke="#704118" strokeWidth="1.4" strokeLinejoin="round" />
        
        {/* Top edge highlight */}
        <path d="M 9,23.5 H 91" stroke="#FFF1DA" strokeWidth="1" strokeLinecap="round" strokeOpacity={0.85} />

        {/* Center Fold Seam between Left & Right flaps */}
        <line x1="50" y1="22" x2="50" y2="31" stroke="#542E10" strokeWidth="1.3" />

        {/* Horizontal Packing Tape strip sealing the closed top */}
        <rect x="4" y="24.8" width="92" height="4.8" fill="url(#cb-tape)" stroke="#B88A52" strokeWidth="0.4" filter="url(#cb-shadow)" />
        {/* Tape center perforation / shine line */}
        <line x1="4" y1="27.2" x2="96" y2="27.2" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="3 1.5" strokeOpacity={0.75} />
        
        {/* Front overhang tape tab */}
        <path d="M 46,29.5 H 54 V 35.5 C 54,36.5 46,36.5 46,35.5 Z" fill="url(#cb-tape)" stroke="#B88A52" strokeWidth="0.4" filter="url(#cb-shadow)" />
      </g>
    )}
  </svg>
);
