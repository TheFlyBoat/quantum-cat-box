'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { QuantumCatBox } from '@/components/features/quantum-cat-box';
import { QuantumMessageDisplay } from '@/components/features/message-display';
import { DevPanel } from '@/components/features/dev-panel';
import { QuantumMessageActions } from '@/components/features/quantum-message-actions';
import { ShareCard } from '@/components/features/share-card';
import { TutorialOverlay } from '@/components/features/tutorial-overlay';
import { TitleDisplay } from '@/components/title-display';
import { SplashScreen } from '@/components/splash-screen';
import { useCatLogic } from '@/lib/hooks/use-cat-logic';
import { useDevMode } from '@/lib/hooks/use-dev-mode';
import { ShareAsset, useShare } from '@/lib/hooks/use-share';
import { useDiary } from '@/context/diary-context';
import { useBadges } from '@/context/badge-context';
import { useFeedback } from '@/context/feedback-context';
import { useBoxSkin } from '@/context/box-skin-context';
import { useToast } from '@/hooks/use-toast';
import { playSound } from '@/lib/audio';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { OnboardingModal } from '@/components/features/onboarding-modal';

export default function HomePage({ onInteraction, setRevealedCatId }: { onInteraction?: () => void; setRevealedCatId?: (id: string | null) => void; }) {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isAmbientShaking, setIsAmbientShaking] = useState(false);
    const [isGeneratingShare, setIsGeneratingShare] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [shareAsset, setShareAsset] = useState<ShareAsset | null>(null);
    const [currentCatId, setCurrentCatId] = useState<string | null>(null);
    const [showSplash, setShowSplash] = useState(true);
    const [lockNotice, setLockNotice] = useState('');

    const [isShared, setIsShared] = useState(false);
    const [pendingAutoOpen, setPendingAutoOpen] = useState(false);
    const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);

    const { toast } = useToast();
    const { toggleDiaryEntry, isMessageSaved: isDiaryMessageSaved, recordReveal } = useDiary();
    const { lastUnlockedBadgeId, triggerCelebration } = useBadges();
    const { reduceMotion } = useFeedback();
    const { selectedSkin } = useBoxSkin();
    const { storageMode, localProgressMessageSeen, markLocalMessageSeen } = useAuth();

    const {
        catState,
        message,
        isLoading,
        isRevealing,
        revealedCatName,
        handleBoxClick,
        handleReset,
        setCatState,
        setMessage,
        setRevealedCatName,
        isDailyLocked,
        nextAvailableAt,
        refreshDailyLock,
        overrideDailyLock,
    } = useCatLogic({
        onInteraction,
        setRevealedCatId: (id) => {
            setCurrentCatId(id);
            setRevealedCatId?.(id);
        },
        onCatReveal: (catId: string, _revealedMessage: string) => {
            setCurrentCatId(catId);
            recordReveal(catId);
        }
    });

    const { isDevMode, handleTitleClick, handleDevCatSelect, allCats } = useDevMode({
        handleReset,
        setCatState,
        setMessage,
        setRevealedCatName,
        setRevealedCatId
    });

    const { shareCardRef, createShareAsset, rewardShare } = useShare(message);
    const revealedCatId = catState?.catId;
    const activeCatId = catState?.catId ?? currentCatId;
    const isCurrentMessageSaved = !!(activeCatId && message && isDiaryMessageSaved(activeCatId, message));

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const alreadySeen = sessionStorage.getItem('quantum-cat-splash') === 'seen';
                if (alreadySeen) {
                    setShowSplash(false);
                }
            }
        } catch (error) {
            console.warn('Unable to access sessionStorage for splash screen state', error);
        }
    }, []);

    useEffect(() => {
        try {
            const onboardingSeen = localStorage.getItem('quantum-cat-onboarding-v2');
            if (!onboardingSeen) {
                setShowOnboarding(true);
            }
        } catch (error) {
            console.error('Could not access localStorage for onboarding', error);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (catState.outcome === 'initial' && !isLoading && !isRevealing && !reduceMotion) {
            interval = setInterval(() => {
                const shouldShake = Math.random() < 0.2;
                if (shouldShake) {
                    setIsAmbientShaking(true);
                    setTimeout(() => setIsAmbientShaking(false), 500);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [catState.outcome, isLoading, isRevealing, reduceMotion]);

    useEffect(() => {
        if (!message || !lastUnlockedBadgeId || !revealedCatId || isRevealing || isLoading) return;

        const words = message.trim().split(/\s+/).filter(Boolean);
        const estimatedReadingTime = Math.min(8000, Math.max(2500, words.length * 400));

        const celebrationDelay = setTimeout(() => {
            triggerCelebration();
        }, estimatedReadingTime);

        return () => clearTimeout(celebrationDelay);
    }, [message, lastUnlockedBadgeId, triggerCelebration, revealedCatId, isRevealing, isLoading]);

    useEffect(() => {
        if (storageMode !== 'local') return;
        if (localProgressMessageSeen) return;
        if (catState?.outcome === 'initial' || !catState?.catId) return;

        toast({
            title: 'Progress saved locally',
            description: 'Your cats and fortunes are saved on this device.',
        });
        markLocalMessageSeen();
    }, [storageMode, localProgressMessageSeen, catState?.outcome, catState?.catId, toast, markLocalMessageSeen]);

    useEffect(() => {
        if (!pendingAutoOpen) return;
        if (isLoading || isRevealing) return;
        if (catState.outcome !== 'initial') return;

        setPendingAutoOpen(false);
        handleBoxClick({ ignoreLock: true });
    }, [pendingAutoOpen, isLoading, isRevealing, catState.outcome, handleBoxClick]);

    useEffect(() => {
        if (!isDailyLocked) {
            setLockNotice('');
        }
    }, [isDailyLocked]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const tutorialSeen = localStorage.getItem('quantum-cat-tutorial-v1') === 'true';
            if (!tutorialSeen) {
                setShowTutorialOverlay(true);
            }
        } catch (error) {
            console.warn('Unable to access tutorial overlay state', error);
        }
    }, []);

    const dismissTutorialOverlay = useCallback(() => {
        setShowTutorialOverlay(false);
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem('quantum-cat-tutorial-v1', 'true');
        } catch (error) {
            console.warn('Unable to persist tutorial overlay state', error);
        }
    }, []);

    useEffect(() => {
        if (catState.outcome !== 'initial') {
            dismissTutorialOverlay();
        }
    }, [catState.outcome, dismissTutorialOverlay]);

    const handleToggleSaveMessage = () => {
        if (!activeCatId || !message) return;
        playSound('haptic-1');
        const saved = toggleDiaryEntry(activeCatId, message);
        toast({
            description: saved
                ? "Message saved to this cat's diary in your gallery."
                : "Message removed from this cat's diary.",
        });
    };

    const handleSplashComplete = () => {
        setShowSplash(false);
        try {
            sessionStorage.setItem('quantum-cat-splash', 'seen');
        } catch (error) {
            console.warn('Unable to persist splash screen state', error);
        }
    };

    const handleOnboardingDismiss = () => {
        setShowOnboarding(false);
        try {
            localStorage.setItem('quantum-cat-onboarding-v2', 'true');
        } catch (error) {
            console.error('Could not persist onboarding state', error);
        }
    };

    const onBoxClick = () => {
        if (showOnboarding) {
            return;
        }
        if (isDailyLocked) {
            overrideDailyLock();
            setPendingAutoOpen(true);
            if (lockNotice) {
                setLockNotice('');
            }
            if (showTutorialOverlay) {
                dismissTutorialOverlay();
            }
            return;
        }
        if (lockNotice) {
            setLockNotice('');
        }
        if (showTutorialOverlay) {
            dismissTutorialOverlay();
        }
        handleBoxClick({ ignoreLock: true });
    };

    const shareText = useMemo(() => {
        if (revealedCatName) {
            return `I opened the box and my cat is a ${revealedCatName}! What state will your cat be in?`;
        }
        return 'I opened the quantum cat box! What state will your cat be in?';
    }, [revealedCatName]);

    const nativeShareAvailable = useMemo(() => {
        return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
    }, []);

    const downloadAttributeSupported = useMemo(() => {
        if (typeof document === 'undefined') {
            return false;
        }
        const anchor = document.createElement('a');
        return typeof anchor.download !== 'undefined';
    }, []);

    const handleRequestAnotherBox = useCallback(() => {
        if (isDailyLocked) {
            overrideDailyLock();
        } else {
            handleReset({ ignoreLock: true });
        }
        setIsShared(false);
        setLockNotice('');
        setPendingAutoOpen(false);
    }, [isDailyLocked, overrideDailyLock, handleReset]);

    const handleShareRequest = async () => {
        if (isGeneratingShare) return;
        playSound('click-2');

        setIsGeneratingShare(true);
        toast({
            title: 'Generating your share card...',
            description: 'Please wait a moment.',
        });

        try {
            const asset = await createShareAsset();
            setShareAsset(asset);
            setIsShareDialogOpen(true);
            toast({
                title: 'Share card ready!',
                description: 'Choose how you want to share it.',
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('not ready')) {
                toast({
                    title: 'Cannot share yet',
                    description: 'The reveal is not complete.',
                    variant: 'destructive',
                });
            } else {
                console.error('Failed to prepare share card:', error);
                toast({
                    title: 'Sharing Failed',
                    description: 'Could not generate the image. Please try again.',
                    variant: 'destructive',
                });
            }
        } finally {
            setIsGeneratingShare(false);
        }
    };

    const handleNativeShare = async () => {
        if (!shareAsset) return;
        if (!nativeShareAvailable) {
            toast({
                title: 'Sharing not supported',
                description: 'Your device does not support direct sharing.',
                variant: 'destructive',
            });
            return;
        }

        try {
            if (typeof navigator.canShare === 'function' && !navigator.canShare({ files: [shareAsset.file] })) {
                throw new Error('Unsupported share type');
            }

            await navigator.share({
                title: 'The Quantum Cat',
                text: shareText,
                files: [shareAsset.file],
                url: 'https://thequantumcat.app',
            });

            rewardShare();
            setIsShared(true);
            toast({
                description: '10 Fish Points awarded.',
            });
            setIsShareDialogOpen(false);
            setShareAsset(null);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                toast({
                    title: 'Share canceled',
                    description: 'No worries—try again whenever you like.',
                });
                return;
            }

            console.error('Native share failed:', error);
            toast({
                title: 'Share unavailable',
                description: 'Try saving the image and sharing it manually.',
                variant: 'destructive',
            });
        }
    };

    const handleDownloadShare = () => {
        if (!shareAsset) return;

        try {
            if (downloadAttributeSupported) {
                const link = document.createElement('a');
                link.href = shareAsset.dataUrl;
                link.download = 'quantum-cat.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(shareAsset.dataUrl, '_blank', 'noopener,noreferrer');
            }

            rewardShare();
            setIsShared(true);
            toast({
                title: 'Image saved!',
                description: '10 Fish Points awarded. Share it from your gallery.',
            });
            setIsShareDialogOpen(false);
            setShareAsset(null);
        } catch (error) {
            console.error('Failed to download share card:', error);
            toast({
                title: 'Download failed',
                description: 'Try long-pressing the image or taking a screenshot.',
                variant: 'destructive',
            });
        }
    };

    const closeShareDialog = () => {
        setIsShareDialogOpen(false);
        setShareAsset(null);
    };

    return (
        <>
            {showSplash ? (
            <SplashScreen onComplete={handleSplashComplete} />
        ) : (
            <>
                <OnboardingModal open={showOnboarding} onClose={handleOnboardingDismiss} />

                <div className="absolute left-[-1000px] top-[-1000px]">
                    <div ref={shareCardRef} style={{ width: '320px', height: '520px' }}>
                        <ShareCard catState={catState} message={message} boxSkin={selectedSkin} />
                    </div>
                </div>

                    <div className="mx-auto flex w-full max-w-full flex-col items-center text-center">
                        <TitleDisplay name={revealedCatName} onTitleClick={handleTitleClick} reduceMotion={reduceMotion} />

                        {isDevMode && (
                            <DevPanel
                                allCats={allCats}
                                onCatSelect={handleDevCatSelect}
                                catState={catState}
                                quantumMessage={message}
                            />
                        )}

                        <div className="relative mt-6 flex h-64 w-full items-center justify-center">
                            {showTutorialOverlay && !showOnboarding && !isDailyLocked && catState.outcome === 'initial' && (
                                <TutorialOverlay />
                            )}
                            <QuantumCatBox
                                onClick={onBoxClick}
                                isLoading={isLoading}
                                isRevealing={isRevealing}
                                catState={catState}
                                isAmbientShaking={isAmbientShaking}
                                isLocked={false}
                            />
                        </div>

                        <div className="mt-6 flex w-full flex-col items-center gap-6">
                            {catState.outcome !== 'initial' && (
                                <div className="flex w-full flex-col items-center gap-6">
                                    <QuantumMessageDisplay message={message} catState={catState} />
                                    {lockNotice && (
                                        <div className="mt-4 w-full max-w-2xl">
                                            <div className="rounded-xl border border-emerald-400 bg-emerald-500/10 px-4 py-4">
                                                <div className="font-fortune text-center text-emerald-400 text-xl font-semibold leading-tight md:text-2xl">
                                                    {lockNotice.split('\n').map((line, index) => (
                                                        <div key={index}>{line}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {message && (
                                        <div className="w-full">
                                            <QuantumMessageActions
                                                onToggleDiaryEntry={handleToggleSaveMessage}
                                                onShareQuantumMessage={handleShareRequest}
                                                onRequestAnotherQuantumBox={handleRequestAnotherBox}
                                                isDiarySaved={isCurrentMessageSaved}
                                                hasSharedQuantumMessage={isShared}
                                                reduceMotion={reduceMotion}
                                                isShareDisabled={isGeneratingShare}
                                                isResetDisabled={false}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Dialog open={isShareDialogOpen} onOpenChange={(open) => {
                        if (!open) {
                            closeShareDialog();
                        }
                    }}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Share your discovery</DialogTitle>
                                <DialogDescription>
                                    Send the card to Instagram, WhatsApp, or anywhere else.
                                </DialogDescription>
                            </DialogHeader>

                            {shareAsset ? (
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-lg border bg-background/50">
                                        <Image
                                            src={shareAsset.dataUrl}
                                            alt="Quantum Cat share card"
                                            width={320}
                                            height={520}
                                            unoptimized
                                            className="w-full h-auto"
                                        />
                                    </div>

                                    {nativeShareAvailable && (
                                        <Button onClick={handleNativeShare}>
                                            Share via device…
                                        </Button>
                                    )}

                                    <Button variant="outline" onClick={handleDownloadShare}>
                                        Save image to share manually
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        Tip: After saving, open your Photos or Files app and share the image to Instagram or WhatsApp.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Preparing your card…</p>
                            )}
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </>
    );
}
