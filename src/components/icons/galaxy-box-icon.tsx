
import { cn } from '@/lib/utils';

export const GalaxyBoxIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={cn(className)}
    >
        <defs>
            <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#3B0764', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad2)" />
        <circle cx="30" cy="30" r="2" fill="white" />
        <circle cx="70" cy="70" r="2" fill="white" />
        <circle cx="50" cy="50" r="3" fill="white" />
        <circle cx="20" cy="80" r="1" fill="white" />
        <circle cx="80" cy="20" r="1" fill="white" />
    </svg>
);
