'use client';

import Link from 'next/link';
import * as React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useFeedback } from '@/context/feedback-context';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { SettingsHowGuide } from '@/components/features/settings-how-guide';

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
    Heart,
    ChevronRight,
} from 'lucide-react';
import { playFeedback } from '@/lib/audio';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

function SettingsContent() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'how' ? 'how' : searchParams.get('tab') === 'info' ? 'info' : 'system';
    const [currentTab, setCurrentTab] = React.useState(initialTab);

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



    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="page-title text-teal-500">Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={currentTab} onValueChange={(val) => { playFeedback('click-3'); setCurrentTab(val); }} className="w-full">
                    {(() => {
                        const tabBaseClass =
                            'flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:scale-[1.06] data-[state=active]:shadow-md data-[state=active]:font-black';

                        return (
                            <TabsList className="grid w-full grid-cols-3 gap-3 rounded-3xl border border-border/40 bg-background/80 p-2 text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                                <TabsTrigger
                                    value="system"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-sky-100 text-sky-800 hover:bg-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300 data-[state=active]:bg-[#3696C9] data-[state=active]:text-white dark:data-[state=active]:bg-[#3696C9] dark:data-[state=active]:text-white'
                                    )}
                                >
                                    System
                                </TabsTrigger>
                                <TabsTrigger
                                    value="info"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-emerald-100 text-emerald-800 hover:bg-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-600 dark:data-[state=active]:text-white'
                                    )}
                                >
                                    Info
                                </TabsTrigger>
                                <TabsTrigger
                                    value="how"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-pink-100 text-pink-800 hover:bg-pink-200/70 dark:bg-pink-950/60 dark:text-pink-300 data-[state=active]:bg-[#FF809F] data-[state=active]:text-white dark:data-[state=active]:bg-[#FF809F] dark:data-[state=active]:text-white'
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
                        <div className="space-y-6 pt-4">
                            {/* Hero Section */}
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="relative h-24 w-24 overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-500 to-sky-500 p-1 shadow-lg">
                                    <div className="flex h-full w-full items-center justify-center rounded-[1.8rem] bg-background">
                                        <Image src="/favicon.svg" alt="App Icon" width={64} height={64} className="h-16 w-16" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-headline text-2xl font-bold text-foreground">The Quantum Cat</h3>
                                    <p className="text-sm font-medium text-muted-foreground">Version 4.1 • FlyBoat Creative</p>
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="space-y-3">
                                <div className="rounded-3xl border border-border/60 bg-background/50 p-1 shadow-sm backdrop-blur-sm">
                                    <div className="flex flex-col divide-y divide-border/40">
                                        <Link href="/privacy" className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30">
                                            <span className={rowTextClass}>Privacy Policy</span>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                        <Link href="/terms" className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30">
                                            <span className={rowTextClass}>Terms of Service</span>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                            <Heart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <p className={sectionLabelClass}>Credits</p>
                                    </div>
                                    <p className={cn(bodyTextClass, "leading-relaxed text-muted-foreground")}>
                                        Designed & Developed by <strong>Adam Colla and Flyboat team</strong>.<br/>
                                        Powered by <strong>Genkit</strong>.<br/>
                                        Special thanks to the open-source community, ai agents and our friends for the feedbacks.
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                            <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className={sectionLabelClass}>Contact</p>
                                    </div>
                                    <a
                                        href="mailto:adam@flyboat.online?subject=Quantum%20Cat%20Support"
                                        className="group flex items-center gap-3 rounded-xl border border-border/40 bg-background p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Support</span>
                                            <span className="text-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">adam@flyboat.online</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="how">
                        <SettingsHowGuide />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
    return (
        <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading settings...</div>}>
            <SettingsContent />
        </React.Suspense>
    );
}
