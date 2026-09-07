'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { QuantumCatBox } from '@/components/features/quantum-cat-box';
import { QuantumMessageDisplay } from '@/components/features/message-display';
import { DevPanel } from '@/components/features/dev-panel';
import { QuantumMessageActions } from '@/components/features/quantum-message-actions';
import { ShareCard } from '@/components/features/share-card';
import { TutorialOverlay } from '@/components/features/tutorial-overlay';
import { TitleDisplay } from '@/components/title-display';
import { SplashScreen } from '@/components/splash-screen';
import { useCatLogic } from '@/hooks/use-cat-logic';
import { useDevMode } from '@/hooks/use-dev-mode';
import { useShare, type ShareAsset } from '@/hooks/use-share';
import { useDiary } from '@/context/diary-context';
import { useBadges } from '@/context/badge-context';
import { useFeedback } from '@/context/feedback-context';
import { useBoxSkin } from '@/context/box-skin-context';
import { useToast } from '@/hooks/use-toast';
import { playFeedback } from '@/lib/audio';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { IntroOverlay } from '@/components/features/intro-overlay';
import { usePoints } from '@/context/points-context';
import { UnlockBoxDialog } from '@/components/features/unlock-box-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles } from 'lucide-react';

export default function HomePage() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isAmbientShaking, setIsAmbientShaking] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [shareAsset, setShareAsset] = useState<ShareAsset | null>(null);
    const [shareFormat, setShareFormat] = useState<'story' | 'square'>('story');
    const [isGeneratingShare, setIsGeneratingShare] = useState(false);
    const [hasShared, setHasShared] = useState(false);
    
    const [currentCatId, setCurrentCatId] = useState<string | null>(null);
    const [showSplash, setShowSplash] = useState(true);
    const [lockNotice, setLockNotice] = useState('');

    const [pendingAutoOpen, setPendingAutoOpen] = useState(false);
    const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);

    const storyRef = useRef<HTMLDivElement>(null);
    const squareRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();
    const { points, spendPoints } = usePoints();
    const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
    const { toggleDiaryEntry, isMessageSaved: isDiaryMessageSaved, recordReveal } = useDiary();
    const { lastUnlockedBadgeId, triggerCelebration } = useBadges();
    const { reduceMotion } = useFeedback();
    const { selectedSkin } = useBoxSkin();
    const { storageMode, localProgressMessageSeen, markLocalMessageSeen, userData } = useAuth();

    const userNickname = userData?.nickname;

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
        onShareAssetCreated: () => {},
        setRevealedCatId: (id) => {
            setCurrentCatId(id);
        },
        onCatReveal: (catId: string, _revealedMessage: string) => {
            setCurrentCatId(catId);
            recordReveal(catId);
            setHasShared(false); // Reset shared state on new reveal
        },
        onDailyLock: () => {
            setLockNotice('The Quantum Box is recharging. Come back tomorrow!');
        }
    });

    const { createShareAsset, rewardShare } = useShare(message);

    const { isDevMode, handleTitleClick, handleDevCatSelect, allCats } = useDevMode({
        handleReset,
        setCatState,
        setMessage,
        setRevealedCatName,
        setRevealedCatId: setCurrentCatId,
    });

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
                // If showing onboarding, don't show splash
                setShowSplash(false);
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
            description: 'Your cats and Quantum Messages are saved on this device.',
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
        playFeedback('haptic-1');
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

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        try {
            localStorage.setItem('quantum-cat-onboarding-v2', 'true');
        } catch (error) {
            console.error('Could not persist onboarding state', error);
        }
    };

    const shareText = useMemo(() => {
        if (revealedCatName) {
            return `I opened the box and my cat is a ${revealedCatName}! What destiny will you reveal?`;
        }
        return 'I opened the Quantum Box! What destiny will you reveal?';
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

    const handleUnlockWithPoints = useCallback(() => {
        if (points < 10) {
            playFeedback('error-1');
            toast({
                title: 'Not enough Fish Points',
                description: 'You need 10 Fish Points to unlock the Quantum Box.',
                variant: 'destructive',
            });
            return;
        }

        spendPoints(10);
        overrideDailyLock();
        playFeedback('celebration-magic');
        toast({
            title: 'Quantum Box Unlocked!',
            description: 'You spent 10 Fish Points. The Quantum Box is ready to open!',
        });
        setLockNotice('');
        setPendingAutoOpen(false);
    }, [points, spendPoints, overrideDailyLock, toast]);

    const handleRequestAnotherBox = useCallback(() => {
        if (isDailyLocked) {
            setIsUnlockDialogOpen(true);
        } else {
            handleReset({ ignoreLock: true });
            setLockNotice('');
            setPendingAutoOpen(false);
        }
    }, [isDailyLocked, handleReset]);

    const generateAssetForFormat = async (format: 'story' | 'square') => {
        setIsGeneratingShare(true);
        setShareAsset(null); // Clear previous asset while generating
        try {
            const targetRef = format === 'story' ? storyRef : squareRef;
            const asset = await createShareAsset(targetRef);
            setShareAsset(asset);
        } catch (error) {
            console.error('Share generation failed:', error);
            toast({
                title: 'Error generating card',
                description: 'Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsGeneratingShare(false);
        }
    };

    const onShareRequest = async () => {
        playFeedback('click-2');
        setIsShareDialogOpen(true);
        setShareFormat('story');
        await generateAssetForFormat('story');
    };

    const handleFormatChange = async (value: string) => {
        const format = value as 'story' | 'square';
        setShareFormat(format);
        await generateAssetForFormat(format);
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
            setHasShared(true);
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
                link.download = `quantum-cat-${shareFormat}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(shareAsset.dataUrl, '_blank', 'noopener,noreferrer');
            }

            rewardShare();
            setHasShared(true);
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
            {showOnboarding ? (
                <IntroOverlay onComplete={handleOnboardingComplete} />
            ) : showSplash ? (
                <SplashScreen onComplete={handleSplashComplete} />
            ) : (
                <>
                                    {/* Hidden Share Cards */}
                                    <div className="absolute left-[-9999px] top-[-9999px] overflow-hidden">
                                        <div ref={storyRef} style={{ width: '1080px', height: '1920px' }}>
                                            <ShareCard catState={catState} message={message} boxSkin={selectedSkin} format="story" userName={userNickname} />
                                        </div>
                                        <div ref={squareRef} style={{ width: '1080px', height: '1080px' }}>
                                            <ShareCard catState={catState} message={message} boxSkin={selectedSkin} format="square" userName={userNickname} />
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
                                onClick={handleBoxClick}
                                isLoading={isLoading}
                                isRevealing={isRevealing}
                                catState={catState}
                                isAmbientShaking={isAmbientShaking}
                                isLocked={isDailyLocked}
                                onUnlockRequested={() => setIsUnlockDialogOpen(true)}
                            />
                        </div>

                        {isDailyLocked && catState.outcome === 'initial' && (
                            <div className="mt-2 flex justify-center">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setIsUnlockDialogOpen(true)}
                                    className="rounded-2xl font-bold bg-gradient-to-r from-[#A240FF] to-[#3696C9] text-white shadow hover:opacity-95 px-4"
                                >
                                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                    Unlock Box (10 Fish Points)
                                </Button>
                            </div>
                        )}

                        <div className="mt-6 flex w-full flex-col items-center gap-6">
                            {catState.outcome !== 'initial' && (
                                <div className="flex w-full flex-col items-center gap-6">
                                    <QuantumMessageDisplay message={message} catState={catState} />
                                    {lockNotice && (
                                        <div className="mt-4 w-full max-w-2xl">
                                            <div className="rounded-3xl border border-[#A240FF]/30 bg-[#A240FF]/10 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                                                <div className="text-center sm:text-left">
                                                    <p className="font-headline font-bold text-lg text-foreground">
                                                        The Quantum Box is closed for today.
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reopen it now with Fish Points or wait until tomorrow!
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => setIsUnlockDialogOpen(true)}
                                                    className="rounded-2xl font-bold bg-gradient-to-r from-[#A240FF] to-[#3696C9] text-white shadow-md hover:opacity-95 shrink-0 px-4 py-2"
                                                >
                                                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                                    Unlock (10 Fish Points)
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {message && (
                                        <div className="w-full">
                                            <QuantumMessageActions
                                                onToggleDiaryEntry={handleToggleSaveMessage}
                                                onShareQuantumMessage={onShareRequest}
                                                onRequestAnotherQuantumBox={handleRequestAnotherBox}
                                                isDiarySaved={isCurrentMessageSaved}
                                                hasSharedQuantumMessage={hasShared}
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
                        <DialogContent className="sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden">
                            <DialogHeader className="p-6 pb-2">
                                <DialogTitle>Share your destiny</DialogTitle>
                                <DialogDescription>
                                    Choose a format to share.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="p-6 pt-2">
                                <Tabs defaultValue="story" value={shareFormat} onValueChange={handleFormatChange} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="story">Story (9:16)</TabsTrigger>
                                        <TabsTrigger value="square">Post (1:1)</TabsTrigger>
                                    </TabsList>

                                    <div className="relative w-full aspect-[9/16] max-h-[50vh] bg-muted/30 rounded-lg overflow-hidden border flex items-center justify-center">
                                         {isGeneratingShare && (
                                             <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                                                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                             </div>
                                         )}
                                         
                                         {shareAsset ? (
                                             <Image
                                                 src={shareAsset.dataUrl}
                                                 alt="Preview"
                                                 fill
                                                 className="object-contain"
                                             />
                                         ) : (
                                             !isGeneratingShare && <span className="text-muted-foreground text-sm">Preview unavailable</span>
                                         )}
                                    </div>

                                    <div className="mt-6 flex flex-col gap-3">
                                        {nativeShareAvailable && (
                                            <Button onClick={handleNativeShare} className="w-full" disabled={!shareAsset || isGeneratingShare}>
                                                Share via device…
                                            </Button>
                                        )}
                                        <Button variant="outline" onClick={handleDownloadShare} className="w-full" disabled={!shareAsset || isGeneratingShare}>
                                            Save image
                                        </Button>
                                    </div>
                                </Tabs>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <UnlockBoxDialog
                        open={isUnlockDialogOpen}
                        onOpenChange={setIsUnlockDialogOpen}
                        currentPoints={points}
                        cost={10}
                        onConfirmUnlock={handleUnlockWithPoints}
                    />
                </>
            )}
        </>
    );
}