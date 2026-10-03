import React from 'react';
import { cn } from '@/lib/utils';

export const PlushBoxIcon = ({
  className,
  isOpen,
}: {
  className?: string;
  isOpen?: boolean;
}) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('overflow-visible', className)}
  >
    {/* Base shadow */}
    <ellipse cx="50" cy="94" rx="42" ry="5.5" fill="#000000" fillOpacity={0.2} />

    {/* Interior cavity when open */}
    {isOpen && (
      <g>
        <ellipse cx="50" cy="28.5" rx="41" ry="6.5" fill="#1E293B" />
        <ellipse cx="50" cy="28.5" rx="38" ry="5" fill="#0F172A" />
      </g>
    )}

    {/* Box Body: maps x: 124..1130 to 5..95, y: 343..904 to 28..88 */}
    <g transform="translate(5, 28) scale(0.089463, 0.10695) translate(-124, -343)">
      <path d="M0,0 L283,0 L284,173 L328,174 L329,368 L566,369 L566,561 L215,561 L215,369 L90,369 L90,173 L0,173 Z " fill="#FB393B" transform="translate(344,343)" />
      <path d="M0,0 L176,0 L176,173 L266,173 L266,369 L391,369 L391,561 L0,561 L0,560 L176,560 L176,369 L-44,369 L-44,43 L-42,34 L-35,20 L-24,9 L-14,3 Z " fill="#1B8FFD" transform="translate(168,343)" />
      <path d="M0,0 L176,0 L176,173 L-43,173 L-43,368 L176,368 L176,369 L-44,369 L-44,43 L-42,34 L-35,20 L-24,9 L-14,3 Z " fill="#45CD74" transform="translate(168,343)" />
      <path d="M0,0 L10,2 L80,3 L80,4 L-1,4 Z " fill="#E84342" transform="translate(346,512)" />
      <path d="M0,0 L283,0 L283,369 L46,369 L45,368 L45,174 L1,174 L0,173 Z " fill="#1B8FFD" transform="translate(627,343)" />
      <path d="M0,0 L182,0 L198,8 L208,16 L216,28 L220,40 L220,173 L0,173 Z " fill="#FDE126" transform="translate(910,343)" />
      <path d="M0,0 L182,0 L198,8 L208,16 L216,28 L220,40 L220,369 L0,369 Z " fill="#FB3A3B" transform="translate(910,343)" />
      <path d="M0,0 L194,0 L238,1 L239,196 L0,196 Z " fill="#FDE026" transform="translate(434,516)" />
      <path d="M0,0 L282,0 L282,196 L45,196 L44,195 L44,1 L0,1 Z " fill="#45CD72" transform="translate(628,516)" />
      <path d="M0,0 L1,0 L1,196 L126,196 L126,388 L-265,388 L-265,387 L-89,387 L-89,196 L0,196 Z " fill="#46CE73" transform="translate(433,516)" />
      <path d="M0,0 L220,0 L220,191 L39,191 L28,187 L18,180 L9,170 L5,163 L1,150 L0,145 Z " fill="#FDE127" transform="translate(124,712)" />
      <path d="M0,0 L351,0 L351,192 L0,192 Z " fill="#FB3A3C" transform="translate(559,712)" />
      <path d="M0,0 L220,0 L220,146 L216,161 L210,172 L205,178 L197,184 L185,190 L177,192 L0,192 Z " fill="#1C8FFD" transform="translate(910,712)" />
    </g>

    {/* Box Lid: maps x: 125..1130 to 4..96, y: 256..335 to 21..28 */}
    <g
      className={cn(
        'transition-transform duration-300',
        !isOpen && 'group-hover:-translate-y-1',
        isOpen && '-translate-y-4'
      )}
    >
      <g transform="translate(4, 21) scale(0.0915, 0.0886) translate(-125, -256)">
        <path d="M0,0 L144,0 L144,79 L0,79 L-10,75 L-18,68 L-23,60 L-26,51 L-26,30 L-24,21 L-18,12 L-9,4 Z " fill="#FB3B3C" transform="translate(151,257)" />
        <path d="M0,0 L6,0 L6,3 L3,4 L0,2 Z " fill="#F84144" transform="translate(289,257)" />
        <path d="M0,0 L440,0 L440,79 L0,79 Z " fill="#1C90FD" transform="translate(296,257)" />
        <path d="M0,0 L214,0 L214,79 L0,79 Z " fill="#45CE73" transform="translate(522,257)" />
        <path d="M0,0 L1,0 L1,77 L212,77 L212,0 L214,0 L214,79 L0,79 Z " fill="#4ACE81" transform="translate(522,257)" />
        <path d="M0,0 L227,0 L227,79 L0,79 Z " fill="#FDE128" transform="translate(736,257)" />
        <path d="M0,0 L137,0 L148,4 L154,8 L161,15 L166,25 L167,31 L167,50 L162,62 L156,70 L151,74 L146,77 L141,79 L0,79 Z " fill="#1D90FD" transform="translate(963,256)" />
      </g>
    </g>
  </svg>
);

export const ColorBlocksBoxIcon = PlushBoxIcon;