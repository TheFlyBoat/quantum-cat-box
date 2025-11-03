'use client';

import * as React from 'react';
import { CelebrationCard } from '@/components/celebration-card';
import { LoginPrompt } from '@/components/auth/login-prompt';
import { LoginModal } from '@/components/auth/login-modal';
import { useBadges } from '@/context/badge-context';
import { badgeImageMap, defaultBadgeImage } from '@/lib/badge-images';
import badgeData from '@/lib/badge-data.json';
import Image from 'next/image';
import { AppHeader } from '@/components/layout/app-header';
import { cn } from '@/lib/utils';
import { FloatingMenu } from '@/components/layout/sidebar';
import { InfiniteBoxGame, type InfiniteBoxGameResult } from '@/components/infinite-box-game';
import { usePoints } from '@/context/points-context';
import { useToast } from '@/hooks/use-toast';

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? 'v0.2.0';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { celebrationBadgeId } = useBadges();
    const [celebrationContent, setCelebrationContent] = React.useState<{ title: string; badgeName: string; description: string; icon?: React.ReactNode } | null>(null);
    const [celebrationState, setCelebrationState] = React.useState('idle');
    const [hiddenGameOpen, setHiddenGameOpen] = React.useState(false);
    const [versionTapCount, setVersionTapCount] = React.useState(0);
    const versionTapResetRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const handleVersionClick = React.useCallback(() => {
        setVersionTapCount(prev => {
            const next = prev + 1;

            if (versionTapResetRef.current) {
                clearTimeout(versionTapResetRef.current);
            }

            versionTapResetRef.current = setTimeout(() => {
                setVersionTapCount(0);
                versionTapResetRef.current = null;
            }, 1200);

            if (next >= 3) {
                if (versionTapResetRef.current) {
                    clearTimeout(versionTapResetRef.current);
                    versionTapResetRef.current = null;
                }
                setVersionTapCount(0);
                setHiddenGameOpen(true);
            }

            return next >= 3 ? 0 : next;
        });
    }, []);

    React.useEffect(() => {
        return () => {
            if (versionTapResetRef.current) {
                clearTimeout(versionTapResetRef.current);
            }
        };
    }, []);

    const handleHiddenGameComplete = React.useCallback((result: InfiniteBoxGameResult) => {
        if (result.pointsAwarded > 0) {
            addPoints(result.pointsAwarded);
            toast({
                title: 'Infinite Box complete!',
                description: `You earned ${result.pointsAwarded} Fish Points.`,
            });
        } else {
            toast({
                title: 'Infinite Box complete!',
                description: 'No bonus points this time, but the quantum cat is impressed.',
            });
        }
        setHiddenGameOpen(false);
    }, [addPoints, toast]);

    const handleHiddenGameDismiss = React.useCallback(() => {
        setHiddenGameOpen(false);
    }, []);

    return (
        <div className={cn("relative min-h-screen w-full bg-background", celebrationInProgress && "bg-black")}>
            <div className="mx-auto flex min-h-screen w-full max-w-[360px] flex-col items-center px-0 py-10 sm:px-4">
                <main className="relative w-full rounded-[32px] border border-border/40 bg-card/95 px-4 pb-10 pt-6 shadow-[0_25px_70px_-35px_rgba(79,70,229,0.45)] backdrop-blur-sm sm:px-6 sm:pb-12 sm:pt-8">
                    <AppHeader />
                    <div className="mt-6 flex w-full flex-col gap-6">
                        {children}
                    </div>
                    <FloatingMenu />
                    <button
                        type="button"
                        onClick={handleVersionClick}
                        className="absolute bottom-4 right-4 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label={`App version ${APP_VERSION}`}
                    >
                        {APP_VERSION}
                    </button>
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
