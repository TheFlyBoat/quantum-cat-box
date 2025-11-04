
import { cn } from '@/lib/utils';

export const CrystalBoxIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={cn(className)}
    >
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#E0E7FF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#C7D2FE', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad1)" />
        <polygon points="50,10 90,50 50,90 10,50" fill="#A5B4FC" />
        <polygon points="50,10 90,50 50,90 10,50" stroke="#818CF8" strokeWidth="2" fill="none" />
    </svg>
);
