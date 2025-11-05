
'use client';

import * as React from 'react';
import { Award, Flame, Fish } from 'lucide-react';
import { useBadges } from '@/context/badge-context';
import { useBadgeProgress } from '@/context/badge-progress-context';
import { usePoints } from '@/context/points-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { UserStatusLabel } from '@/components/auth/user-status-label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

export function AppHeader() {
    const { unlockedBadges } = useBadges();
    const { streak } = useBadgeProgress();
    const { points } = usePoints();
    const { user, displayName, logout, openLoginModal } = useAuth();
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);

    const isGuest = !user || user === 'guest';
    const userEmail = typeof user === 'object' && user ? user.email ?? null : null;
    const fullUserIdentity = isGuest ? 'Guest Mode' : (userEmail ?? displayName ?? 'Signed in user');

    const handleSignIn = React.useCallback(() => {
        openLoginModal();
        setUserMenuOpen(false);
    }, [openLoginModal]);

    const handleSignOut = React.useCallback(async () => {
        await logout();
        setUserMenuOpen(false);
    }, [logout]);

    const metrics = [
        {
            icon: Award,
            value: unlockedBadges.length,
            label: 'Badges unlocked',
            iconClass: 'text-yellow-500',
        },
        {
            icon: Flame,
            value: streak,
            label: 'Daily streak',
            iconClass: 'text-red-500',
        },
        {
            icon: Fish,
            value: points,
            label: 'Fish points',
            iconClass: 'text-sky-500',
        },
    ] as const;

    return (
        <TooltipProvider>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    {metrics.map(({ icon: Icon, value, label, iconClass }) => (
                        <Tooltip key={label}>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-sm font-semibold">
                                    <Icon className={cn('h-4 w-4', iconClass)} />
                                    <span>{value}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                <div className="flex items-center justify-end ml-auto">
                    <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <UserStatusLabel className="cursor-pointer select-none" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-60 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    User
                                </p>
                                <p className="text-sm font-semibold text-foreground break-words">
                                    {fullUserIdentity}
                                </p>
                            </div>
                            <Button
                                onClick={isGuest ? handleSignIn : handleSignOut}
                                variant={isGuest ? 'default' : 'outline'}
                                className="w-full"
                            >
                                {isGuest ? 'Sign In' : 'Sign Out'}
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </TooltipProvider>
    );
}
