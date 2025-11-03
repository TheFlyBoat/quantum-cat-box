
'use client';

import { Award, Flame, Fish, User } from 'lucide-react';
import { useBadges } from '@/context/badge-context';
import { useAchievements } from '@/context/achievements-context';
import { usePoints } from '@/context/points-context';
import { useAuth } from '@/context/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function AppHeader() {
    const { unlockedBadges } = useBadges();
    const { streak } = useAchievements();
    const { points } = usePoints();
    const { user } = useAuth();

    const accountLabel = user && user !== 'guest' ? user.email : 'Guest Mode';

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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 text-muted-foreground">
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
                <div className="flex items-center justify-end gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span>{accountLabel}</span>
                </div>
            </div>
        </TooltipProvider>
    );
}
