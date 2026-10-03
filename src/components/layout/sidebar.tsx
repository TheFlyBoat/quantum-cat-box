
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cat, Award, BoxIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playFeedback } from '@/lib/audio';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
    { href: '/home', icon: Home, label: 'Home', hoverColorClass: 'hover:text-[#3696C9]', activeColorClass: 'text-[#3696C9]' },
    { href: '/gallery', icon: Cat, label: 'Gallery', hoverColorClass: 'hover:text-[#A240FF]', activeColorClass: 'text-[#A240FF]' },
    { href: '/awards', icon: Award, label: 'Awards', hoverColorClass: 'hover:text-[#FF809F]', activeColorClass: 'text-[#FF809F]' },
    { href: '/customize', icon: BoxIcon, label: 'Customise', hoverColorClass: 'hover:text-[#D14002]', activeColorClass: 'text-[#D14002]' },
    { href: '/settings', icon: Settings, label: 'Settings', hoverColorClass: 'hover:text-[#A9DB4A]', activeColorClass: 'text-[#A9DB4A]' },
];

const TRIPLE_CLICK_WINDOW_MS = 800;

type FloatingMenuProps = {
    onSecretCustomizeClick?: () => void;
};

export function FloatingMenu({ onSecretCustomizeClick }: FloatingMenuProps) {
    const pathname = usePathname();
    const customizeClickRef = React.useRef<{ count: number; lastClickTs: number }>({ count: 0, lastClickTs: 0 });

    const handleCustomizeClick = React.useCallback(() => {
        const now = Date.now();
        const { count, lastClickTs } = customizeClickRef.current;

        const withinWindow = now - lastClickTs <= TRIPLE_CLICK_WINDOW_MS;
        const nextCount = withinWindow ? count + 1 : 1;

        if (nextCount >= 3) {
            customizeClickRef.current = { count: 0, lastClickTs: 0 };
            onSecretCustomizeClick?.();
        } else {
            customizeClickRef.current = { count: nextCount, lastClickTs: now };
        }
    }, [onSecretCustomizeClick]);

    return (
        <div className="mt-auto w-full">
            <TooltipProvider delayDuration={100}>
                <nav className="flex w-full items-center justify-evenly py-3">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Tooltip key={item.label}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        onClick={() => {
                                            playFeedback('click-1');
                                            if (item.href === '/customize') {
                                                handleCustomizeClick();
                                            }
                                        }}
                                        className={cn(
                                            'group flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-110',
                                            item.hoverColorClass,
                                            isActive && cn(item.activeColorClass, 'scale-110')
                                        )}
                                        aria-label={item.label}
                                    >
                                        <Icon
                                            className={cn(
                                                'h-5 w-5 transition-transform duration-200 group-hover:scale-125',
                                                isActive && 'scale-125'
                                            )}
                                        />
                                        <span className="sr-only">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top">{item.label}</TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>
            </TooltipProvider>
        </div>
    );
}
