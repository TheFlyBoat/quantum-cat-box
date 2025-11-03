
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Atom, Home, Cat, Award, BoxIcon, Settings, Info, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/gallery', icon: Cat, label: 'Gallery' },
    { href: '/awards', icon: Award, label: 'Awards' },
    { href: '/customize', icon: BoxIcon, label: 'Customise' },
    { href: '/info', icon: Info, label: 'Info' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

type MenuItem =
    | { type: 'link'; href: string; icon: React.ComponentType<{ className?: string }>; label: string }
    | { type: 'action'; onSelect: () => void | Promise<void>; icon: React.ComponentType<{ className?: string }>; label: string };

function buildMenuItems(isAuthenticated: boolean, onLogout: () => void | Promise<void>): MenuItem[] {
    const items: MenuItem[] = navItems.map(item => ({
        type: 'link',
        href: item.href,
        icon: item.icon,
        label: item.label,
    }));

    if (isAuthenticated) {
        items.push({
            type: 'action',
            onSelect: onLogout,
            icon: LogOut,
            label: 'Logout',
        });
    } else {
        items.push({
            type: 'link',
            href: '/login',
            icon: LogIn,
            label: 'Login',
        });
    }

    return items;
}

export function FloatingMenu() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement | null>(null);

    const handleLogout = React.useCallback(async () => {
        await logout();
        setOpen(false);
    }, [logout]);

    const menuItems = React.useMemo(
        () => buildMenuItems(Boolean(user && user !== 'guest'), handleLogout),
        [user, handleLogout],
    );

    React.useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    return (
        <div ref={menuRef} className="absolute bottom-0 left-0 z-40">
            <div className="relative pb-5 pl-5 sm:pb-6 sm:pl-6">
                <button
                    onClick={() => setOpen(prev => !prev)}
                    className="flex items-center justify-center text-primary transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={open ? 'Close navigation' : 'Open navigation'}
                    type="button"
                >
                    <Atom className="h-8 w-8" />
                </button>
                <TooltipProvider delayDuration={100}>
                    <nav
                        className={cn(
                            'absolute bottom-16 left-0 flex flex-col items-center gap-1.5 rounded-full border border-border/50 bg-background/95 px-2 py-1.5 shadow-lg transition-all',
                            open ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
                        )}
                        aria-hidden={!open}
                    >
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            const isActive = item.type === 'link' && pathname === item.href;

                            const baseClasses = cn(
                                'flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                isActive && 'text-primary'
                            );

                            return (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        {item.type === 'link' ? (
                                            <Link
                                                href={item.href}
                                                className={baseClasses}
                                                aria-label={item.label}
                                                onClick={() => setOpen(false)}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="sr-only">{item.label}</span>
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void item.onSelect();
                                                    setOpen(false);
                                                }}
                                                className={cn(baseClasses, 'hover:text-destructive')}
                                                aria-label={item.label}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="sr-only">{item.label}</span>
                                            </button>
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent side="left">{item.label}</TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </TooltipProvider>
            </div>
        </div>
    );
}
