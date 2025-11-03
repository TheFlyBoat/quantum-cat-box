
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cat, BoxIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
    { href: '/home', icon: Home, label: 'Home', hoverColorClass: 'hover:text-sky-400', activeColorClass: 'text-sky-400' },
    { href: '/gallery', icon: Cat, label: 'Gallery', hoverColorClass: 'hover:text-fuchsia-400', activeColorClass: 'text-fuchsia-400' },
    { href: '/customize', icon: BoxIcon, label: 'Customise', hoverColorClass: 'hover:text-amber-400', activeColorClass: 'text-amber-400' },
    { href: '/settings', icon: Settings, label: 'Settings', hoverColorClass: 'hover:text-emerald-400', activeColorClass: 'text-emerald-400' },
];

export function FloatingMenu() {
    const pathname = usePathname();

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
