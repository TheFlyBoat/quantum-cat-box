
import { cn } from '@/lib/utils';

export const PlushBoxIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={cn(className)}
    >
        <rect width="100" height="100" fill="#FBCFE8" rx="15" ry="15" />
        <rect x="10" y="10" width="80" height="80" fill="#F9A8D4" rx="10" ry="10" />
        <line x1="30" y1="30" x2="70" y2="70" stroke="#F472B6" strokeWidth="5" strokeLinecap="round" />
        <line x1="70" y1="30" x2="30" y2="70" stroke="#F472B6" strokeWidth="5" strokeLinecap="round" />
    </svg>
);
