
import { cn } from '@/lib/utils';

export const CircuitBoardBoxIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={cn(className)}
    >
        <rect width="100" height="100" fill="#003300" />
        <line x1="10" y1="10" x2="90" y2="10" stroke="#00ff00" strokeWidth="2" />
        <line x1="10" y1="90" x2="90" y2="90" stroke="#00ff00" strokeWidth="2" />
        <line x1="10" y1="10" x2="10" y2="90" stroke="#00ff00" strokeWidth="2" />
        <line x1="90" y1="10" x2="90" y2="90" stroke="#00ff00" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" fill="#00ff00" />
        <circle cx="80" cy="20" r="5" fill="#00ff00" />
        <circle cx="20" cy="80" r="5" fill="#00ff00" />
        <circle cx="80" cy="80" r="5" fill="#00ff00" />
        <line x1="20" y1="20" x2="80" y2="80" stroke="#00ff00" strokeWidth="1" />
        <line x1="80" y1="20" x2="20" y2="80" stroke="#00ff00" strokeWidth="1" />
    </svg>
);
