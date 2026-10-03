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
import { catComponentMap } from '@/lib/cat-components';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/auth-context';
import { saveUserData, getSkinPower } from '@/lib/user-data';
import { useToast } from '@/hooks/use-toast';
import { type ShareAsset } from './use-share';
import { trackEvent } from '@/lib/analytics';

type OutcomePool = { title: string; cats: { id: string; rarity: number }[] };

export interface CatDebugInfo {
    index: number;
    id: string;
    name: string;
    type: string;
    outcome: 'alive' | 'dead' | 'paradox';
    points: number;
    description: string;
    tagline?: string;
    hasComponent: boolean;
    toString: () => string;
}

export interface DebugCycleApi {
    readonly total: number;
    readonly allCats: ReadonlyArray<CatDebugInfo>;
    enabled: boolean;
    currentIndex: number;
    targetCatId?: string | null;
    next: (immediate?: boolean) => CatDebugInfo;
    prev: (immediate?: boolean) => CatDebugInfo;
    setCat: (idOrIndex: string | number, immediate?: boolean) => CatDebugInfo | null;
    list: () => CatDebugInfo[];
    setSequentialMode: (enabled?: boolean) => boolean;
    open: (idOrIndex?: string | number) => Promise<void>;
    cycleAll: (intervalMs?: number, loop?: boolean) => void;
    stop: () => void;
    status: () => Record<string, unknown>;
    reset: () => void;
    help: () => void;
    toggle: () => boolean;
    bypassDailyLock: (bypass?: boolean) => boolean;
}

declare global {
    interface Window {
        __DEBUG_CYCLE_CATS__?: DebugCycleApi;
    }
}

const allCats = catData.cats as { id: string; name: string; description: string; type: string; points: number; tagline?: string }[];

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
        // Base selection rarity is decoupled from cat points: uniform base weight of 1 for all variants.
        // Dynamic skin multipliers (Crystal, Stone) apply on top of this uniform base.
        const rarity = 1;
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
    const { resolvedTheme } = useTheme();
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

    // -------------------------------------------------------------------------
    // Developer Override & Debug Cycle State (Development Only)
    // -------------------------------------------------------------------------
    const debugIndexRef = useRef(0);
    const debugOverrideCatIdRef = useRef<string | null>(null);
    const debugSequentialModeRef = useRef(false);
    const debugCycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isDebugModeActive, setIsDebugModeActive] = useState(false);

    // Derive daily lock from userData with SSR hydration safety
    const { isDailyLocked, nextAvailableAt } = useMemo(() => {
        if (process.env.NODE_ENV === 'development' && isDebugModeActive) {
            return { isDailyLocked: false, nextAvailableAt: null };
        }

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
    }, [isMounted, userData, currentTime, isDebugModeActive]);

    // Backward compatible callback
    const refreshDailyLock = useCallback(() => {
        setCurrentTime(Date.now());
    }, []);

    // FIX: hook must be at top level of the custom hook, not inside handleBoxClick
    const messageReportedRef = useRef(false);

    const resetState = useCallback(() => {
        if (setRevealedCatId) {
            setRevealedCatId(null);
        }
        setCatState({ outcome: 'initial' });
        setMessage('');
        setRevealedCatName(null);
    }, [setRevealedCatId]);

    const getCatDebugInfo = useCallback((index: number): CatDebugInfo => {
        const cat = allCats[index];
        const outcome = normalizeOutcome(cat.type) ?? 'alive';
        return {
            index,
            id: cat.id,
            name: cat.name,
            type: cat.type,
            outcome,
            points: cat.points,
            description: cat.description,
            tagline: cat.tagline ?? cat.description,
            hasComponent: Boolean(catComponentMap[cat.id]),
            toString() {
                return this.id;
            },
        };
    }, []);

    const displayCatInstantly = useCallback(
        (cat: (typeof allCats)[number], index: number) => {
            const outcome = normalizeOutcome(cat.type) ?? 'alive';
            setIsLoading(false);
            setIsRevealing(false);
            setCatState({ outcome, catId: cat.id });
            setRevealedCatName(cat.name);
            if (setRevealedCatId) {
                setRevealedCatId(cat.id);
            }
            const tagline = cat.tagline ?? cat.description;
            const debugMsg = `[Debug ${index + 1}/${allCats.length}] ${cat.name} (${cat.type}) — ${tagline}`;
            setMessage(debugMsg);
            onCatReveal(cat.id, debugMsg);
            unlockCat(cat.id, { celebrateImmediately: false });
            recordObservation(cat.id, outcome);
            playFeedback('click-1');
            console.log(
                `%c[DEBUG CATS]%c [${index + 1}/${allCats.length}] %c${cat.name}%c (${cat.id}) | State: ${outcome.toUpperCase()} | Points: ${cat.points} | Component: ${catComponentMap[cat.id] ? '✅' : '❌'}`,
                'background: #A240FF; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
                'color: inherit;',
                'color: #FF809F; font-weight: bold;',
                'color: inherit;',
            );
        },
        [onCatReveal, recordObservation, setRevealedCatId, unlockCat],
    );

    const debugNext = useCallback(
        (immediate?: boolean): CatDebugInfo => {
            debugIndexRef.current = (debugIndexRef.current + 1) % allCats.length;
            const target = allCats[debugIndexRef.current];
            debugOverrideCatIdRef.current = target.id;
            setIsDebugModeActive(true);
            const shouldDisplay = immediate ?? (catState.outcome !== 'initial');
            if (shouldDisplay) {
                displayCatInstantly(target, debugIndexRef.current);
            }
            console.log(`[DEBUG CATS] Next cat #${debugIndexRef.current + 1}/${allCats.length}: ${target.name} (${target.id}) [${target.type}]`);
            return getCatDebugInfo(debugIndexRef.current);
        },
        [catState.outcome, displayCatInstantly, getCatDebugInfo],
    );

    const debugPrev = useCallback(
        (immediate?: boolean): CatDebugInfo => {
            debugIndexRef.current = (debugIndexRef.current - 1 + allCats.length) % allCats.length;
            const target = allCats[debugIndexRef.current];
            debugOverrideCatIdRef.current = target.id;
            setIsDebugModeActive(true);
            const shouldDisplay = immediate ?? (catState.outcome !== 'initial');
            if (shouldDisplay) {
                displayCatInstantly(target, debugIndexRef.current);
            }
            console.log(`[DEBUG CATS] Prev cat #${debugIndexRef.current + 1}/${allCats.length}: ${target.name} (${target.id}) [${target.type}]`);
            return getCatDebugInfo(debugIndexRef.current);
        },
        [catState.outcome, displayCatInstantly, getCatDebugInfo],
    );

    const debugSetCat = useCallback(
        (idOrIndex: string | number, immediate?: boolean): CatDebugInfo | null => {
            let targetIndex = -1;
            if (typeof idOrIndex === 'number') {
                if (idOrIndex >= 0 && idOrIndex < allCats.length) {
                    targetIndex = idOrIndex;
                } else if (idOrIndex === allCats.length) {
                    targetIndex = allCats.length - 1;
                } else {
                    targetIndex = ((idOrIndex % allCats.length) + allCats.length) % allCats.length;
                }
            } else if (typeof idOrIndex === 'string') {
                const query = idOrIndex.trim().toLowerCase();
                targetIndex = allCats.findIndex(c => c.id.toLowerCase() === query);
                if (targetIndex === -1) {
                    targetIndex = allCats.findIndex(c => c.name.toLowerCase() === query);
                }
                if (targetIndex === -1) {
                    const parsed = parseInt(query, 10);
                    if (!isNaN(parsed) && parsed >= 0 && parsed < allCats.length) {
                        targetIndex = parsed;
                    }
                }
            }

            if (targetIndex === -1) {
                console.warn(`[DEBUG CATS] Unknown cat identifier: "${idOrIndex}". Call __DEBUG_CYCLE_CATS__.list() for available IDs.`);
                return null;
            }

            debugIndexRef.current = targetIndex;
            const target = allCats[targetIndex];
            debugOverrideCatIdRef.current = target.id;
            setIsDebugModeActive(true);

            const shouldDisplay = immediate ?? (catState.outcome !== 'initial');
            if (shouldDisplay) {
                displayCatInstantly(target, targetIndex);
            }
            console.log(`[DEBUG CATS] Queued cat #${targetIndex + 1}/${allCats.length}: ${target.name} (${target.id}) [${target.type}]`);
            return getCatDebugInfo(targetIndex);
        },
        [catState.outcome, displayCatInstantly, getCatDebugInfo],
    );

    const debugSetSequentialMode = useCallback((enabled?: boolean): boolean => {
        if (enabled === undefined) {
            debugSequentialModeRef.current = !debugSequentialModeRef.current;
        } else {
            debugSequentialModeRef.current = Boolean(enabled);
        }
        setIsDebugModeActive(debugSequentialModeRef.current);
        console.log(
            `[DEBUG CATS] Sequential opening mode is now ${
                debugSequentialModeRef.current
                    ? 'ENABLED (next: #' + (debugIndexRef.current + 1) + ' ' + allCats[debugIndexRef.current].name + ')'
                    : 'DISABLED (normal random distribution)'
            }`,
        );
        return debugSequentialModeRef.current;
    }, []);

    const debugList = useCallback((): CatDebugInfo[] => {
        console.log('%cQuantum Cat Box — All 36 Cat Variants', 'font-size: 14px; font-weight: bold; color: #A240FF;');
        console.table(
            allCats.map((cat, i) => ({
                '#': i + 1,
                ID: cat.id,
                Name: cat.name,
                Type: cat.type,
                Points: cat.points,
                Component: catComponentMap[cat.id] ? '✅ OK' : '❌ MISSING',
            })),
        );
        return allCats.map((_, i) => getCatDebugInfo(i));
    }, [getCatDebugInfo]);

    const debugStop = useCallback(() => {
        if (debugCycleIntervalRef.current) {
            clearInterval(debugCycleIntervalRef.current);
            debugCycleIntervalRef.current = null;
            console.log('[DEBUG CATS] Auto-cycle stopped.');
        }
    }, []);

    const debugCycleAll = useCallback(
        (intervalMs = 1500, loop = false) => {
            debugStop();
            let count = 0;
            console.log(`[DEBUG CATS] Starting auto-cycle through all ${allCats.length} cats (${intervalMs}ms interval, loop=${loop})...`);
            setIsDebugModeActive(true);
            debugSetCat(debugIndexRef.current, true);

            debugCycleIntervalRef.current = setInterval(() => {
                count++;
                if (!loop && count >= allCats.length) {
                    debugStop();
                    console.log(`%c[DEBUG CATS] Completed cycle of all ${allCats.length} cats!`, 'color: #A9DB4A; font-weight: bold;');
                    return;
                }
                debugNext(true);
            }, intervalMs);
        },
        [debugNext, debugSetCat, debugStop],
    );

    const debugReset = useCallback(() => {
        debugStop();
        debugSequentialModeRef.current = false;
        debugOverrideCatIdRef.current = null;
        debugIndexRef.current = 0;
        setIsDebugModeActive(false);
        resetState();
        console.log('[DEBUG CATS] Reset debug cycle state and closed box.');
    }, [debugStop, resetState]);

    const debugToggle = useCallback((): boolean => {
        const nextVal = !isDebugModeActive;
        setIsDebugModeActive(nextVal);
        if (!nextVal) {
            debugSequentialModeRef.current = false;
            debugOverrideCatIdRef.current = null;
        }
        console.log(`[DEBUG CATS] Developer override ${nextVal ? 'ENABLED' : 'DISABLED'}`);
        return nextVal;
    }, [isDebugModeActive]);

    const debugBypassDailyLock = useCallback((bypass?: boolean): boolean => {
        const nextVal = bypass === undefined ? !isDebugModeActive : Boolean(bypass);
        setIsDebugModeActive(nextVal);
        console.log(`[DEBUG CATS] Daily lock bypass is now ${nextVal ? 'ENABLED' : 'DISABLED'}`);
        return nextVal;
    }, [isDebugModeActive]);

    const debugStatus = useCallback(() => {
        return {
            isDev: process.env.NODE_ENV === 'development',
            enabled: isDebugModeActive || debugSequentialModeRef.current || debugOverrideCatIdRef.current !== null,
            currentIndex: debugIndexRef.current,
            currentCat: getCatDebugInfo(debugIndexRef.current),
            sequentialMode: debugSequentialModeRef.current,
            queuedCatId: debugOverrideCatIdRef.current,
            isAutoCycling: debugCycleIntervalRef.current !== null,
            isDailyLocked,
            totalCats: allCats.length,
        };
    }, [getCatDebugInfo, isDailyLocked, isDebugModeActive]);

    const debugHelp = useCallback(() => {
        console.log(
            `%c🐈 Quantum Cat Box — Developer Debug Cycle API 🐈%c
Available globally on window.__DEBUG_CYCLE_CATS__:

  __DEBUG_CYCLE_CATS__.next()                 Advance to next cat (0..35)
  __DEBUG_CYCLE_CATS__.prev()                 Step back to previous cat
  __DEBUG_CYCLE_CATS__.setCat('schrodinger')  Set next cat by ID or index (0..35)
  __DEBUG_CYCLE_CATS__.open('schrodinger')    Full box-opening simulation (sound, points, reveal)
  __DEBUG_CYCLE_CATS__.setSequentialMode(true) Force box clicks in UI to cycle sequentially
  __DEBUG_CYCLE_CATS__.cycleAll(1500)         Auto-cycle through all 36 cats every 1.5s
  __DEBUG_CYCLE_CATS__.stop()                 Stop auto-cycling
  __DEBUG_CYCLE_CATS__.list()                 Print table of all 36 cats & component status
  __DEBUG_CYCLE_CATS__.status()               Inspect current debug cycle state
  __DEBUG_CYCLE_CATS__.toggle()               Toggle developer override on/off
  __DEBUG_CYCLE_CATS__.bypassDailyLock(true)  Bypass isDailyLocked in dev mode
  __DEBUG_CYCLE_CATS__.reset()                Reset box to closed initial state
  __DEBUG_CYCLE_CATS__.help()                 Print this guide
`,
            'color: #A240FF; font-weight: bold; font-size: 13px;',
            'color: inherit;',
        );
    }, []);

    useEffect(() => {
        if (setRevealedCatId) {
            setRevealedCatId(catState.catId || null);
        }
    }, [catState.catId, setRevealedCatId]);

    // Dudu (breu) Cat is revealed in the dark. Toggle the class directly instead of calling
    // setTheme, which would persist 'dark' as the user's own preference.
    useEffect(() => {
        if (catState.catId !== 'breu' || resolvedTheme === 'dark') return;
        const root = document.documentElement;
        root.classList.add('dark');
        return () => root.classList.remove('dark');
    }, [catState.catId, resolvedTheme]);

    const handleBoxClick = async (options?: { ignoreLock?: boolean }) => {
        const isDev = process.env.NODE_ENV === 'development';
        const isDebugActive = isDev && (
            isDebugModeActive ||
            debugSequentialModeRef.current ||
            debugOverrideCatIdRef.current !== null ||
            (typeof window !== 'undefined' && Boolean(window.__DEBUG_CYCLE_CATS__?.enabled))
        );

        if (isDailyLocked && !options?.ignoreLock && !isDebugActive) {
            onDailyLock?.();
            playFeedback('error-1');
            return;
        }

        if (isLoading || catState.outcome !== 'initial' || isRevealing) {
            return;
        }


        onInteraction?.();

        playFeedback('click-1');

        setIsRevealing(true);
        setMessage('');
        setRevealedCatName(null);

        const activePower = getSkinPower(selectedSkin);

        // In development mode: check for explicit cat override or sequential mode
        let forcedCat: (typeof allCats)[number] | null = null;
        if (isDev) {
            if (debugOverrideCatIdRef.current) {
                const found = allCats.find(c => c.id.toLowerCase() === debugOverrideCatIdRef.current?.toLowerCase());
                if (found) {
                    forcedCat = found;
                }
                if (!debugSequentialModeRef.current) {
                    debugOverrideCatIdRef.current = null;
                }
            } else if (debugSequentialModeRef.current) {
                forcedCat = allCats[debugIndexRef.current];
                debugIndexRef.current = (debugIndexRef.current + 1) % allCats.length;
            }
        }

        let determinedOutcome: Exclude<CatOutcome, 'initial'>;
        let selectedCatId: string | undefined;

        if (forcedCat) {
            determinedOutcome = normalizeOutcome(forcedCat.type) ?? 'alive';
            selectedCatId = forcedCat.id;
        } else {
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

            if (randomState < aliveRate) {
                determinedOutcome = 'alive';
            } else if (randomState < aliveRate + deadRate) {
                determinedOutcome = 'dead';
            } else {
                determinedOutcome = 'paradox';
            }
        }

        const outcomeInfo = getOutcomePool(determinedOutcome);
        if (!outcomeInfo?.cats?.length) {
            console.error(`No cats configured for outcome "${determinedOutcome}". Falling back to default.`);
            setIsRevealing(false);
            setIsLoading(false);
            return;
        }

        const uncollectedSet = new Set(userData?.unlockedCats ?? []);

        if (!selectedCatId) {
            // Apply skin-based weights (Crystal: double weight on uncollected cats; Stone: triple weight on relic cats)
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
        }

        // Check for Double Cat (Time Capsule / TARDIS 3% timeline split)
        let secondaryCatId: string | undefined;
        let secondaryCat: typeof allCats[number] | undefined;
        if (!forcedCat && selectedSkin === 'tardis' && Math.random() < 0.03) {
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

        const reportMessage = (candidate: string | undefined, source: 'ai' | 'fallback', reason?: string) => {
            if (messageReportedRef.current) return;
            messageReportedRef.current = true;

            const trimmed = typeof candidate === 'string' ? candidate.trim() : '';
            const finalMessage = trimmed.length ? trimmed : pickFallbackMessage();
            setMessage(finalMessage);
            onCatReveal(resolvedCatId, finalMessage);
            trackEvent('box_open', {
                outcome: determinedOutcome,
                cat_id: resolvedCatId,
                box_skin: selectedSkin,
                message_source: trimmed.length ? source : 'fallback',
                fallback_reason: reason ?? (trimmed.length ? undefined : 'empty_message'),
            });
        };

        // Last-resort client fallback for network failures; the server answers or falls back sooner.
        const fallbackTimer = setTimeout(() => {
            reportMessage(undefined, 'fallback', 'client_timeout');
        }, MESSAGE_GENERATION_TIMEOUT_MS);

        generateCatMessage(messageInput)
            .then(response => {
                clearTimeout(fallbackTimer);
                reportMessage(response?.message, response?.source ?? 'fallback', response?.reason);
            })
            .catch(error => {
                clearTimeout(fallbackTimer);
                console.error('AI message generation failed:', error);
                reportMessage(undefined, 'fallback', 'network_error');
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

                    if (!options?.ignoreLock && !isCarbonFreeReroll && !isDebugActive) {
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

    // handleBoxClick is recreated every render; read it through a ref so debugOpen stays stable.
    const handleBoxClickRef = useRef(handleBoxClick);
    useEffect(() => {
        handleBoxClickRef.current = handleBoxClick;
    });

    const debugOpen = useCallback(
        async (idOrIndex?: string | number) => {
            if (idOrIndex !== undefined) {
                debugSetCat(idOrIndex, false);
            }
            if (catState.outcome !== 'initial' || isDailyLocked) {
                resetState();
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            await handleBoxClickRef.current?.({ ignoreLock: true });
        },
        [catState.outcome, debugSetCat, isDailyLocked, resetState],
    );

    const debugCycle = useMemo<DebugCycleApi | undefined>(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }
        // Development builds only: the API can unlock cats, so it must never ship to players.
        if (process.env.NODE_ENV !== 'development') {
            return undefined;
        }

        const api: DebugCycleApi = {
            total: allCats.length,
            allCats: allCats.map((_, i) => getCatDebugInfo(i)),
            next: debugNext,
            prev: debugPrev,
            setCat: debugSetCat,
            list: debugList,
            setSequentialMode: debugSetSequentialMode,
            open: debugOpen,
            cycleAll: debugCycleAll,
            stop: debugStop,
            status: debugStatus,
            reset: debugReset,
            help: debugHelp,
            toggle: debugToggle,
            bypassDailyLock: debugBypassDailyLock,
            get enabled() {
                return isDebugModeActive || debugSequentialModeRef.current || debugOverrideCatIdRef.current !== null;
            },
            set enabled(val: boolean) {
                setIsDebugModeActive(Boolean(val));
                if (!val) {
                    debugSequentialModeRef.current = false;
                    debugOverrideCatIdRef.current = null;
                }
            },
            get currentIndex() {
                return debugIndexRef.current;
            },
            set currentIndex(val: number) {
                if (typeof val === 'number' && !isNaN(val)) {
                    debugIndexRef.current = ((val % allCats.length) + allCats.length) % allCats.length;
                }
            },
            get targetCatId() {
                return debugOverrideCatIdRef.current;
            },
            set targetCatId(val: string | null | undefined) {
                debugOverrideCatIdRef.current = val ?? null;
                if (val) setIsDebugModeActive(true);
            },
        };

        return api;
    }, [
        debugBypassDailyLock,
        debugCycleAll,
        debugHelp,
        debugList,
        debugNext,
        debugOpen,
        debugPrev,
        debugReset,
        debugSetCat,
        debugSetSequentialMode,
        debugStatus,
        debugStop,
        debugToggle,
        getCatDebugInfo,
        isDebugModeActive,
    ]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Development builds only: the API can unlock cats, so it must never ship to players.
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        if (debugCycle) {
            window.__DEBUG_CYCLE_CATS__ = debugCycle;
        }

        return () => {
            if (debugCycleIntervalRef.current) {
                clearInterval(debugCycleIntervalRef.current);
                debugCycleIntervalRef.current = null;
            }
            if (window.__DEBUG_CYCLE_CATS__ === debugCycle) {
                delete window.__DEBUG_CYCLE_CATS__;
            }
        };
    }, [debugCycle]);

    const handleReset = useCallback(
        (options?: { ignoreLock?: boolean }) => {
            onInteraction?.();
            playFeedback('click-2');
            const isDev = process.env.NODE_ENV === 'development';
            const isDebugActive = isDev && (
                isDebugModeActive ||
                debugSequentialModeRef.current ||
                debugOverrideCatIdRef.current !== null
            );
            if (!isDailyLocked || options?.ignoreLock || isDebugActive) {
                resetState();
            }
        },
        [onInteraction, resetState, isDailyLocked, isDebugModeActive],
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
        debugCycle,
    };
}
