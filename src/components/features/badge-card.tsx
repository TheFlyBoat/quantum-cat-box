
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
    badge: {
        id: string;
        name: string;
        description: string;
        icon: string;
    };
    unlocked: boolean;
    badgeImage?: string;
}

/**
 * A card component that displays a badge.
 * @param badge The badge to display.
 * @param unlocked Whether the badge is unlocked.
 * @param badgeImage The image for the badge.
 */
export function BadgeCard({ badge, unlocked, badgeImage }: BadgeCardProps) {
    const isPlaceholder = badge.id.startsWith('placeholder-') || badge.name === '???';

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card
                        className={cn(
                            "flex aspect-square flex-col overflow-hidden rounded-3xl shadow-sm",
                            isPlaceholder
                                ? "border border-dashed border-muted-foreground/40 bg-background/60 cursor-default"
                                : "border border-border/40 bg-background/80"
                        )}
                    >
                        <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-2">
                            {unlocked && badgeImage ? (
                                <Image
                                    src={badgeImage}
                                    alt={`${badge.name} badge icon`}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16"
                                />
                            ) : (
                                <Lock className="h-8 w-8 text-muted-foreground/80" />
                            )}
                        </CardContent>
                        <CardFooter className="bg-background/60 p-2 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {unlocked ? badge.name : '???'}
                            </p>
                        </CardFooter>
                    </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs space-y-1">
                    <p className="font-semibold">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    {!unlocked && (
                        <p className="text-[11px] font-medium text-primary/80">
                            {isPlaceholder ? 'Undiscovered mystery milestone' : 'Not yet unlocked'}
                        </p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
