'use client';

import React, { type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronRight,
    ChevronLeft,
    HelpCircle,
    Fish,
    Medal,
    Box as BoxIcon,
    Sparkles,
    Heart,
    Zap,
    Cat,
    BookOpen,
    ExternalLink,
    CheckCircle2,
    Lock,
} from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { playFeedback } from '@/lib/audio';

import boxSkinData from '@/lib/box-skin-data.json';
import badgeData from '@/lib/badge-data.json';
import { badgeImageMap, defaultBadgeImage } from '@/lib/badge-images';
import { useBadges } from '@/context/badge-context';

import {
    BoxIcon as DefaultBoxIcon,
    CarbonBoxIcon,
    CardboardBoxIcon,
    BlackWoodenBoxIcon,
    SpecialXK6BoxIcon,
    StoneBoxIcon,
    TardisBoxIcon,
    CircuitBoardBoxIcon,
    CrystalBoxIcon,
    GalaxyBoxIcon,
    PlushBoxIcon,
    SteampunkBoxIcon,
} from '@/components/icons';

type HowSection = 'menu' | 'how-to-play' | 'points' | 'badges' | 'boxes' | 'experiment';

interface BoxSkinItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    power: {
        title: string;
        description: string;
        badgeText: string;
        type: string;
        value?: number;
        multiplier?: number;
        bonusPoints?: number;
        targetOutcome?: string;
    };
}

interface BadgeItem {
    id: string;
    name: string;
    description: string;
    icon: string;
}

const SKIN_COMPONENTS: Record<string, ComponentType<{ className?: string }>> = {
    default: DefaultBoxIcon,
    carbon: CarbonBoxIcon,
    cardboard: CardboardBoxIcon,
    'black-wooden': BlackWoodenBoxIcon,
    'special-xk6': SpecialXK6BoxIcon,
    stone: StoneBoxIcon,
    tardis: TardisBoxIcon,
    'circuit-board': CircuitBoardBoxIcon,
    crystal: CrystalBoxIcon,
    galaxy: GalaxyBoxIcon,
    plush: PlushBoxIcon,
    steampunk: SteampunkBoxIcon,
};

const BADGE_RULES: Record<string, { rule: string; tip: string }> = {
    'curious-kitten': {
        rule: 'Open your Quantum Box 3 consecutive days in a row without breaking your streak.',
        tip: 'Check in daily before midnight. If you miss a calendar day, your streak will reset to 1!',
    },
    'infinite-chaser': {
        rule: 'Discover and successfully complete the Infinite Box multiverse challenge.',
        tip: 'Keep opening boxes and exploring awards to trigger deep dimensional portals.',
    },
    'alive-kicking': {
        rule: 'Discover your third distinct Alive Cat in the quantum multiverse.',
        tip: 'Equip the Cardboard box to attract more living felines, or the Cozy Plush box for extra points.',
    },
    'rest-in-pieces': {
        rule: 'Discover your third distinct Dead Cat across all observation collapses.',
        tip: 'Equip the Mystic Stone or Black Wooden box to connect with ancient feline spirits.',
    },
    'paradox-seeker': {
        rule: 'Discover your third distinct Paradox Cat existing in quantum superposition.',
        tip: 'Equip the Time Capsule or Galaxy box to bend reality and attract Paradox cats!',
    },
    'the-archivist': {
        rule: 'Collect all 8 cats in any single category: Alive, Dead, or Paradox.',
        tip: 'Equip the Crystal box to seek out uncollected cats and discover new feline friends!',
    },
    'message-keeper': {
        rule: 'Save 5 AI-generated Quantum Messages to your personal Cat Diary.',
        tip: 'Tap the heart icon (💖) on the reveal screen after any collapse you wish to remember.',
    },
    'storyteller': {
        rule: 'Share your very first collapse card to social media or copy its shareable link.',
        tip: 'Tap the Share button on the collapse screen to reveal your cat to the world.',
    },
    'viral-cat': {
        rule: 'Share your daily collapse cards 5 separate times.',
        tip: 'Share your favorite philosophical fortunes with friends across different days.',
    },
    'quantum-echo': {
        rule: 'Reveal the exact same cat 3 times in a row across consecutive collapses.',
        tip: 'A rare quantum harmonic resonance! Keep observing daily to witness this improbable alignment.',
    },
};

export function SettingsHowGuide() {
    const [section, setSection] = React.useState<HowSection>('menu');
    const [selectedBox, setSelectedBox] = React.useState<BoxSkinItem | null>(null);
    const [selectedBadge, setSelectedBadge] = React.useState<BadgeItem | null>(null);

    const { isBadgeUnlocked } = useBadges();

    const skins = boxSkinData.skins as BoxSkinItem[];
    const badges = badgeData.badges as BadgeItem[];

    const handleNavigate = (target: HowSection) => {
        playFeedback('click-3');
        setSection(target);
    };

    const handleBack = () => {
        playFeedback('click-2');
        setSection('menu');
    };

    // Sub-header back button
    const renderBackButton = (title: string) => (
        <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-auto inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-xl hover:bg-muted/40"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Guide</span>
            </Button>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
    );

    return (
        <div className="pt-2 space-y-4">
            {/* 1. Main Directory Menu */}
            {section === 'menu' && (
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 text-center mb-6">
                        <div className="relative h-20 w-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#A240FF] via-[#FF809F] to-[#3696C9] p-1 shadow-lg">
                            <div className="flex h-full w-full items-center justify-center rounded-[1.8rem] bg-background">
                                <BookOpen className="h-9 w-9 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-headline text-2xl font-bold text-foreground">Multiverse Field Guide</h3>
                            <p className="text-sm font-medium text-muted-foreground">Select a theme to explore rules, powers & lore</p>
                        </div>
                    </div>

                    {/* Menu Card */}
                    <div className="rounded-3xl border border-border/60 bg-background/50 p-1 shadow-sm backdrop-blur-sm">
                        <div className="flex flex-col divide-y divide-border/40">
                            {/* How to Play */}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleNavigate('how-to-play')}
                                className="h-auto w-full justify-between p-4 text-left font-normal whitespace-normal transition-colors hover:bg-muted/30 group rounded-t-2xl rounded-b-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-[#3696C9] dark:bg-sky-950 dark:text-sky-400">
                                        <HelpCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">How to Play</span>
                                        <p className="text-xs text-muted-foreground">Step-by-step collapse guide, Cat Diary & early unlocks</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </Button>

                            {/* Fish Points */}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleNavigate('points')}
                                className="h-auto w-full justify-between p-4 text-left font-normal whitespace-normal transition-colors hover:bg-muted/30 group rounded-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-[#A9DB4A] dark:bg-emerald-950 dark:text-[#A9DB4A]">
                                        <Fish className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Fish Points</span>
                                        <p className="text-xs text-muted-foreground">Points economy, bonuses & spending rules</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </Button>

                            {/* Badges */}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleNavigate('badges')}
                                className="h-auto w-full justify-between p-4 text-left font-normal whitespace-normal transition-colors hover:bg-muted/30 group rounded-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-[#D14002] dark:bg-amber-950 dark:text-[#D14002]">
                                        <Medal className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Badges</span>
                                        <p className="text-xs text-muted-foreground">Explore all 10 badges & their exact unlock rules</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </Button>

                            {/* Quantum Boxes */}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleNavigate('boxes')}
                                className="h-auto w-full justify-between p-4 text-left font-normal whitespace-normal transition-colors hover:bg-muted/30 group rounded-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-[#A240FF] dark:bg-purple-950 dark:text-purple-400">
                                        <BoxIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Quantum Boxes</span>
                                        <p className="text-xs text-muted-foreground">Directory of 12 boxes, unique powers & prices</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </Button>

                            {/* Schrödinger's Cat Experiment */}
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleNavigate('experiment')}
                                className="h-auto w-full justify-between p-4 text-left font-normal whitespace-normal transition-colors hover:bg-muted/30 group rounded-b-2xl rounded-t-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-[#FF809F] dark:bg-pink-950 dark:text-pink-400">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Schrödinger’s Cat Experiment</span>
                                        <p className="text-xs text-muted-foreground">The 1935 thought experiment, Wikipedia & video</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Sub-View: How to Play */}
            {section === 'how-to-play' && (
                <div className="space-y-4">
                    {renderBackButton('How to Play')}

                    {/* Intro */}
                    <div className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm space-y-2">
                        <h4 className="font-headline text-xl font-bold text-foreground">The Daily Quantum Collapse</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Every day, your Quantum Box holds a cat in suspended superposition. Follow these 5 steps to reveal your daily fortune and build your feline collection:
                        </p>
                    </div>

                    {/* Step-by-step colored cards */}
                    <div className="space-y-3">
                        {/* Step 1 */}
                        <div className="rounded-3xl border border-sky-200/70 bg-sky-50/50 dark:border-sky-900/40 dark:bg-sky-950/20 p-5 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-[#3696C9] dark:bg-sky-900/50 dark:text-sky-400">
                                        <BoxIcon className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#3696C9]">Step 1</span>
                                </div>
                                <span className="text-xs font-bold text-muted-foreground">Daily Observation</span>
                            </div>
                            <h5 className="font-headline text-lg font-bold text-foreground">Open Your Quantum Box</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Tap the box on your Home screen. Your act of observation causes quantum decoherence: the infinite multiverse of probabilities collapses into a single definite feline reality!
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-3xl border border-purple-200/70 bg-purple-50/50 dark:border-purple-900/40 dark:bg-purple-950/20 p-5 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-[#A240FF] dark:bg-purple-900/50 dark:text-purple-400">
                                        <Cat className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#A240FF]">Step 2</span>
                                </div>
                                <span className="text-xs font-bold text-muted-foreground">Three States</span>
                            </div>
                            <h5 className="font-headline text-lg font-bold text-foreground">Observe the Cat State</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                <div className="rounded-2xl border border-sky-300/40 bg-background/80 p-3 text-center space-y-1">
                                    <span className="text-base">🐱</span>
                                    <p className="text-xs font-bold text-muted-foreground"><span className="text-[#3696C9]">Alive Cat</span></p>
                                    <p className="text-[11px] text-muted-foreground">Common • +1 🐟</p>
                                    <p className="text-[10px] text-muted-foreground/80">Vitality, warmth & playful optimism.</p>
                                </div>
                                <div className="rounded-2xl border border-pink-300/40 bg-background/80 p-3 text-center space-y-1">
                                    <span className="text-base">💀</span>
                                    <p className="text-xs font-bold text-muted-foreground"><span className="text-[#FF809F]">Dead Cat</span></p>
                                    <p className="text-[11px] text-muted-foreground">Common • +2 🐟</p>
                                    <p className="text-[10px] text-muted-foreground/80">Ghostly wisdom, change & rebirth.</p>
                                </div>
                                <div className="rounded-2xl border border-purple-300/40 bg-background/80 p-3 text-center space-y-1">
                                    <span className="text-base">🌀</span>
                                    <p className="text-xs font-bold text-muted-foreground"><span className="text-[#A240FF]">Paradox Cat</span></p>
                                    <p className="text-[11px] text-muted-foreground">Rare • +5 🐟</p>
                                    <p className="text-[10px] text-muted-foreground/80">Multiverse glitch, superposition alive & dead.</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-3xl border border-amber-200/70 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 p-5 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-[#D14002] dark:bg-amber-900/50 dark:text-[#D14002]">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#D14002]">Step 3</span>
                                </div>
                                <span className="text-xs font-bold text-muted-foreground">AI Wisdom</span>
                            </div>
                            <h5 className="font-headline text-lg font-bold text-foreground">Read Your Quantum Message</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Every collapse generates a custom philosophical reflection and advice powered by Google Genkit AI, aligning with the spirit of the cat state you unlocked.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="rounded-3xl border border-pink-200/70 bg-pink-50/50 dark:border-pink-900/40 dark:bg-pink-950/20 p-5 shadow-sm space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-[#FF809F] dark:bg-pink-900/50 dark:text-pink-400">
                                        <Heart className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF809F]">Step 4</span>
                                </div>
                                <span className="text-xs font-bold text-muted-foreground">Cat Diary</span>
                            </div>
                            <h5 className="font-headline text-lg font-bold text-foreground">Saving Cats & The Cat Diary</h5>
                            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                                <p>
                                    <strong>What happens when you save a cat?</strong> Tapping the heart icon (💖) immediately saves the cat card and its unique Quantum Message to your permanent <strong>Cat Diary</strong>.
                                </p>
                                <p>
                                    <strong>The Cat Diary:</strong> Accessible from the bottom navigation or collapse screen, your Diary archives every saved fortune organized by date. Revisit past reflections anytime and see how your quantum story evolves!
                                </p>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="rounded-3xl border border-emerald-200/70 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20 p-5 shadow-sm space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-[#A9DB4A] dark:bg-emerald-900/50 dark:text-[#A9DB4A]">
                                        <Zap className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#A9DB4A]">Step 5</span>
                                </div>
                                <span className="text-xs font-bold text-muted-foreground">Cooldown & Unlock</span>
                            </div>
                            <h5 className="font-headline text-lg font-bold text-foreground">How to Unlock the Box Early</h5>
                            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                                <p>
                                    <strong>Midnight Reset:</strong> Your Quantum Box recharges automatically every midnight (00:00 local time) for your next free daily collapse.
                                </p>
                                <p>
                                    <strong>Early Recharges:</strong> Eager for another reading right now? Tap <strong>Unlock Early</strong> on the Home screen to open the box again for <strong>10 Fish Points</strong> (or only <strong>5 Fish Points</strong> if you equip the Steampunk Box!).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Sub-View: Fish Points */}
            {section === 'points' && (
                <div className="space-y-4">
                    {renderBackButton('Fish Points')}

                    {/* Intro */}
                    <div className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-[#A9DB4A]">
                            <Fish className="h-5 w-5" />
                            <h4 className="font-headline text-xl font-bold text-foreground">Fish Points Economy</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Fish Points (🐟) are the universal currency of the feline multiverse. Earn points from daily collapses, streaks, and shares, then spend them to unlock custom Box Skins and early box recharges.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3">
                        {/* Earning */}
                        <div className="rounded-3xl border border-teal-200/70 bg-background/80 p-5 shadow-sm space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Earnings Breakdown</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div className="rounded-2xl border border-border/40 bg-teal-50/30 dark:bg-teal-950/20 p-3 text-center">
                                    <p className="font-headline font-bold text-lg text-foreground"><span className="text-[#3696C9]">+1 🐟</span></p>
                                    <p className="text-xs font-bold text-foreground">Alive Cat</p>
                                    <p className="text-[10px] text-muted-foreground">Standard vital collapse</p>
                                </div>
                                <div className="rounded-2xl border border-border/40 bg-teal-50/30 dark:bg-teal-950/20 p-3 text-center">
                                    <p className="font-headline font-bold text-lg text-foreground"><span className="text-[#FF809F]">+2 🐟</span></p>
                                    <p className="text-xs font-bold text-foreground">Dead Cat</p>
                                    <p className="text-[10px] text-muted-foreground">Ghostly reflection</p>
                                </div>
                                <div className="rounded-2xl border border-border/40 bg-teal-50/30 dark:bg-teal-950/20 p-3 text-center">
                                    <p className="font-headline font-bold text-lg text-foreground"><span className="text-[#A240FF]">+5 🐟</span></p>
                                    <p className="text-xs font-bold text-foreground">Paradox Cat</p>
                                    <p className="text-[10px] text-muted-foreground">Superposition rarity</p>
                                </div>
                            </div>
                        </div>

                        {/* Passive Boosts */}
                        <div className="rounded-3xl border border-purple-200/70 bg-background/80 p-5 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Box Powers & Point Boosts</span>
                                <Badge variant="outline" className="text-[10px] font-bold border-purple-300 text-purple-600">Passive Boosts</Badge>
                            </div>
                            <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/40 dark:bg-purple-950/20">
                                    <span className="font-bold text-foreground shrink-0">• Black Wooden Box:</span>
                                    <span><strong>Extra Fish Points</strong> whenever a Dead cat appears.</span>
                                </div>
                                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/40 dark:bg-purple-950/20">
                                    <span className="font-bold text-foreground shrink-0">• Plush Box:</span>
                                    <span><strong>Extra Fish Points</strong> whenever an Alive cat is revealed.</span>
                                </div>
                                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/40 dark:bg-purple-950/20">
                                    <span className="font-bold text-foreground shrink-0">• Stone Box:</span>
                                    <span><strong>Extra Fish Points</strong> on Dead cats and higher discovery of relic felines.</span>
                                </div>
                                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/40 dark:bg-purple-950/20">
                                    <span className="font-bold text-foreground shrink-0">• Circuit Board Box:</span>
                                    <span><strong>Flat point boost</strong> added to every reveal regardless of cat state.</span>
                                </div>
                                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/40 dark:bg-purple-950/20">
                                    <span className="font-bold text-foreground shrink-0">• Special XK6:</span>
                                    <span><strong>Critical Collapses</strong> can trigger a lucky surge of bonus Fish Points.</span>
                                </div>
                                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/40 dark:bg-purple-950/20">
                                    <span className="font-bold text-foreground shrink-0">• Galaxy Box:</span>
                                    <span><strong>Cosmic surge</strong> of extra Fish Points on Paradox reveals.</span>
                                </div>
                            </div>
                        </div>

                        {/* Spending */}
                        <div className="rounded-3xl border border-emerald-200/70 bg-background/80 p-5 shadow-sm space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Where to Spend Fish Points</span>
                            <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="p-3 rounded-2xl border border-border/40 bg-background space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-foreground">Unlock Box Skins</span>
                                        <span className="font-bold text-[#3696C9]">0 – 50 🐟</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Collect all 12 permanent box themes in the Customise menu to customize your container and activate game-changing powers.
                                    </p>
                                </div>
                                <div className="p-3 rounded-2xl border border-border/40 bg-background space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-foreground">Early Box Recharge</span>
                                        <span className="font-bold text-[#3696C9]">10 🐟 (5 🐟 Steampunk)</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Bypass the midnight cooldown and immediately reveal another cat today.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Sub-View: Badges */}
            {section === 'badges' && (
                <div className="space-y-4">
                    {renderBackButton('Badges')}

                    {/* Intro */}
                    <div className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-[#D14002]">
                            <Medal className="h-5 w-5" />
                            <h4 className="font-headline text-xl font-bold text-foreground">Badges & Achievements</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Click any badge below to view its full card and the exact rules required to unlock it:
                        </p>
                    </div>

                    {/* Badges List */}
                    <div className="rounded-3xl border border-border/60 bg-background/50 p-1 shadow-sm backdrop-blur-sm">
                        <div className="flex flex-col divide-y divide-border/40">
                            {badges.map((badge, idx) => {
                                const isUnlocked = isBadgeUnlocked(badge.id);
                                const badgeImage = badgeImageMap[badge.id] ?? defaultBadgeImage;
                                const isFirst = idx === 0;
                                const isLast = idx === badges.length - 1;

                                return (
                                    <div
                                        key={badge.id}
                                        onClick={() => {
                                            playFeedback('click-3');
                                            setSelectedBadge(badge);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30 cursor-pointer group",
                                            isFirst && "rounded-t-2xl",
                                            isLast && "rounded-b-2xl"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-background/80 flex items-center justify-center p-1 shadow-xs">
                                                <Image
                                                    src={badgeImage}
                                                    alt={badge.name}
                                                    width={36}
                                                    height={36}
                                                    className={cn("h-8 w-8 object-contain transition-transform group-hover:scale-110", !isUnlocked && "opacity-60")}
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-headline font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                                        {badge.name}
                                                    </span>
                                                    {isUnlocked ? (
                                                        <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0">
                                                            Unlocked
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-[10px] font-medium border-muted-foreground/30 text-muted-foreground px-1.5 py-0">
                                                            Locked
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{badge.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">View Rule</span>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Sub-View: Quantum Boxes */}
            {section === 'boxes' && (
                <div className="space-y-4">
                    {renderBackButton('Quantum Boxes')}

                    {/* Intro */}
                    <div className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm space-y-2">
                        <div className="flex items-center gap-2 text-[#A240FF]">
                            <BoxIcon className="h-5 w-5" />
                            <h4 className="font-headline text-xl font-bold text-foreground">Quantum Boxes Directory</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Each container resonates with unique physics that modify collapse probabilities and rewards. Click any box to open its detail card:
                        </p>
                    </div>

                    {/* Box List */}
                    <div className="rounded-3xl border border-border/60 bg-background/50 p-1 shadow-sm backdrop-blur-sm">
                        <div className="flex flex-col divide-y divide-border/40">
                            {skins.map((skin, idx) => {
                                const BoxComponent = SKIN_COMPONENTS[skin.id] ?? DefaultBoxIcon;
                                const isFirst = idx === 0;
                                const isLast = idx === skins.length - 1;

                                return (
                                    <div
                                        key={skin.id}
                                        onClick={() => {
                                            playFeedback('click-3');
                                            setSelectedBox(skin);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between p-3.5 transition-colors hover:bg-muted/30 cursor-pointer group",
                                            isFirst && "rounded-t-2xl",
                                            isLast && "rounded-b-2xl"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/80 border border-border/40 p-1.5 shadow-xs group-hover:scale-105 transition-transform">
                                                <BoxComponent className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-headline font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                                        {skin.name}
                                                    </span>
                                                    <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary px-1.5 py-0">
                                                        {skin.power.badgeText}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{skin.power.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="flex items-center gap-1 text-xs font-bold text-[#3696C9]">
                                                <Fish className="h-3.5 w-3.5" />
                                                <span>{skin.cost === 0 ? 'Free' : `${skin.cost} 🐟`}</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 6. Sub-View: Schrödinger's Cat Experiment */}
            {section === 'experiment' && (
                <div className="space-y-4">
                    {renderBackButton('Schrödinger’s Cat')}

                    {/* Main Thought Experiment Card */}
                    <div className="rounded-3xl border border-pink-200/70 bg-background/80 p-6 shadow-sm space-y-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                Schrödinger’s Cat
                            </span>
                            <h4 className="font-headline text-2xl font-bold text-foreground mt-1">
                                The Cat That’s Alive. And Dead.
                            </h4>
                        </div>

                        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                            <p>In 1935, physicist Erwin Schrödinger imagined a very strange experiment.</p>
                            <p>Put a cat in a sealed box with a quantum event that may or may not, trigger something deadly.</p>
                            <p>Until you open the box, quantum mechanics allows both possibilities to exist at once.</p>
                            <p>So the cat is both alive and dead at the same time in superposition.</p>
                            <p className="font-bold text-foreground">Weird? Absolutely.</p>
                        </div>
                    </div>

                    {/* Video: no title, just the video */}
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-purple-500/30 bg-black shadow-lg">
                        <video
                            src="/intro.mp4"
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Want to know more? */}
                    <div className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-sm flex items-center justify-between gap-4">
                        <div>
                            <h5 className="font-headline text-lg font-bold text-foreground">Want to know more?</h5>
                            <p className="text-xs text-muted-foreground">Read the full article on Wikipedia</p>
                        </div>
                        <Button asChild variant="outline" className="rounded-2xl shrink-0 gap-1.5 border-primary/30 text-primary hover:bg-primary/10 font-bold">
                            <a
                                href="https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>Wikipedia</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </Button>
                    </div>
                </div>
            )}

            {/* Modal: Badge Rule Detail Dialog */}
            {selectedBadge && (
                <Dialog open={!!selectedBadge} onOpenChange={(open) => !open && setSelectedBadge(null)}>
                    <DialogContent className="rounded-3xl p-6 border-border/60 bg-background/95 backdrop-blur-md sm:max-w-md">
                        {(() => {
                            const isUnlocked = isBadgeUnlocked(selectedBadge.id);
                            const badgeImage = badgeImageMap[selectedBadge.id] ?? defaultBadgeImage;
                            const ruleInfo = BADGE_RULES[selectedBadge.id] ?? {
                                rule: selectedBadge.description,
                                tip: 'Keep observing and experimenting in the quantum multiverse to claim this award!',
                            };

                            return (
                                <>
                                    <DialogHeader className="text-center sm:text-center">
                                        <DialogTitle className="text-2xl font-headline font-bold text-foreground">
                                            {selectedBadge.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground">
                                            Achievement Award
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="flex flex-col items-center justify-center py-4 space-y-3">
                                        <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400/20 via-primary/15 to-purple-400/20 p-2 shadow-sm flex items-center justify-center border border-border/40">
                                            <Image
                                                src={badgeImage}
                                                alt={selectedBadge.name}
                                                width={80}
                                                height={80}
                                                className="h-20 w-20 object-contain drop-shadow-md"
                                            />
                                        </div>
                                        <div>
                                            {isUnlocked ? (
                                                <Badge className="bg-emerald-500 text-white font-bold gap-1 px-2.5 py-0.5">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span>Unlocked</span>
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-muted-foreground/40 text-muted-foreground font-bold gap-1 px-2.5 py-0.5">
                                                    <Lock className="h-3.5 w-3.5" />
                                                    <span>Locked</span>
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Exact Rule Card */}
                                    <div className="space-y-2 rounded-2xl border border-amber-300/40 bg-amber-50/30 dark:bg-amber-950/20 p-4">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground flex items-center gap-1.5">
                                            <Medal className="h-3.5 w-3.5" />
                                            Award Rule
                                        </span>
                                        <p className="text-sm font-bold text-foreground leading-snug">
                                            {ruleInfo.rule}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/30">
                                            💡 <strong>Pro Tip:</strong> {ruleInfo.tip}
                                        </p>
                                    </div>

                                    <DialogFooter className="mt-2 flex sm:justify-center">
                                        <Button
                                            type="button"
                                            onClick={() => setSelectedBadge(null)}
                                            className="w-full sm:w-auto px-8 rounded-2xl font-bold bg-muted hover:bg-muted/80 text-foreground"
                                        >
                                            Close
                                        </Button>
                                    </DialogFooter>
                                </>
                            );
                        })()}
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal: Box Detail Card Dialog */}
            {selectedBox && (
                <Dialog open={!!selectedBox} onOpenChange={(open) => !open && setSelectedBox(null)}>
                    <DialogContent className="rounded-3xl p-6 border-border/60 bg-background/95 backdrop-blur-md sm:max-w-md">
                        {(() => {
                            const BoxComponent = SKIN_COMPONENTS[selectedBox.id] ?? DefaultBoxIcon;

                            return (
                                <>
                                    <DialogHeader className="text-center sm:text-center">
                                        <DialogTitle className="text-2xl font-headline font-bold text-primary">
                                            {selectedBox.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground">
                                            {selectedBox.description}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="flex flex-col items-center justify-center p-4 my-1 space-y-2">
                                        <BoxComponent className="w-28 h-28 drop-shadow-md" />
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3696C9] bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full border border-sky-200/50">
                                            <Fish className="h-3.5 w-3.5" />
                                            <span>{selectedBox.cost === 0 ? 'Free Starter Box' : `${selectedBox.cost} Fish Points`}</span>
                                        </div>
                                    </div>

                                    {/* Power Card */}
                                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3.5 text-left flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0 mt-0.5">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Box Power</span>
                                                <Badge variant="outline" className="text-[10px] font-bold border-primary/40 text-primary">
                                                    {selectedBox.power.badgeText}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-bold text-foreground">{selectedBox.power.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{selectedBox.power.description}</p>
                                        </div>
                                    </div>

                                    <DialogFooter className="mt-3 flex flex-col sm:flex-row gap-2 sm:justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setSelectedBox(null)}
                                            className="rounded-2xl font-bold"
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            asChild
                                            className="rounded-2xl font-bold bg-primary text-primary-foreground shadow-md hover:opacity-95"
                                        >
                                            <Link href="/customize" onClick={() => setSelectedBox(null)}>
                                                Equip in Customise
                                            </Link>
                                        </Button>
                                    </DialogFooter>
                                </>
                            );
                        })()}
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
