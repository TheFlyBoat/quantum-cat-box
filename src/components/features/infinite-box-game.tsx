'use client';

import { type ComponentType, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Fish,
  Atom,
  Zap,
  Cat,
  Sparkles,
  Heart,
  Ghost,
  Star,
  Gem,
  Crown,
  Trophy,
  Play,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { playFeedback } from '@/lib/audio';

export type InfiniteBoxGameResult = {
  totalClicks: number;
  applesCollected: number; // Represents Golden Fish caught
  atomsActivated: number;  // Represents Time Warps triggered
  treesTriggered: number;  // Represents Glitches hit
  fishPointsAwarded: number;
};

interface InfiniteBoxGameProps {
  onComplete: (result: InfiniteBoxGameResult) => void;
  onDismiss: () => void;
}

const TOTAL_TIME_MS = 25_000;
const TIMER_STEP_MS = 100;
const ICON_ROTATE_MS = 1_200;
const GLITCH_PENALTY_MS = 4_000;
const TIME_WARP_BONUS_MS = 3_000;
const GOLDEN_FISH_POINTS = 10;
const CAT_ALLY_POINTS = 2;

type IconEffect = 'golden_fish' | 'glitch' | 'time_warp' | 'cat_point';

type IconConfig = {
  id: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number | string }>;
  effect: IconEffect;
  color: string;
  bgGlow: string;
  borderClass: string;
  badgeLabel: string;
  label: string;
  points: number;
  timeDeltaMs: number;
  toastText: string;
};

const ICONS: IconConfig[] = [
  {
    id: 'golden-fish',
    icon: Fish,
    effect: 'golden_fish',
    color: 'text-amber-300',
    bgGlow: 'bg-amber-500/20 shadow-[0_0_35px_rgba(245,158,11,0.45)]',
    borderClass: 'border-amber-400/80',
    badgeLabel: '+10 🐟 BIG BONUS',
    label: 'Golden Fish',
    points: GOLDEN_FISH_POINTS,
    timeDeltaMs: 0,
    toastText: 'Golden Fish snagged! +10 Fish Points! 🐟',
  },
  {
    id: 'time-warp',
    icon: Atom,
    effect: 'time_warp',
    color: 'text-[#3696C9]',
    bgGlow: 'bg-sky-500/20 shadow-[0_0_35px_rgba(56,189,248,0.45)]',
    borderClass: 'border-sky-400/80',
    badgeLabel: '+3.0s TIME WARP',
    label: 'Paradox Warp',
    points: 2,
    timeDeltaMs: TIME_WARP_BONUS_MS,
    toastText: 'Spacetime folded! +3 Seconds! ⏳',
  },
  {
    id: 'quantum-glitch',
    icon: Zap,
    effect: 'glitch',
    color: 'text-[#D14002]',
    bgGlow: 'bg-red-500/25 shadow-[0_0_40px_rgba(239,68,68,0.55)]',
    borderClass: 'border-red-500/90 animate-pulse',
    badgeLabel: '⚡ HAZARD: HOLD PAWS!',
    label: 'Decoherence Glitch',
    points: 0,
    timeDeltaMs: -GLITCH_PENALTY_MS,
    toastText: 'Decoherence shock! -4 Seconds lost! ⚡',
  },
  {
    id: 'alive-kitten',
    icon: Cat,
    effect: 'cat_point',
    color: 'text-[#A9DB4A]',
    bgGlow: 'bg-emerald-500/20 shadow-[0_0_25px_rgba(169,219,74,0.35)]',
    borderClass: 'border-emerald-400/60',
    badgeLabel: '+2 🐟 KITTEN PURR',
    label: 'Quantum Kitten',
    points: CAT_ALLY_POINTS,
    timeDeltaMs: 0,
    toastText: 'Kitten purr! +2 Fish Points! 🐱',
  },
  {
    id: 'cosmic-sparkles',
    icon: Sparkles,
    effect: 'cat_point',
    color: 'text-[#A240FF]',
    bgGlow: 'bg-purple-500/20 shadow-[0_0_25px_rgba(162,64,255,0.35)]',
    borderClass: 'border-purple-400/60',
    badgeLabel: '+2 🐟 COSMIC DUST',
    label: 'Cosmic Sparkles',
    points: CAT_ALLY_POINTS,
    timeDeltaMs: 0,
    toastText: 'Sparkles burst! +2 Fish Points! ✨',
  },
  {
    id: 'heart-pulse',
    icon: Heart,
    effect: 'cat_point',
    color: 'text-[#FF809F]',
    bgGlow: 'bg-pink-500/20 shadow-[0_0_25px_rgba(255,128,159,0.35)]',
    borderClass: 'border-pink-400/60',
    badgeLabel: '+2 🐟 FELINE LOVE',
    label: 'Heart Resonance',
    points: CAT_ALLY_POINTS,
    timeDeltaMs: 0,
    toastText: 'Feline love! +2 Fish Points! 💖',
  },
  {
    id: 'ghost-echo',
    icon: Ghost,
    effect: 'cat_point',
    color: 'text-sky-300',
    bgGlow: 'bg-sky-500/20 shadow-[0_0_25px_rgba(56,189,248,0.35)]',
    borderClass: 'border-sky-400/60',
    badgeLabel: '+2 🐟 PHANTOM ECHO',
    label: 'Ghost Echo',
    points: CAT_ALLY_POINTS,
    timeDeltaMs: 0,
    toastText: 'Phantom echo! +2 Fish Points! 👻',
  },
  {
    id: 'stellar-star',
    icon: Star,
    effect: 'cat_point',
    color: 'text-amber-400',
    bgGlow: 'bg-amber-500/20 shadow-[0_0_25px_rgba(251,191,36,0.35)]',
    borderClass: 'border-amber-400/60',
    badgeLabel: '+2 🐟 NOVA STAR',
    label: 'Nova Star',
    points: CAT_ALLY_POINTS,
    timeDeltaMs: 0,
    toastText: 'Nova star! +2 Fish Points! 🌟',
  },
  {
    id: 'crystal-gem',
    icon: Gem,
    effect: 'cat_point',
    color: 'text-teal-300',
    bgGlow: 'bg-teal-500/20 shadow-[0_0_25px_rgba(20,184,166,0.35)]',
    borderClass: 'border-teal-400/60',
    badgeLabel: '+2 🐟 PRISM GEM',
    label: 'Prism Shard',
    points: CAT_ALLY_POINTS,
    timeDeltaMs: 0,
    toastText: 'Prism shard! +2 Fish Points! 💎',
  },
  {
    id: 'royal-crown',
    icon: Crown,
    effect: 'cat_point',
    color: 'text-[#A240FF]',
    bgGlow: 'bg-purple-500/20 shadow-[0_0_25px_rgba(162,64,255,0.35)]',
    borderClass: 'border-purple-400/60',
    badgeLabel: '+2 🐟 ROYAL SHIFT',
    label: 'Royal Crown',
    points: CAT_ALLY_POINTS,
    timeDeltaMs: 0,
    toastText: 'Royal majesty! +2 Fish Points! 👑',
  },
];

const getRandomIcon = (excludeId?: string): IconConfig => {
  const pool = excludeId ? ICONS.filter(icon => icon.id !== excludeId) : ICONS;
  return pool[Math.floor(Math.random() * pool.length)];
};

type FloatingScore = {
  id: number;
  text: string;
  color: string;
};

export function InfiniteBoxGame({ onComplete, onDismiss }: InfiniteBoxGameProps) {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_MS);
  const [totalClicks, setTotalClicks] = useState(0);
  const [fishPoints, setFishPoints] = useState(0);
  const [goldenFishCaught, setGoldenFishCaught] = useState(0);
  const [glitchesHit, setGlitchesHit] = useState(0);
  const [timeWarpsActivated, setTimeWarpsActivated] = useState(0);
  const [currentIcon, setCurrentIcon] = useState<IconConfig>(ICONS[0]);
  const [statusMessage, setStatusMessage] = useState('Tap the Quantum Box to reel in Fish Points!');
  const [floaters, setFloaters] = useState<FloatingScore[]>([]);
  const [result, setResult] = useState<InfiniteBoxGameResult | null>(null);

  const progressPercent = useMemo(
    () => Math.max(0, Math.min(100, (timeLeft / TOTAL_TIME_MS) * 100)),
    [timeLeft],
  );

  const handleDismiss = useCallback(() => {
    playFeedback('click-2');
    onDismiss();
  }, [onDismiss]);

  const finalizeGame = useCallback(() => {
    playFeedback('celebration-magic');
    setResult({
      totalClicks,
      applesCollected: goldenFishCaught,
      atomsActivated: timeWarpsActivated,
      treesTriggered: glitchesHit,
      fishPointsAwarded: Math.max(0, fishPoints),
    });
    setPhase('result');
  }, [totalClicks, goldenFishCaught, timeWarpsActivated, glitchesHit, fishPoints]);

  const startGame = useCallback(() => {
    playFeedback('celebration-magic');
    setTimeLeft(TOTAL_TIME_MS);
    setTotalClicks(0);
    setFishPoints(0);
    setGoldenFishCaught(0);
    setGlitchesHit(0);
    setTimeWarpsActivated(0);
    setFloaters([]);
    setCurrentIcon(getRandomIcon('quantum-glitch'));
    setStatusMessage('Quantum rift open! Tap the box!');
    setPhase('playing');
  }, []);

  // Main game loop timer
  useEffect(() => {
    if (phase !== 'playing') return;

    const tick = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        const next = prev - TIMER_STEP_MS;
        if (next <= 0) {
          finalizeGame();
          return 0;
        }
        return next;
      });
    }, TIMER_STEP_MS);

    return () => window.clearInterval(tick);
  }, [phase, finalizeGame]);

  // Periodic icon shift
  useEffect(() => {
    if (phase !== 'playing') return;

    const rotate = window.setInterval(() => {
      setCurrentIcon(prev => getRandomIcon(prev.id));
    }, ICON_ROTATE_MS);

    return () => window.clearInterval(rotate);
  }, [phase]);

  const addFloater = (text: string, color: string) => {
    const id = Date.now() + Math.random();
    setFloaters(prev => [...prev.slice(-4), { id, text, color }]);
    setTimeout(() => {
      setFloaters(prev => prev.filter(f => f.id !== id));
    }, 800);
  };

  const handleBoxClick = useCallback(() => {
    if (phase !== 'playing') return;

    setTotalClicks(prev => prev + 1);

    switch (currentIcon.effect) {
      case 'golden_fish':
        playFeedback('celebration-magic');
        setFishPoints(prev => prev + GOLDEN_FISH_POINTS);
        setGoldenFishCaught(prev => prev + 1);
        setStatusMessage(currentIcon.toastText);
        addFloater('+10 🐟', 'text-amber-300');
        break;

      case 'time_warp':
        playFeedback('reveal-carbon');
        setFishPoints(prev => prev + 2);
        setTimeWarpsActivated(prev => prev + 1);
        setTimeLeft(prev => Math.min(TOTAL_TIME_MS, prev + TIME_WARP_BONUS_MS));
        setStatusMessage(currentIcon.toastText);
        addFloater('+3.0s ⏳', 'text-[#3696C9]');
        break;

      case 'glitch':
        playFeedback('error-1');
        setGlitchesHit(prev => prev + 1);
        setTimeLeft(prev => Math.max(0, prev - GLITCH_PENALTY_MS));
        setStatusMessage(currentIcon.toastText);
        addFloater('-4.0s ⚡', 'text-red-400');
        break;

      default:
        playFeedback('box-shake');
        setFishPoints(prev => prev + CAT_ALLY_POINTS);
        setStatusMessage(currentIcon.toastText);
        addFloater('+2 🐟', 'text-emerald-300');
        break;
    }

    // Cycle to a new random possibility
    setCurrentIcon(prev => getRandomIcon(prev.id));
  }, [phase, currentIcon]);

  const handleCollectReward = useCallback(() => {
    if (!result) return;
    onComplete(result);
  }, [onComplete, result]);

  return (
    <Dialog open={true} onOpenChange={open => { if (!open) handleDismiss(); }}>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-[#002D41] via-[#1E113B] to-[#0D1929] text-white p-4 sm:p-5 shadow-[0_25px_90px_rgba(0,0,0,0.85)] overflow-hidden gap-0 outline-none max-h-[92vh] [&>button]:text-white/70 [&>button:hover]:text-white [&>button]:rounded-full [&>button]:p-1 [&>button]:top-4 [&>button]:right-4 [&>button]:focus:ring-white/40"
      >
        {/* Ambient Top/Bottom Glows - securely contained so they NEVER cause scroll overflow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
          <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-[#A240FF]/25 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#3696C9]/25 blur-3xl" />
        </div>

        <div className="relative z-10 w-full overflow-y-auto overflow-x-hidden max-h-[calc(92vh-2rem)]">
          {/* Phase 1: Intro / Rules */}
          {phase === 'intro' && (
            <div className="space-y-3.5 text-center">
              <div className="text-left pr-8 pb-2 border-b border-white/10">
                <Badge variant="outline" className="border-pink-400/50 text-[#FF809F] font-bold text-[10px] tracking-wider uppercase">
                  Secret Multiverse
                </Badge>
                <DialogTitle className="font-headline text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Infinite Box Rift
                </DialogTitle>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/85 leading-relaxed space-y-1 text-left">
                <p className="font-semibold text-white">
                  🌌 You stumbled across an unstable quantum rift!
                </p>
                <DialogDescription className="text-xs text-white/75 leading-relaxed">
                  Tap the Quantum Box to observe realities before the timeline decoheres in <strong className="text-white">25 seconds</strong>:
                </DialogDescription>
              </div>

              {/* Entity Legend */}
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="flex items-center gap-2 p-2 rounded-xl border border-amber-400/40 bg-amber-500/10 min-w-0">
                  <Fish className="h-4 w-4 text-amber-300 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-amber-200 text-xs truncate">Golden Fish</p>
                    <p className="text-[10px] text-white/70 truncate">+10 Fish Points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-sky-400/40 bg-sky-500/10 min-w-0">
                  <Atom className="h-4 w-4 text-[#3696C9] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sky-200 text-xs truncate">Time Warp</p>
                    <p className="text-[10px] text-white/70 truncate">+3.0 Seconds</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 min-w-0">
                  <Cat className="h-4 w-4 text-[#A9DB4A] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-emerald-200 text-xs truncate">Kitten Allies</p>
                    <p className="text-[10px] text-white/70 truncate">+2 Fish Points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-red-500/50 bg-red-500/15 min-w-0">
                  <Zap className="h-4 w-4 text-red-400 shrink-0 animate-pulse" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-red-300 text-xs truncate">Quantum Glitch</p>
                    <p className="text-[10px] text-red-200/80 truncate">-4.0s (Avoid!)</p>
                  </div>
                </div>
              </div>

              <div className="pt-1 space-y-1.5">
                <Button
                  onClick={startGame}
                  className="w-full h-11 sm:h-12 rounded-2xl font-headline text-base sm:text-lg font-bold bg-gradient-to-r from-[#A240FF] via-[#FF809F] to-[#3696C9] text-white shadow-lg hover:opacity-95 transition transform hover:scale-[1.01]"
                >
                  <Play className="h-4 w-4 mr-1.5 fill-current" />
                  Enter the Quantum Rift
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="w-full h-8 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-xl"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          )}

          {/* Phase 2: Active Gameplay */}
          {phase === 'playing' && (
            <div className="space-y-3 text-center">
              {/* Header */}
              <div className="text-left pr-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A240FF]">Infinite Challenge</span>
                <DialogTitle className="font-headline text-lg sm:text-xl font-bold text-white">Quantum Collapse Loop</DialogTitle>
                <DialogDescription className="sr-only">Tap the box quickly to score points before time runs out.</DialogDescription>
              </div>

              {/* Time Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#3696C9]" />
                    Time Remaining
                  </span>
                  <span className={cn(
                    "font-mono text-sm tracking-wider",
                    timeLeft <= 5000 ? "text-red-400 font-black animate-pulse" : "text-white"
                  )}>
                    {(timeLeft / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/15 p-0.5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-100",
                      timeLeft <= 5000
                        ? "bg-red-500 animate-pulse"
                        : "bg-gradient-to-r from-[#A9DB4A] via-[#3696C9] to-[#A240FF]"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* HUD: Points & Clicks */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-2 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Fish Points</p>
                  <p className="font-headline text-xl sm:text-2xl font-bold text-amber-300">+{fishPoints} 🐟</p>
                </div>
                <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-2 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-sky-300">Collapses</p>
                  <p className="font-headline text-xl sm:text-2xl font-bold text-sky-200">{totalClicks}</p>
                </div>
              </div>

              {/* Main Interactive Box */}
              <div className="relative flex flex-col items-center justify-center pt-1 pb-1">
                {/* Floating Score Indicators */}
                <div className="pointer-events-none absolute inset-x-0 -top-4 flex justify-center items-center h-10">
                  {floaters.map(f => (
                    <span
                      key={f.id}
                      className={cn(
                        "absolute font-headline text-lg font-bold drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300",
                        f.color
                      )}
                    >
                      {f.text}
                    </span>
                  ))}
                </div>

                {/* Box Button */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Tap to observe ${currentIcon.label}`}
                  onClick={handleBoxClick}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleBoxClick();
                    }
                  }}
                  className={cn(
                    "relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-3xl border-4 transition-all duration-150 cursor-pointer select-none",
                    "hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-md",
                    currentIcon.bgGlow,
                    currentIcon.borderClass
                  )}
                >
                  <currentIcon.icon
                    className={cn("h-14 w-14 sm:h-16 sm:w-16 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]", currentIcon.color)}
                    strokeWidth={1.4}
                  />
                </div>

                {/* Badge & Label */}
                <div className="mt-2 text-center space-y-0.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-bold tracking-wider px-2 py-0.5",
                      currentIcon.effect === 'glitch'
                        ? "border-red-500 bg-red-500/20 text-red-300 animate-pulse"
                        : "border-white/30 bg-white/10 text-white"
                    )}
                  >
                    {currentIcon.badgeLabel}
                  </Badge>
                  <p className="text-xs text-white/70 italic line-clamp-1">{statusMessage}</p>
                </div>
              </div>

              {/* Quick Tap Button */}
              <Button
                onClick={handleBoxClick}
                className={cn(
                  "w-full h-11 sm:h-12 rounded-2xl font-headline text-base sm:text-lg font-bold text-white shadow-lg transition-transform active:scale-95",
                  currentIcon.effect === 'glitch'
                    ? "bg-red-600/80 hover:bg-red-600 border border-red-400"
                    : "bg-gradient-to-r from-[#A240FF] via-[#FF809F] to-[#3696C9] hover:opacity-95"
                )}
              >
                {currentIcon.effect === 'glitch' ? '⚠️ HOLD ON — GLITCH ACTIVE!' : 'Tap to Collapse Reality!'}
              </Button>
            </div>
          )}

          {/* Phase 3: Results */}
          {phase === 'result' && result && (
            <div className="space-y-3.5 text-center">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 mb-1 border border-amber-400/40 shadow-md">
                  <Trophy className="h-6 w-6" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#A9DB4A]">Challenge Cleared</p>
                <DialogTitle className="font-headline text-2xl sm:text-3xl font-bold text-white mt-0.5">Rift Stabilized!</DialogTitle>
                <DialogDescription className="text-xs text-white/70 mt-0.5">
                  You observed the multiverse loop and harvested bounty for the Quantum Cat!
                </DialogDescription>
              </div>

              {/* Fish Points Award Banner */}
              <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 p-3 shadow-inner">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Total Points Awarded</span>
                <p className="font-headline text-3xl sm:text-4xl font-bold text-amber-300 mt-0.5">
                  +{result.fishPointsAwarded} 🐟
                </p>
              </div>

              {/* Stats Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-white/60">Total Collapses</p>
                  <p className="font-bold text-base sm:text-lg text-white mt-0.5">{result.totalClicks}</p>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-amber-300">Golden Fish</p>
                  <p className="font-bold text-base sm:text-lg text-amber-300 mt-0.5">{result.applesCollected}</p>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-sky-300">Time Warps</p>
                  <p className="font-bold text-base sm:text-lg text-sky-300 mt-0.5">{result.atomsActivated}</p>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl border border-white/10 bg-white/5 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-red-300">Glitches Hit</p>
                  <p className="font-bold text-base sm:text-lg text-red-300 mt-0.5">{result.treesTriggered}</p>
                </div>
              </div>

              <div className="pt-1 space-y-1.5">
                <Button
                  onClick={handleCollectReward}
                  className="w-full h-11 sm:h-12 rounded-2xl font-headline text-base sm:text-lg font-bold bg-gradient-to-r from-[#A240FF] via-[#FF809F] to-[#3696C9] text-white shadow-lg hover:opacity-95 transition transform hover:scale-[1.01]"
                >
                  Claim Fish Points & Return
                </Button>
                <Button
                  variant="ghost"
                  onClick={startGame}
                  className="w-full h-8 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-xl"
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

