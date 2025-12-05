import type { StaticImageData } from 'next/image';

import tardisBox from '@/assets/box-skin/tardis_box.svg';
import tardisLid from '@/assets/box-skin/tardis_lid.svg';
import { cn } from '@/lib/utils';

const toSrc = (asset: StaticImageData | string) =>
  typeof asset === 'string' ? asset : asset.src;

type TardisBoxIconProps = {
  className?: string;
  isOpen?: boolean;
};

/**
 * Renders the TARDIS-inspired Quantum Box skin using the provided SVG assets.
 * The lid is separated so it can animate upwards when the box opens.
 */
export const TardisBoxIcon = ({ className, isOpen }: TardisBoxIconProps) => {
  const lidSrc = toSrc(tardisLid);
  const boxSrc = toSrc(tardisBox);

  return (
    <svg
      viewBox="0 0 1572 985"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={cn('h-full w-full', className)}
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="30" stdDeviation="30" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>
      <g style={{ filter: 'url(#shadow)' }}>
        <g transform="translate(0, 40)">
          <image
            href={boxSrc}
            width="1572"
            height="985"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
      <g
        className={cn(
          'transition-transform duration-500 ease-out origin-bottom',
          isOpen ? '-translate-y-[520px]' : '-translate-y-[220px]',
          !isOpen && 'group-hover:-translate-y-14'
        )}
      >
        <image
          href={lidSrc}
          width="1572"
          height="417"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </svg>
  );
};
