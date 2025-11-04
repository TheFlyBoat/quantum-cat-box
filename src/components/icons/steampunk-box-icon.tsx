
import { cn } from '@/lib/utils';

export const SteampunkBoxIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={cn(className)}
    >
        <rect width="100" height="100" fill="#A16207" />
        <rect x="5" y="5" width="90" height="90" fill="#B45309" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#F59E0B" strokeWidth="5" />
        <line x1="50" y1="30" x2="50" y2="70" stroke="#F59E0B" strokeWidth="2" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="30" cy="30" r="5" fill="#F59E0B" />
        <circle cx="70" cy="30" r="5" fill="#F59E0B" />
        <circle cx="30" cy="70" r="5" fill="#F59E0B" />
        <circle cx="70" cy="70" r="5" fill="#F59E0B" />
    </svg>
);
