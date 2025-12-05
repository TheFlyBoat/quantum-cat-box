'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import { useFeedback } from '@/context/feedback-context';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
    Volume2,
    VolumeX,
    Moon,
    Sun,
    RotateCcw,
    Accessibility,
    Vibrate,
    MessageSquare,
    Fish,
    Medal,
    Cat,
    Heart,
    BoxIcon,
    GemIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { playFeedback } from '@/lib/audio';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    const { reset } = useAuth();
    const { soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled, volume, setVolume, reduceMotion, setReduceMotion } = useFeedback();
    const { theme, setTheme } = useTheme();

    const handleSoundToggle = (checked: boolean) => {
        playFeedback(checked ? 'toggle-on' : 'toggle-off');
        setSoundEnabled(checked);
    };

    const handleVibrationToggle = (checked: boolean) => {
        playFeedback('haptic-1');
        setVibrationEnabled(checked);
    };

    const handleThemeToggle = (checked: boolean) => {
        playFeedback(checked ? 'toggle-on' : 'toggle-off');
        setTheme(checked ? 'dark' : 'light');
    };

    const handleMotionToggle = (checked: boolean) => {
        playFeedback(checked ? 'toggle-on' : 'toggle-off');
        setReduceMotion(checked);
    };

    const handleReset = () => {
        playFeedback('haptic-3');
        reset();
    };

    const sectionLabelClass = "text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground";
    const rowTextClass = "text-sm font-medium text-foreground";
    const bodyTextClass = "text-sm text-foreground";

    type HowTip = {
        text: string;
        icon?: LucideIcon;
        iconColorClass?: string;
        iconBgClass?: string;
    };

    const howCards: Array<{
        key: string;
        icon: LucideIcon;
        title: string;
        summary: string;
        tips: HowTip[];
        borderClass: string;
        iconColorClass: string;
        iconBgClass: string;
        bulletClass: string;
    }> = [
            {
                key: 'observe',
                icon: BoxIcon,
                title: 'Open the Box',
                summary: 'Tap to open the box and let the universe decide your reality.',
                tips: [
                    {
                        icon: Cat,
                        text: 'Reality Reveal: Alive, Dead, or Paradox Cat appears with a message meant only for you.',
                        iconColorClass: 'text-[#7C3AED]',
                    },
                    {
                        icon: Heart,
                        text: 'Save the Moment: Tap the heart right after the reveal to save your message in the Cat’s Diary..',
                        iconColorClass: 'text-[#EC4899]',
                    },
                ],
                borderClass: 'border-rose-200/70 dark:border-rose-400/40',
                iconColorClass: 'text-[#EC4899]',
                iconBgClass: 'bg-rose-100 dark:bg-rose-900/30',
                bulletClass: 'bg-rose-400/70',
            },
            {
                key: 'fish',
                icon: Fish,
                title: 'Fish Points',
                summary: 'Fish Points are your universal currency, trade them for new experiments, box skins and unlock new dimensions.',
                tips: [
                    { text: 'Each cat state worth fish points.' },
                    { text: 'Share the outcome to earn +10 Fish Points instantly.' },
                    { text: 'Some timelines drop mystery gifts after celebrations.' },
                ],
                borderClass: 'border-teal-200/70 dark:border-teal-400/40',
                iconColorClass: 'text-[#0F766E]',
                iconBgClass: 'bg-teal-100 dark:bg-teal-900/30',
                bulletClass: 'bg-teal-400/70',
            },
            {
                key: 'badges',
                icon: Medal,
                title: 'Badges',
                summary: 'Earn shiny badges for your achievements.',
                tips: [
                    { text: 'Reveal the same cat three times in a row to chase the Quantum Echo legend.' },
                    { text: 'Keep a 3-day streak to win the Curious Kitten badge.' },
                ],
                borderClass: 'border-amber-200/70 dark:border-amber-400/40',
                iconColorClass: 'text-[#D97706]',
                iconBgClass: 'bg-amber-100 dark:bg-amber-900/30',
                bulletClass: 'bg-amber-400/70',
            },
            {
                key: 'streaks',
                icon: GemIcon,
                title: 'Hidden Gem',
                summary: 'An Infinite box is hidden somewhere in the app.',
                tips: [
                    { text: 'The fish points will be useful for the next features.' },
                    { text: 'The app is currently in development. Check in for new features soon' },
                    { text: 'Send us feedback on: hello@tquantumcat.app.' },
                ],
                borderClass: 'border-lime-200/70 dark:border-lime-400/40',
                iconColorClass: 'text-[#3F6212]',
                iconBgClass: 'bg-lime-100 dark:bg-lime-900/30',
                bulletClass: 'bg-lime-400/70',
            },
        ];

    const totalHowSteps = howCards.length;
    const [currentHowIndex, setCurrentHowIndex] = React.useState(0);

    const goToIndex = React.useCallback((index: number) => {
        playFeedback('click-1');
        setCurrentHowIndex(Math.max(0, Math.min(index, totalHowSteps - 1)));
    }, [totalHowSteps]);

    const goNext = React.useCallback(() => {
        playFeedback('click-3');
        setCurrentHowIndex(prev => (prev + 1) % totalHowSteps);
    }, [totalHowSteps]);

    const handleAdvance = React.useCallback(() => {
        goNext();
    }, [goNext]);

    const currentHowCard = howCards[currentHowIndex];

    if (!currentHowCard) {
        // This can happen if the index is out of bounds, though theoretically covered by goNext and goToIndex.
        // As a safeguard, reset to the first card.
        setCurrentHowIndex(0);
        return null;
    }

    const CurrentHowIcon = currentHowCard.icon;

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="page-title text-teal-500">Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="system" className="w-full" onValueChange={() => playFeedback('click-3')}>
                    {(() => {
                        const tabBaseClass =
                            'flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:scale-[1.08] dark:data-[state=active]:bg-white';

                        return (
                            <TabsList className="grid w-full grid-cols-3 gap-3 rounded-3xl border border-border/40 bg-background/80 p-2 text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                                <TabsTrigger
                                    value="system"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-sky-300/80 text-sky-900 dark:bg-sky-700 dark:text-sky-100'
                                    )}
                                >
                                    System
                                </TabsTrigger>
                                <TabsTrigger
                                    value="info"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-lime-300/80 text-lime-900 dark:bg-lime-700 dark:text-lime-100'
                                    )}
                                >
                                    Info
                                </TabsTrigger>
                                <TabsTrigger
                                    value="how"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-pink-300/80 text-pink-900 dark:bg-pink-700 dark:text-pink-100'
                                    )}
                                >
                                    How
                                </TabsTrigger>
                            </TabsList>
                        );
                    })()}
                    <TabsContent value="system">
                        <div className="space-y-6 pt-2">
                            <div className="space-y-4 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                <p className={sectionLabelClass}>Audio</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="sound-toggle" className="flex items-center gap-2 cursor-pointer">
                                            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                                            <span className={rowTextClass}>Sound Effects</span>
                                        </Label>
                                        <Switch
                                            id="sound-toggle"
                                            checked={soundEnabled}
                                            onCheckedChange={handleSoundToggle}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="vibration-toggle" className="flex items-center gap-2 cursor-pointer">
                                            <Vibrate className="h-5 w-5" />
                                            <span className={rowTextClass}>Vibrations</span>
                                        </Label>
                                        <Switch
                                            id="vibration-toggle"
                                            checked={vibrationEnabled}
                                            onCheckedChange={handleVibrationToggle}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="volume-slider" className="flex items-center gap-2 cursor-pointer">
                                            <span className={rowTextClass}>Volume</span>
                                        </Label>
                                        <Slider
                                            id="volume-slider"
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={[volume]}
                                            onValueChange={(value) => setVolume(value[0])}
                                            className="w-24"
                                            disabled={!soundEnabled}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                <p className={sectionLabelClass}>Appearance</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="theme-toggle" className="flex items-center gap-2 cursor-pointer">
                                            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                            <span className={rowTextClass}>Dark Mode</span>
                                        </Label>
                                        <Switch
                                            id="theme-toggle"
                                            checked={theme === 'dark'}
                                            onCheckedChange={handleThemeToggle}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="reduce-motion-toggle" className="flex items-center gap-2 cursor-pointer">
                                            <Accessibility className="h-5 w-5" />
                                            <span className={rowTextClass}>Reduce Motion</span>
                                        </Label>
                                        <Switch
                                            id="reduce-motion-toggle"
                                            checked={reduceMotion}
                                            onCheckedChange={handleMotionToggle}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-destructive/40 bg-destructive/10 p-6 shadow-sm">
                                <p className={cn(sectionLabelClass, 'flex items-center gap-2 text-destructive')}>
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Progress
                                </p>
                                <p className={`${bodyTextClass} mt-2 text-destructive/80`}>

                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="mt-4">
                                            Reset All Progress
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete all your progress, including cats, badges, and points.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => playFeedback('click-2')}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <Button variant="destructive" onClick={handleReset}>Reset</Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="info">
                        <div className="space-y-6 pt-2">
                            <div className="space-y-3 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                <p className={sectionLabelClass}>About</p>
                                <div className="space-y-1">
                                    <p className={`${rowTextClass} font-semibold`}>The Quantum Cat</p>
                                    <p className={bodyTextClass}>Version 3.1</p>
                                    <p className={bodyTextClass}>FlyBoat Creative 2025</p>
                                </div>
                            </div>
                            <div className="space-y-3 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                <p className={sectionLabelClass}>Credits</p>
                                <p className={bodyTextClass}>
                                    Adam Colla, ChatGPT Codex, Gemini CLI and a Special thanks to the open-source community and to my friends testing.
                                </p>
                            </div>
                            <div className="space-y-3 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                <p className={sectionLabelClass}>Contact</p>
                                <a
                                    href="mailto:hello@thequantumcat.app?subject=Quantum%20Cat%20Contact"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-400"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    hello@thequantumcat.app
                                </a>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="how">
                        <div className="pt-2">
                            <div
                                className={cn(
                                    'space-y-4 rounded-[28px] border bg-background/95 p-5 transition',
                                    currentHowCard.borderClass,
                                )}
                            >
                                <p className={cn(sectionLabelClass, 'text-pink-600 dark:text-pink-200')}>
                                    How to Play
                                </p>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleAdvance}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            handleAdvance();
                                        }
                                    }}
                                    className={cn(
                                        'group space-y-4 rounded-3xl border border-white/15 bg-white/10 p-5 text-left outline-none transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10',
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <CurrentHowIcon className={cn('h-6 w-6', currentHowCard.iconBgClass, currentHowCard.iconBgClass?.includes('text') ? '' : 'text-current')} />
                                        <div>
                                            <p className="text-base font-semibold text-foreground">{currentHowCard.title}</p>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/55">
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`${bodyTextClass} text-foreground/80`}>{currentHowCard.summary}</p>
                                    <ul className="space-y-2 text-left">
                                        {currentHowCard.tips.map((tip, index) => {
                                            const TipIcon = tip.icon;
                                            return (
                                                <li
                                                    key={`${currentHowCard.key}-tip-${index}`}
                                                    className="flex items-start gap-3 text-sm text-foreground/75"
                                                >
                                                    {TipIcon ? (
                                                        <TipIcon
                                                            className={cn(
                                                                'mt-[0.15rem] h-5 w-5 flex-shrink-0',
                                                                tip.iconColorClass ?? 'text-foreground',
                                                            )}
                                                            strokeWidth={1.75}
                                                        />
                                                    ) : (
                                                        <span
                                                            className={cn(
                                                                'mt-[0.35rem] h-2 w-2 flex-shrink-0 rounded-full',
                                                                currentHowCard.bulletClass,
                                                            )}
                                                        />
                                                    )}
                                                    <span>{tip.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                {currentHowCard.key === 'hidden' && (
                                    <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground/60">
                                        Triple-tap Customise to launch the hidden mini-game.
                                    </p>
                                )}
                                <div className="flex items-center justify-center gap-2 pt-1">
                                    {howCards.map((card, index) => (
                                        <button
                                            key={card.key}
                                            type="button"
                                            onClick={() => goToIndex(index)}
                                            className={cn(
                                                'h-2 w-2 rounded-full transition',
                                                index === currentHowIndex ? 'bg-foreground' : 'bg-foreground/20 hover:bg-foreground/40',
                                            )}
                                            aria-label={`Go to tutorial step ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
