
'use client';

import { useState, useEffect, useCallback, useRef, useReducer } from 'react'; // Added useReducer import // Added useReducer import
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

const MESSAGE_GENERATION_TIMEOUT_MS = 6500;

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



export function useCatLogic({ onInteraction, setRevealedCatId, onCatReveal, onDailyLock }: {
    onInteraction?: () => void;
    setRevealedCatId?: (id: string | null) => void;
    onCatReveal: (catId: string, message: string) => void;
    onDailyLock?: () => void;
}) {
    const [catState, setCatState] = useState<CatState>({ outcome: 'initial' });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealedCatName, setRevealedCatName] = useState<string | null>(null);

    const { recordObservation } = useBadgeProgress();
    const { unlockCat } = useCatCollection();
    const { addPoints } = usePoints();
    const { selectedSkin } = useBoxSkin();
    const { setTheme } = useTheme();
    const { user, userData, setUserData } = useAuth();

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

    const handleBoxClick = async (options?: { ignoreLock?: boolean }) => {
        console.log('handleBoxClick called');
        console.log({ isLoading, outcome: catState.outcome, isRevealing });

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

        const randomState = Math.random();
        let determinedOutcome: Exclude<CatOutcome, 'initial'>;

        if (randomState < 0.47) {
            determinedOutcome = 'alive';
        } else if (randomState < 0.94) {
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
                    if (!options?.ignoreLock) {
                        const now = new Date();
                        setUserData(prev => ({ ...prev, lastBoxOpenDate: now.toISOString() }));
                        setIsDailyLocked(true);
                        setNextAvailableAt(getNextMidnight(now).getTime());
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
    };
}
