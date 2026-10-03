import React from "react";
import { cn } from "@/lib/utils";

export const StoneBoxIcon = ({ className, isOpen }: { className?: string; isOpen?: boolean }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <defs>
      {/* Stone box lid clip: preserves the stone box lid outline */}
      <clipPath id="stone-lid-clip">
        <path d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z" />
      </clipPath>

      {/* Stone box body clip: preserves the stone box rounded body rectangle */}
      <clipPath id="stone-body-clip">
        <rect x="5" y="28" width="90" height="60" rx="5" />
      </clipPath>
    </defs>

    {/* Shadow at bottom: exact stone box format & size */}
    <ellipse cx="50" cy="94" rx="40" ry="5" fill="#000000" fillOpacity={0.2} />

    {/* Lid with animated lift on hover and opening */}
    <g className={cn("transition-transform duration-300", !isOpen && "group-hover:-translate-y-1", isOpen && "-translate-y-4")}>
      <path d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z" fill="#2B3F69" />
      <g clipPath="url(#stone-lid-clip)">
        <image
          href="/mosaic_box_lid.svg"
          x="4"
          y="21"
          width="92"
          height="7.2"
          preserveAspectRatio="none"
        />
      </g>
      <path
        d="M 8,28 H 92 C 96,28 96,22 92,22 L 8,22 C 4,22 4,28 8,28 Z"
        fill="none"
        stroke="#1B3174"
        strokeWidth="0.8"
      />
    </g>

    {/* Body */}
    <g>
      <rect x="5" y="28" width="90" height="60" rx="5" fill="#2B3F69" />
      <g clipPath="url(#stone-body-clip)">
        <image
          href="/mosaic_box_body.svg"
          x="5"
          y="28"
          width="90"
          height="60"
          preserveAspectRatio="none"
        />
      </g>
      <rect
        x="5"
        y="28"
        width="90"
        height="60"
        rx="5"
        fill="none"
        stroke="#1B3174"
        strokeWidth="0.8"
      />
    </g>
  </svg>
);

export const MosaicBoxIcon = StoneBoxIcon;
