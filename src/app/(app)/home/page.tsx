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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Check, Copy, Download, Share2 } from 'lucide-react';
import { WhatsAppIcon, XTwitterIcon, InstagramIcon } from '@/components/icons/social-icons';

export default function HomePage() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isAmbientShaking, setIsAmbientShaking] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [shareAsset, setShareAsset] = useState<ShareAsset | null>(null);
    const [shareFormat, setShareFormat] = useState<'story' | 'square'>('story');
    const [isGeneratingShare, setIsGeneratingShare] = useState(false);
    const [hasShared, setHasShared] = useState(false);
    const [hasCopiedLink, setHasCopiedLink] = useState(false);
    
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

    const shareUrl = 'https://thequantumcat.app';

    const shareText = useMemo(() => {
        const outcomeWord = catState?.outcome ? catState.outcome.toUpperCase() : 'PARADOX';
        const catTitle = revealedCatName || 'Quantum Cat';
        if (message) {
            return `My Quantum Cat is ${outcomeWord}: "${message}" 🐱✨ Open your box and reveal your destiny:`;
        }
        return `I opened the Quantum Box and revealed the ${catTitle} (${outcomeWord})! 🐱✨ What destiny will you find?`;
    }, [catState?.outcome, revealedCatName, message]);

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

    const generateAssetForFormat = useCallback(async (format: 'story' | 'square') => {
        setIsGeneratingShare(true);
        setShareAsset(null); // Clear previous asset while generating
        try {
            await new Promise((resolve) => setTimeout(resolve, 80));
            const targetRef = format === 'story' ? storyRef : squareRef;
            const asset = await createShareAsset(targetRef);
            setShareAsset(asset);
        } catch (error) {
            console.error('Share generation failed:', error);
            toast({
                title: 'Error generating card',
                description: 'Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsGeneratingShare(false);
        }
    }, [createShareAsset, toast]);

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

    const handleDownloadShare = useCallback(() => {
        if (!shareAsset) return;

        try {
            if (downloadAttributeSupported) {
                const link = document.createElement('a');
                link.href = shareAsset.dataUrl;
                link.download = `the-quantum-cat-${shareFormat}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(shareAsset.dataUrl, '_blank', 'noopener,noreferrer');
            }

            rewardShare();
            setHasShared(true);
            playFeedback('celebration-magic');
            toast({
                title: 'Card saved! 📥',
                description: '10 Fish Points awarded. Share it with your friends!',
            });
        } catch (error) {
            console.error('Failed to download share card:', error);
            toast({
                title: 'Download failed',
                description: 'Try taking a screenshot or long-pressing the preview.',
                variant: 'destructive',
            });
        }
    }, [shareAsset, downloadAttributeSupported, shareFormat, rewardShare, toast]);

    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setHasCopiedLink(true);
            playFeedback('click-1');
            toast({
                title: 'Link copied! 📋',
                description: 'Share https://thequantumcat.app with your friends!',
            });
            rewardShare();
            setHasShared(true);
            setTimeout(() => setHasCopiedLink(false), 2500);
        } catch {
            toast({
                title: 'Failed to copy link',
                description: 'Please copy https://thequantumcat.app manually.',
                variant: 'destructive',
            });
        }
    }, [rewardShare, toast]);

    const handleWhatsAppShare = useCallback(() => {
        const text = `${shareText}\n${shareUrl}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        rewardShare();
        setHasShared(true);
        playFeedback('celebration-magic');
        toast({
            title: 'Opening WhatsApp! 💬',
            description: '+10 Fish Points awarded!',
        });
    }, [shareText, rewardShare, toast]);

    const handleXShare = useCallback(() => {
        const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent('TheQuantumCat,SchrodingersCat')}`;
        window.open(xUrl, '_blank', 'noopener,noreferrer');
        rewardShare();
        setHasShared(true);
        playFeedback('celebration-magic');
        toast({
            title: 'Opening X (Twitter)! 🐦',
            description: '+10 Fish Points awarded!',
        });
    }, [shareText, rewardShare, toast]);

    const handleInstagramShare = useCallback(async () => {
        if (shareAsset && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            try {
                if (navigator.canShare && navigator.canShare({ files: [shareAsset.file] })) {
                    await navigator.share({
                        files: [shareAsset.file],
                        title: 'The Quantum Cat',
                        text: shareText,
                        url: shareUrl,
                    });
                    rewardShare();
                    setHasShared(true);
                    playFeedback('celebration-magic');
                    toast({
                        title: 'Shared!',
                        description: '+10 Fish Points awarded!',
                    });
                    return;
                }
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }
                console.warn('Native share with file failed, proceeding to fallback:', error);
            }
        }

        // Fallback for Instagram (save card and copy text)
        if (shareAsset) {
            handleDownloadShare();
            try {
                await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                toast({
                    title: 'Ready for Instagram! 📸',
                    description: 'Image saved and caption copied! Open Instagram to post.',
                });
            } catch {
                toast({
                    title: 'Image saved! 📸',
                    description: 'Open Instagram and share the card from your photos!',
                });
            }
        }
    }, [shareAsset, shareText, rewardShare, handleDownloadShare, toast]);

    const handleNativeShare = useCallback(async () => {
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
            const canShareFile = typeof navigator.canShare === 'function' && navigator.canShare({ files: [shareAsset.file] });
            if (canShareFile) {
                await navigator.share({
                    title: 'The Quantum Cat',
                    text: shareText,
                    files: [shareAsset.file],
                    url: shareUrl,
                });
            } else {
                await navigator.share({
                    title: 'The Quantum Cat',
                    text: shareText,
                    url: shareUrl,
                });
            }

            rewardShare();
            setHasShared(true);
            playFeedback('celebration-magic');
            toast({
                title: 'Shared successfully! 🎉',
                description: '10 Fish Points awarded.',
            });
            setIsShareDialogOpen(false);
            setShareAsset(null);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }

            console.error('Native share failed:', error);
            toast({
                title: 'Share unavailable',
                description: 'Try saving the image and sharing it manually.',
                variant: 'destructive',
            });
        }
    }, [shareAsset, nativeShareAvailable, shareText, rewardShare, toast]);

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
                    {/* Hidden Share Cards Container - off-screen snapshot source */}
                    <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0 overflow-hidden" aria-hidden="true">
                        <div ref={storyRef} style={{ width: '540px', height: '960px' }}>
                            <ShareCard catState={catState} message={message} boxSkin={selectedSkin} format="story" userName={userNickname} />
                        </div>
                        <div ref={squareRef} style={{ width: '600px', height: '600px' }}>
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
                        <DialogContent className="max-w-sm sm:max-w-md max-h-[92vh] overflow-y-auto flex flex-col gap-0 p-0 rounded-3xl border border-border/60 bg-background/95 backdrop-blur-md shadow-2xl">
                            <DialogHeader className="p-5 pb-2 text-center sm:text-left">
                                <DialogTitle className="text-xl font-headline tracking-wide flex items-center gap-2 justify-center sm:justify-start">
                                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                    Share Your Destiny
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    Share your Quantum Message and earn <strong className="text-primary font-bold">+10 Fish Points</strong>! 🐟
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-5 pt-2 flex flex-col gap-3">
                                <Tabs defaultValue="story" value={shareFormat} onValueChange={handleFormatChange} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-3 rounded-2xl p-1 bg-muted/60">
                                        <TabsTrigger value="story" className="rounded-xl font-semibold text-xs py-1.5 transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            Story (9:16)
                                        </TabsTrigger>
                                        <TabsTrigger value="square" className="rounded-xl font-semibold text-xs py-1.5 transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            Post (1:1)
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Card Preview Container */}
                                    <div className="relative mx-auto flex items-center justify-center rounded-2xl border border-border/40 bg-black/5 dark:bg-white/5 p-2 shadow-inner overflow-hidden min-h-[220px] max-h-[250px] w-full">
                                        {isGeneratingShare && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/75 backdrop-blur-sm z-20">
                                                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                                                <span className="text-xs font-semibold text-muted-foreground animate-pulse">Crafting quantum card…</span>
                                            </div>
                                        )}

                                        {shareAsset ? (
                                            <div
                                                className="relative mx-auto h-[210px] transition-all duration-300"
                                                style={{
                                                    width: shareFormat === 'story' ? '118px' : '210px',
                                                    aspectRatio: shareFormat === 'story' ? '9/16' : '1/1',
                                                }}
                                            >
                                                <Image
                                                    src={shareAsset.dataUrl}
                                                    alt="Quantum Destiny Preview"
                                                    fill
                                                    unoptimized
                                                    className="object-contain rounded-lg shadow-md"
                                                />
                                            </div>
                                        ) : (
                                            !isGeneratingShare && (
                                                <span className="text-muted-foreground text-xs">Preview unavailable</span>
                                            )
                                        )}
                                    </div>

                                    {/* Primary 1-Click Social Sharing Actions */}
                                    <div className="mt-3.5 flex flex-col gap-2">
                                        {/* WhatsApp */}
                                        <Button
                                            onClick={handleWhatsAppShare}
                                            disabled={!shareAsset || isGeneratingShare}
                                            className="w-full rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 h-10 text-sm"
                                        >
                                            <WhatsAppIcon className="h-4 w-4 fill-current" />
                                            <span>Share on WhatsApp</span>
                                        </Button>

                                        {/* X (Twitter) */}
                                        <Button
                                            onClick={handleXShare}
                                            disabled={!shareAsset || isGeneratingShare}
                                            className="w-full rounded-2xl bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 h-10 text-sm"
                                        >
                                            <XTwitterIcon className="h-3.5 w-3.5 fill-current" />
                                            <span>Post to X (Twitter)</span>
                                        </Button>

                                        {/* Instagram */}
                                        <Button
                                            onClick={handleInstagramShare}
                                            disabled={!shareAsset || isGeneratingShare}
                                            className="w-full rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-semibold shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2 h-10 text-sm"
                                        >
                                            <InstagramIcon className="h-4 w-4 fill-current" />
                                            <span>Share to Instagram</span>
                                        </Button>

                                        {/* Secondary Actions: Copy Link & Save Image */}
                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <Button
                                                variant="outline"
                                                onClick={handleCopyLink}
                                                className="rounded-2xl border-border/60 hover:bg-muted/50 font-medium text-xs flex items-center justify-center gap-1.5 h-9"
                                            >
                                                {hasCopiedLink ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>Copy Link</span>
                                                    </>
                                                )}
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={handleDownloadShare}
                                                disabled={!shareAsset || isGeneratingShare}
                                                className="rounded-2xl border-border/60 hover:bg-muted/50 font-medium text-xs flex items-center justify-center gap-1.5 h-9"
                                            >
                                                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>Save Image</span>
                                            </Button>
                                        </div>

                                        {/* Device Share Sheet (Native fallback) */}
                                        {nativeShareAvailable && (
                                            <Button
                                                variant="ghost"
                                                onClick={handleNativeShare}
                                                disabled={!shareAsset || isGeneratingShare}
                                                className="w-full rounded-xl text-xs text-muted-foreground hover:text-foreground h-7"
                                            >
                                                <Share2 className="h-3 w-3 mr-1" />
                                                More sharing options…
                                            </Button>
                                        )}
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