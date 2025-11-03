
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

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
    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className="overflow-hidden aspect-square flex flex-col">
                        <CardContent className="p-2 flex-grow h-full flex items-center justify-center bg-muted/50 relative">
                            {unlocked && badgeImage ? (
                                <Image
                                    src={badgeImage}
                                    alt={`${badge.name} badge icon`}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16"
                                />
                            ) : (
                                <Lock className="w-6 h-6 text-muted-foreground" />
                            )}
                        </CardContent>
                        <CardFooter className="p-2 justify-center bg-background/50">
                            <p className="body-text font-bold text-center">{unlocked ? badge.name : '???'}</p>
                        </CardFooter>
                    </Card>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs space-y-1">
                    <p className="font-semibold">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    {!unlocked && (
                        <p className="text-[11px] font-medium text-primary/80">Not yet unlocked</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
