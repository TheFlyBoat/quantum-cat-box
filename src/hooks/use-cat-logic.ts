
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CatState, CatOutcome } from '@/lib/types';
import { useAchievements } from '@/context/achievements-context';
import { useCatCollection } from '@/context/cat-collection-context';
import { usePoints } from '@/context/points-context';
import { generateCatMessage } from '@/ai/flows/generate-cat-message';
import fallbackMessages from '@/lib/fallback-messages.json';
import catData from '@/lib/cat-data.json';
import { playFeedback } from '@/lib/audio';
import { useBoxSkin } from '@/context/box-skin-context';
import { useTheme } from 'next-themes';

const outcomesData = catData.outcomes as Record<CatOutcome, { title: string; cats: { id: string, rarity: number }[] }>;
const allCats = catData.cats as {id: string, name: string, description: string, type: string, points: number}[];

const LAST_OPEN_STORAGE_KEY = 'quantum-cat-last-open';
const MESSAGE_GENERATION_TIMEOUT_MS = 6500;

const FALLBACK_MESSAGE_POOL: string[] = Array.isArray(fallbackMessages)
    ? (fallbackMessages as unknown as string[])
    : ((fallbackMessages as { messages?: string[] }).messages ?? []);

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
    if (selection && typeof selection === 'object' && 'message' in selection && typeof selection.message === 'string') {
        const trimmed = selection.message.trim();
        return trimmed.length ? trimmed : DEFAULT_FALLBACK_MESSAGE;
    }
    return DEFAULT_FALLBACK_MESSAGE;
};

const getStartOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getNextMidnight = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

export function useCatLogic({ onInteraction, setRevealedCatId, onCatReveal }: {
    onInteraction?: () => void;
    setRevealedCatId?: (id: string | null) => void;
    onCatReveal: (catId: string, message: string) => void;
}) {
    const [catState, setCatState] = useState<CatState>({ outcome: 'initial' });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealedCatName, setRevealedCatName] = useState<string | null>(null);
    const [isDailyLocked, setIsDailyLocked] = useState(false);
    const [nextAvailableAt, setNextAvailableAt] = useState<number | null>(null);
    const unlockTimerRef = useRef<number | undefined>(undefined);

    const { recordObservation } = useAchievements();
    const { unlockCat } = useCatCollection();
    const { addPoints } = usePoints();
    const { selectedSkin } = useBoxSkin();
    const { setTheme } = useTheme();

    useEffect(() => {
        if (setRevealedCatId) {
            setRevealedCatId(catState.catId || null);
        }
        if (catState.catId === 'breu') {
            setTheme('dark');
        } else {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme !== 'dark') {
                setTheme(storedTheme || 'light');
            }
        }
    }, [catState.catId, setRevealedCatId, setTheme]);

    const lockForToday = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            const now = new Date();
            localStorage.setItem(LAST_OPEN_STORAGE_KEY, now.toISOString());
            setIsDailyLocked(true);
            setNextAvailableAt(getNextMidnight(now).getTime());
        } catch (error) {
            console.warn('Unable to persist daily lock state', error);
        }
    }, []);

    const refreshDailyLock = useCallback(() => {
        if (typeof window === 'undefined') {
            setIsDailyLocked(false);
            setNextAvailableAt(null);
            return;
        }

        let stored: string | null = null;
        try {
            stored = localStorage.getItem(LAST_OPEN_STORAGE_KEY);
        } catch (error) {
            console.warn('Unable to read daily lock state', error);
        }

        const now = new Date();
        const todayStart = getStartOfDay(now);
        let locked = false;

        if (stored) {
            const parsed = new Date(stored);
            if (!Number.isNaN(parsed.getTime())) {
                const lastDayStart = getStartOfDay(parsed);
                locked = lastDayStart.getTime() === todayStart.getTime();
            }
        }

        setIsDailyLocked(locked);
        setNextAvailableAt(locked ? getNextMidnight(now).getTime() : null);
    }, []);

    useEffect(() => {
        let timeoutId: number | undefined;

        if (typeof window !== 'undefined') {
            timeoutId = window.setTimeout(() => {
                refreshDailyLock();
            }, 0);
        }

        return () => {
            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [refreshDailyLock]);

    useEffect(() => {
        if (unlockTimerRef.current !== undefined) {
            window.clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = undefined;
        }

        if (!isDailyLocked || !nextAvailableAt) {
            return;
        }

        const now = Date.now();
        const delay = nextAvailableAt - now;

        if (delay <= 0) {
            if (typeof window !== 'undefined') {
                window.setTimeout(() => {
                    refreshDailyLock();
                }, 0);
            }
            return;
        }

        unlockTimerRef.current = window.setTimeout(() => {
            refreshDailyLock();
        }, delay + 1000);

        return () => {
            if (unlockTimerRef.current !== undefined) {
                window.clearTimeout(unlockTimerRef.current);
                unlockTimerRef.current = undefined;
            }
        };
    }, [isDailyLocked, nextAvailableAt, refreshDailyLock]);

    useEffect(() => {
        return () => {
            if (unlockTimerRef.current !== undefined) {
                window.clearTimeout(unlockTimerRef.current);
            }
        };
    }, []);

    const handleBoxClick = async (options?: { ignoreLock?: boolean }) => {
        if (isLoading || catState.outcome !== 'initial' || isRevealing) return;
        if (isDailyLocked && !options?.ignoreLock) {
            playFeedback('haptic-3');
            return;
        }

        onInteraction?.();

        playFeedback('click-1');
        if (!options?.ignoreLock) {
            lockForToday();
        }
        setIsRevealing(true);
        setMessage('');
        setRevealedCatName(null);

        const randomState = Math.random();
        let determinedOutcome: CatOutcome;

        if (randomState < 0.47) {
            determinedOutcome = 'alive';
        } else if (randomState < 0.94) {
            determinedOutcome = 'dead';
        } else {
            determinedOutcome = 'paradox';
        }

        const outcomeInfo = outcomesData[determinedOutcome];
        const totalRarity = outcomeInfo.cats.reduce((sum, cat) => sum + cat.rarity, 0);
        let randomRarity = Math.random() * totalRarity;
        let selectedCatId: string | undefined;

        for (const cat of outcomeInfo.cats) {
            randomRarity -= cat.rarity;
            if (randomRarity <= 0) {
                selectedCatId = cat.id;
                break;
            }
        }
        if (!selectedCatId) {
            selectedCatId = outcomeInfo.cats[outcomeInfo.cats.length - 1].id;
        }

        recordObservation(selectedCatId, determinedOutcome);
        const cat = allCats.find(c => c.id === selectedCatId);
        if (cat) {
            unlockCat(cat.id, { celebrateImmediately: false });
        }

        const messageInput = {
            catId: selectedCatId!,
            catName: cat?.name ?? 'Quantum Cat',
            catType: cat?.type ?? (determinedOutcome.charAt(0).toUpperCase() + determinedOutcome.slice(1)),
            catDescription: cat?.description,
        };

        const resolvedCatId = selectedCatId!;
        let hasReportedMessage = false;

        const reportMessage = (candidate?: string) => {
            const trimmed = typeof candidate === 'string' ? candidate.trim() : '';
            const finalMessage = trimmed.length ? trimmed : pickFallbackMessage();
            setMessage(finalMessage);
            if (!hasReportedMessage) {
                onCatReveal(resolvedCatId, finalMessage);
                hasReportedMessage = true;
            }
        };

        let fallbackTimer: number | undefined;

        const clearFallbackTimer = () => {
            if (fallbackTimer !== undefined && typeof window !== 'undefined') {
                window.clearTimeout(fallbackTimer);
                fallbackTimer = undefined;
            }
        };

        if (typeof window !== 'undefined') {
            fallbackTimer = window.setTimeout(() => {
                fallbackTimer = undefined;
                if (!hasReportedMessage) {
                    reportMessage();
                }
            }, MESSAGE_GENERATION_TIMEOUT_MS);
        }

        generateCatMessage(messageInput).then(response => {
            clearFallbackTimer();
            if (!response || typeof response.message !== 'string') {
                reportMessage();
                return;
            }
            reportMessage(response.message);
        }).catch(error => {
            clearFallbackTimer();
            console.error("AI message generation failed:", error);
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
                    setCatState({ outcome: determinedOutcome, catId: selectedCatId });
                }, 300);

                setTimeout(() => {
                    if (cat) {
                        setRevealedCatName(cat.name);
                        addPoints(cat.points);
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

    const handleReset = useCallback((options?: { ignoreLock?: boolean }) => {
        onInteraction?.();
        if (isDailyLocked && !options?.ignoreLock) {
            playFeedback('haptic-3');
            return;
        }
        playFeedback('click-2');
        resetState();
    }, [isDailyLocked, onInteraction, resetState]);

    const overrideDailyLock = useCallback(() => {
        onInteraction?.();
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.removeItem(LAST_OPEN_STORAGE_KEY);
            } catch (error) {
                console.warn('Unable to clear daily lock state', error);
            }
        }
        if (unlockTimerRef.current !== undefined) {
            window.clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = undefined;
        }
        setIsDailyLocked(false);
        setNextAvailableAt(null);
        playFeedback('click-2');
        resetState();
    }, [onInteraction, resetState]);

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
        refreshDailyLock,
        overrideDailyLock,
    };
}
