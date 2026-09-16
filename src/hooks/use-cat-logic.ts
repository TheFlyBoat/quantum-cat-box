'use client';

import { useState, useEffect, useCallback, useRef, useMemo, useSyncExternalStore } from 'react';
import { CatState, CatOutcome } from '@/lib/types';
import { useBadgeProgress } from '@/context/badge-progress-context';
import { useCatCollection } from '@/context/cat-collection-context';
import { usePoints } from '@/context/points-context';
import { generateCatMessage } from '@/ai/flows/generate-cat-message';
import fallbackMessages from '@/lib/fallback-messages.json';
import catData from '@/lib/cat-data.json';
import { playFeedback } from '@/lib/audio';
import { useBoxSkin } from '@/context/box-skin-context';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/auth-context';
import { saveUserData, getSkinPower } from '@/lib/user-data';
import { useToast } from '@/hooks/use-toast';
import { useShare, type ShareAsset } from './use-share';

type OutcomePool = { title: string; cats: { id: string; rarity: number }[] };

const allCats = catData.cats as { id: string; name: string; description: string; type: string; points: number }[];

const normalizeOutcome = (type: string | undefined): 'alive' | 'dead' | 'paradox' | null => {
    if (!type) return null;
    const lowered = type.toLowerCase();
    if (lowered === 'alive' || lowered === 'dead' || lowered === 'paradox') {
        return lowered;
    }
    return null;
};

const fallbackOutcomes: Record<'alive', OutcomePool> & Record<'dead', OutcomePool> & Record<'paradox', OutcomePool> = (() => {
    const base: Record<'alive' | 'dead' | 'paradox', OutcomePool> = {
        alive: { title: 'Alive', cats: [] },
        dead: { title: 'Dead', cats: [] },
        paradox: { title: 'Paradox', cats: [] },
    };

    allCats.forEach(cat => {
        const normalized = normalizeOutcome(cat.type);
        if (!normalized) {
            return;
        }
        const rarity = Number.isFinite(cat.points) && cat.points > 0 ? cat.points : 1;
        base[normalized].cats.push({ id: cat.id, rarity });
    });

    const defaultCat = allCats[0];
    (Object.keys(base) as Array<'alive' | 'dead' | 'paradox'>).forEach(key => {
        if (base[key].cats.length === 0 && defaultCat) {
            base[key].cats.push({ id: defaultCat.id, rarity: 1 });
        }
    });

    return base;
})();

const rawOutcomes = (catData as { outcomes?: Record<string, OutcomePool> }).outcomes;

const getOutcomePool = (outcome: 'alive' | 'dead' | 'paradox'): OutcomePool => {
    const configured = rawOutcomes?.[outcome];
    if (configured && Array.isArray(configured.cats) && configured.cats.length > 0) {
        return configured;
    }
    return fallbackOutcomes[outcome];
};

const MESSAGE_GENERATION_TIMEOUT_MS = 10000;

type FallbackMessageEntry = string | { message: string };

const rawFallbackMessages = Array.isArray(fallbackMessages)
    ? (fallbackMessages as FallbackMessageEntry[])
    : ((fallbackMessages as { messages?: FallbackMessageEntry[] }).messages ?? []);

const FALLBACK_MESSAGE_POOL: FallbackMessageEntry[] = Array.isArray(rawFallbackMessages)
    ? rawFallbackMessages
    : [];

const DEFAULT_FALLBACK_MESSAGE = 'Embrace the mystery beyond the box.';

const pickFallbackMessage = () => {
    if (!FALLBACK_MESSAGE_POOL.length) {
        return DEFAULT_FALLBACK_MESSAGE;
    }
    const selection = FALLBACK_MESSAGE_POOL[Math.floor(Math.random() * FALLBACK_MESSAGE_POOL.length)];
    if (typeof selection === 'string') {
        const trimmed = selection.trim();
        return trimmed.length ? trimmed : DEFAULT_FALLBACK_MESSAGE;
    }
    if (selection && typeof selection.message === 'string') {
        const trimmed = selection.message.trim();
        return trimmed.length ? trimmed : DEFAULT_FALLBACK_MESSAGE;
    }
    return DEFAULT_FALLBACK_MESSAGE;
};

const getStartOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getNextMidnight = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

const emptySubscribe = () => () => {};

export function useCatLogic({
    onInteraction,
    setRevealedCatId,
    onCatReveal,
    onDailyLock,
    onShareAssetCreated,
}: {
    onInteraction?: () => void;
    setRevealedCatId?: (id: string | null) => void;
    onCatReveal: (catId: string, message: string) => void;
    onDailyLock?: () => void;
    onShareAssetCreated: (asset: ShareAsset) => void;
}) {
    const [catState, setCatState] = useState<CatState>({ outcome: 'initial' });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealedCatName, setRevealedCatName] = useState<string | null>(null);

    const isMounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const { recordObservation } = useBadgeProgress();
    const { unlockCat } = useCatCollection();
    const { addPoints } = usePoints();
    const { selectedSkin } = useBoxSkin();
    const { setTheme } = useTheme();
    const { user, userData, setUserData, storageMode } = useAuth();
    const { toast } = useToast();

    const [currentTime, setCurrentTime] = useState(() => Date.now());

    useEffect(() => {
        // Periodic check to cleanly transition lock status when midnight passes
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Derive daily lock from userData with SSR hydration safety
    const { isDailyLocked, nextAvailableAt } = useMemo(() => {
        if (!isMounted || !userData?.lastBoxOpenDate) {
            return { isDailyLocked: false, nextAvailableAt: null };
        }

        const now = new Date(currentTime);
        const lastOpenDate = new Date(userData.lastBoxOpenDate);
        if (isNaN(lastOpenDate.getTime())) {
            return { isDailyLocked: false, nextAvailableAt: null };
        }

        const lastOpenDateStr = lastOpenDate.toDateString();
        const todayStr = now.toDateString();

        if (lastOpenDateStr === todayStr) {
            return {
                isDailyLocked: true,
                nextAvailableAt: getNextMidnight(now).getTime(),
            };
        }

        return { isDailyLocked: false, nextAvailableAt: null };
    }, [isMounted, userData, currentTime]);

    // Backward compatible callback
    const refreshDailyLock = useCallback(() => {
        setCurrentTime(Date.now());
    }, []);

    // FIX: hook must be at top level of the custom hook, not inside handleBoxClick
    const messageReportedRef = useRef(false);

    useEffect(() => {
        if (setRevealedCatId) {
            setRevealedCatId(catState.catId || null);
        }
        if (catState.catId === 'breu') {
            setTheme('dark');
        } else {
            const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
            if (storedTheme !== 'dark') {
                setTheme(storedTheme || 'light');
            }
        }
    }, [catState.catId, setRevealedCatId, setTheme]);

    const handleBoxClick = async (options?: { ignoreLock?: boolean }) => {
        console.log('handleBoxClick called');
        console.log({ isLoading, outcome: catState.outcome, isRevealing });

        if (isDailyLocked && !options?.ignoreLock) {
            onDailyLock?.();
            playFeedback('error-1');
            return;
        }

        if (isLoading || catState.outcome !== 'initial' || isRevealing) {
            console.log('Box click blocked by loading/revealing state');
            return;
        }

        console.log('Box click proceeding');

        onInteraction?.();

        playFeedback('click-1');

        setIsRevealing(true);
        setMessage('');
        setRevealedCatName(null);

        const activePower = getSkinPower(selectedSkin);

        // Calculate outcome probabilities based on active box skin
        let aliveRate = 0.47;
        let deadRate = 0.47;
        let paradoxRate = 0.06;

        if (selectedSkin === 'cardboard') {
            // Cardboard: 64% Alive, 30% Dead, 6% Paradox (Floor guaranteed)
            aliveRate = 0.64;
            deadRate = 0.30;
            paradoxRate = 0.06;
        } else if (selectedSkin === 'tardis') {
            // Time Capsule: 18% Paradox, 41% Alive, 41% Dead
            paradoxRate = 0.18;
            aliveRate = 0.41;
            deadRate = 0.41;
        } else if (selectedSkin === 'galaxy') {
            // Galaxy: 15% Paradox, 42.5% Alive, 42.5% Dead
            paradoxRate = 0.15;
            aliveRate = 0.425;
            deadRate = 0.425;
        }

        // Guaranteed Paradox Floor (minimum 6% across all boxes)
        paradoxRate = Math.max(0.06, paradoxRate);

        const randomState = Math.random();
        let determinedOutcome: Exclude<CatOutcome, 'initial'>;

        if (randomState < aliveRate) {
            determinedOutcome = 'alive';
        } else if (randomState < aliveRate + deadRate) {
            determinedOutcome = 'dead';
        } else {
            determinedOutcome = 'paradox';
        }

        const outcomeInfo = getOutcomePool(determinedOutcome);
        if (!outcomeInfo?.cats?.length) {
            console.error(`No cats configured for outcome "${determinedOutcome}". Falling back to default.`);
            setIsRevealing(false);
            setIsLoading(false);
            return;
        }

        // Apply skin-based weights (Crystal: double weight on uncollected cats; Stone: triple weight on relic cats)
        const uncollectedSet = new Set(userData?.unlockedCats ?? []);
        const weightedCats = outcomeInfo.cats.map(catItem => {
            let weight = catItem.rarity;
            if (selectedSkin === 'crystal' && !uncollectedSet.has(catItem.id)) {
                weight *= 2;
            } else if (selectedSkin === 'stone' && determinedOutcome === 'dead') {
                if (catItem.id === 'catankhamun' || catItem.id === 'pharaoh') {
                    weight *= 3;
                }
            }
            return { id: catItem.id, rarity: weight };
        });

        const totalRarity = weightedCats.reduce((sum, cat) => sum + cat.rarity, 0);
        let randomRarity = Math.random() * totalRarity;
        let selectedCatId: string | undefined;

        for (const cat of weightedCats) {
            randomRarity -= cat.rarity;
            if (randomRarity <= 0) {
                selectedCatId = cat.id;
                break;
            }
        }
        if (!selectedCatId) {
            selectedCatId = weightedCats[weightedCats.length - 1].id;
        }

        // Check for Double Cat (Time Capsule / TARDIS 3% timeline split)
        let secondaryCatId: string | undefined;
        let secondaryCat: typeof allCats[number] | undefined;
        if (selectedSkin === 'tardis' && Math.random() < 0.03) {
            const alternateCats = outcomeInfo.cats.filter(c => c.id !== selectedCatId);
            const candidatePool = alternateCats.length > 0 ? alternateCats : allCats;
            const pick = candidatePool[Math.floor(Math.random() * candidatePool.length)];
            if (pick) {
                secondaryCatId = pick.id;
                secondaryCat = allCats.find(c => c.id === secondaryCatId);
            }
        }

        recordObservation(selectedCatId, determinedOutcome);
        const cat = allCats.find(c => c.id === selectedCatId);
        if (cat) {
            unlockCat(cat.id, { celebrateImmediately: false });
        }

        if (secondaryCatId && secondaryCat) {
            recordObservation(secondaryCatId, determinedOutcome);
            unlockCat(secondaryCat.id, { celebrateImmediately: false });
        }

        // Calculate Fish Points with active box powers
        const basePoints = (cat?.points ?? 1) + (secondaryCat?.points ?? 0);
        let bonusPoints = 0;
        let powerNotification: string | null = null;

        if (selectedSkin === 'black-wooden' && determinedOutcome === 'dead') {
            bonusPoints = cat?.points ?? 2; // Doubles Dead Cat points (2 -> 4)
            powerNotification = 'Necro Harvest: Extra Dead Cat Points!';
        } else if (selectedSkin === 'plush' && determinedOutcome === 'alive') {
            bonusPoints = 3; // +3 on Alive Cat (1 -> 4)
            powerNotification = 'Cozy Comfort: Extra Alive Cat Points!';
        } else if (selectedSkin === 'stone' && determinedOutcome === 'dead') {
            bonusPoints = 3; // +3 on Dead Cat (2 -> 5)
            powerNotification = 'Ancient Preservation: Extra Dead Cat Points!';
        } else if (selectedSkin === 'circuit-board') {
            bonusPoints = 3; // +3 flat on all reveals
            powerNotification = 'Algorithmic Yield: Bonus Fish Points!';
        } else if (selectedSkin === 'special-xk6' && Math.random() < 0.25) {
            bonusPoints = 5; // 25% Critical +5 points
            powerNotification = 'Quantum Overclock: Critical Collapse!';
        } else if (selectedSkin === 'galaxy' && determinedOutcome === 'paradox') {
            bonusPoints = 5; // +5 on Paradox reveals (5 -> 10)
            powerNotification = 'Cosmic Singularity: Extra Paradox Points!';
        } else if (selectedSkin === 'crystal' && cat && !uncollectedSet.has(cat.id)) {
            bonusPoints = 3; // +3 on discovering new cat
            powerNotification = 'Collector’s Clairvoyance: New Cat Discovery!';
        }

        if (secondaryCat) {
            powerNotification = powerNotification
                ? `${powerNotification} & Double Cat Timeline Rift!`
                : 'Temporal Rift: Double Cat Timeline Split!';
        }

        const totalEarnedPoints = basePoints + bonusPoints;
        const isCarbonFreeReroll = selectedSkin === 'carbon' && Math.random() < 0.20;

        const messageInput = {
            catId: selectedCatId!,
            catName: cat?.name ?? 'Quantum Cat',
            catType: cat?.type ?? (determinedOutcome.charAt(0).toUpperCase() + determinedOutcome.slice(1)),
            catDescription: cat?.description,
        };

        const resolvedCatId = selectedCatId!;

        // reset ref for this interaction
        messageReportedRef.current = false;

        const reportMessage = (candidate?: string) => {
            if (messageReportedRef.current) return;
            messageReportedRef.current = true;

            const trimmed = typeof candidate === 'string' ? candidate.trim() : '';
            const finalMessage = trimmed.length ? trimmed : pickFallbackMessage();
            setMessage(finalMessage);
            onCatReveal(resolvedCatId, finalMessage);
        };

        const fallbackTimer = setTimeout(() => {
            reportMessage();
        }, MESSAGE_GENERATION_TIMEOUT_MS);

        generateCatMessage(messageInput)
            .then(response => {
                clearTimeout(fallbackTimer);
                if (response && typeof response.message === 'string') {
                    reportMessage(response.message);
                } else {
                    reportMessage();
                }
            })
            .catch(error => {
                clearTimeout(fallbackTimer);
                console.error('AI message generation failed:', error);
                reportMessage();
            });

        setTimeout(() => {
            setIsRevealing(false);
            setIsLoading(true);

            switch (selectedSkin) {
                case 'carbon':
                    playFeedback('reveal-carbon');
                    break;
                case 'cardboard':
                    playFeedback('reveal-cardboard');
                    break;
                default:
                    playFeedback('reveal-default');
                    break;
            }

            setTimeout(() => {
                setIsLoading(false);
                setCatState({ outcome: determinedOutcome, catId: undefined });

                setTimeout(() => {
                    setCatState({
                        outcome: determinedOutcome,
                        catId: selectedCatId,
                        secondaryCatId: secondaryCatId,
                        powerTriggered: powerNotification ?? undefined,
                    });
                }, 300);

                setTimeout(() => {
                    if (cat) {
                        const displayName = secondaryCat ? `${cat.name} & ${secondaryCat.name}` : cat.name;
                        setRevealedCatName(displayName);
                        addPoints(totalEarnedPoints);
                    }

                    if (powerNotification) {
                        toast({
                            title: '⚡ Box Power Activated!',
                            description: `${powerNotification} (+${totalEarnedPoints} Fish Points earned!)`,
                        });
                    }

                    if (isCarbonFreeReroll) {
                        playFeedback('celebration-magic');
                        toast({
                            title: '⚡ Kinetic Momentum!',
                            description: 'The Carbon box prevented lockdown! Enjoy a free second reveal!',
                        });
                    }

                    if (!options?.ignoreLock && !isCarbonFreeReroll) {
                        const now = new Date();
                        const isoDate = now.toISOString();
                        setUserData(prev => ({ ...prev, lastBoxOpenDate: isoDate }));
                        if (storageMode === 'cloud' && user && user !== 'guest') {
                            void saveUserData(user.uid, { lastBoxOpenDate: isoDate });
                        }
                    }
                }, 800);
            }, 1400);
        }, 1500);
    };

    const resetState = useCallback(() => {
        if (setRevealedCatId) {
            setRevealedCatId(null);
        }
        if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
            const storedTheme = localStorage.getItem('theme');
            setTheme(storedTheme || 'light');
        }
        setCatState({ outcome: 'initial' });
        setMessage('');
        setRevealedCatName(null);
    }, [setRevealedCatId, setTheme]);

    const handleReset = useCallback(
        (options?: { ignoreLock?: boolean }) => {
            onInteraction?.();
            playFeedback('click-2');
            if (!isDailyLocked || options?.ignoreLock) {
                resetState();
            }
        },
        [onInteraction, resetState, isDailyLocked],
    );

    const overrideDailyLock = useCallback(() => {
        setUserData(prev => {
            if (!prev) return prev;
            const updated = { ...prev };
            delete updated.lastBoxOpenDate;
            return updated;
        });
        if (storageMode === 'cloud' && user && user !== 'guest') {
            void saveUserData(user.uid, { lastBoxOpenDate: '' });
        }
        resetState();
    }, [resetState, setUserData, storageMode, user]);

    const rechargeCost = selectedSkin === 'steampunk' ? 5 : 10;

    return {
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
        rechargeCost,
        refreshDailyLock,
        overrideDailyLock,
    };
}
