'use client';

import * as React from 'react';
import { CelebrationCard } from '@/components/features/celebration-card';
import { LoginPrompt } from '@/components/auth/login-prompt';
import { LoginModal } from '@/components/auth/login-modal';
import { useBadges } from '@/context/badge-context';
import { badgeImageMap, defaultBadgeImage } from '@/lib/badge-images';
import badgeData from '@/lib/badge-data.json';
import Image from 'next/image';
import { AppHeader } from '@/components/layout/app-header';
import { FloatingMenu } from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';
import { InfiniteBoxGame, type InfiniteBoxGameResult } from '@/components/features/infinite-box-game';
import { usePoints } from '@/context/points-context';
import { useToast } from '@/hooks/use-toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { celebrationBadgeId } = useBadges();
    const [celebrationContent, setCelebrationContent] = React.useState<{ title: string; badgeName: string; description: string; icon?: React.ReactNode } | null>(null);
    const [celebrationState, setCelebrationState] = React.useState('idle');
    const [hiddenGameOpen, setHiddenGameOpen] = React.useState(false);

    const { addPoints } = usePoints();
    const { toast } = useToast();

    const closeCelebration = React.useCallback(() => {
        setCelebrationState('finished');
        setCelebrationContent(null);
    }, []);

    React.useEffect(() => {
        if (!celebrationBadgeId) return;

        const badge = badgeData.badges.find(b => b.id === celebrationBadgeId);
        if (!badge) return;

        const badgeImage = badgeImageMap[badge.id] ?? defaultBadgeImage;

        const applyCelebration = () => {
            setCelebrationContent({
                title: 'Badge Unlocked',
                badgeName: badge.name,
                description: badge.description,
                icon: badgeImage ? (
                    <Image
                        src={badgeImage}
                        alt={`${badge.name} badge icon`}
                        width={64}
                        height={64}
                        className="w-16 h-16"
                    />
                ) : undefined
            });
            setCelebrationState('celebrating');
        };

        if (typeof queueMicrotask === 'function') {
            queueMicrotask(applyCelebration);
        } else {
            setTimeout(applyCelebration, 0);
        }

        const timeoutId = setTimeout(closeCelebration, 4000);
        return () => clearTimeout(timeoutId);
    }, [celebrationBadgeId, closeCelebration]);

    const celebrationInProgress = celebrationState === 'celebrating' || celebrationState === 'spotlight';

    const handleHiddenGameComplete = React.useCallback((result: InfiniteBoxGameResult) => {
        if (result.fishPointsAwarded > 0) {
            addPoints(result.fishPointsAwarded);
            toast({
                title: 'Infinite Box complete!',
                description: `You earned ${result.fishPointsAwarded} Fish Points.`,
            });
        } else {
            toast({
                title: 'Infinite Box complete!',
                description: 'No bonus Fish Points this time, but the Quantum Cat is impressed.',
            });
        }
        setHiddenGameOpen(false);
    }, [addPoints, toast]);

    const handleHiddenGameDismiss = React.useCallback(() => {
        setHiddenGameOpen(false);
    }, []);

    return (
        <div className={cn("relative min-h-screen w-full bg-background", celebrationInProgress && "bg-black")}>
            <div className="mx-auto flex w-full max-w-[400px] h-[850px] flex-col items-center p-4">
                <main className="relative flex flex-col w-full h-full rounded-[32px] border border-border/40 bg-card/95 px-4 pb-10 pt-6 shadow-[0_25px_70px_-35px_rgba(79,70,229,0.45)] backdrop-blur-sm sm:px-6 sm:pb-12 sm:pt-8">
                    <AppHeader />
                    <div className="mt-6 flex w-full flex-col gap-6 flex-grow">
                        {children}
                    </div>
                    <FloatingMenu />
                </main>
            </div>
            {celebrationState === 'celebrating' && celebrationContent && (
                <CelebrationCard
                    title={celebrationContent.title}
                    badgeName={celebrationContent.badgeName}
                    description={celebrationContent.description}
                    icon={celebrationContent.icon}
                    onClose={closeCelebration}
                />
            )}
            <LoginPrompt />
            <LoginModal />
            {hiddenGameOpen && (
                <InfiniteBoxGame
                    onComplete={handleHiddenGameComplete}
                    onDismiss={handleHiddenGameDismiss}
                />
            )}
        </div>
    );
}
