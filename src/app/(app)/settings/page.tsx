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
import { Volume2, VolumeX, Moon, Sun, RotateCcw, Accessibility, Vibrate, HelpCircle, MessageSquare } from 'lucide-react';
import { playSound } from '@/lib/audio';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    const { reset } = useAuth();
    const { soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled, volume, setVolume, reduceMotion, setReduceMotion } = useFeedback();
    const { theme, setTheme } = useTheme();

    const handleSoundToggle = (checked: boolean) => {
        playSound(checked ? 'toggle-on' : 'toggle-off');
        setSoundEnabled(checked);
    };

    const handleVibrationToggle = (checked: boolean) => {
        setVibrationEnabled(checked);
    };

    const handleThemeToggle = (checked: boolean) => {
        playSound(checked ? 'toggle-on' : 'toggle-off');
        setTheme(checked ? 'dark' : 'light');
    };

    const handleMotionToggle = (checked: boolean) => {
        playSound(checked ? 'toggle-on' : 'toggle-off');
        setReduceMotion(checked);
    };

    const handleReset = () => {
        playSound('haptic-3');
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
                <Tabs defaultValue="system" className="w-full">
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
                                    Wipes cats, badges, points, and diary entries from this device.
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
                                            <AlertDialogCancel onClick={() => playSound('click-2')}>Cancel</AlertDialogCancel>
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
                                    <p className={bodyTextClass}>Created by FlyBoat Creative 2025</p>
                                </div>
                            </div>
                            <div className="space-y-3 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                <p className={sectionLabelClass}>Credits</p>
                                <p className={bodyTextClass}>
                                    Built with Next.js, React, Tailwind CSS, and Genkit. Special thanks to the open-source community.
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
                        <div className="space-y-6 pt-2">
                            <div className="space-y-4 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm">
                                <p className={cn(sectionLabelClass, 'flex items-center gap-2 text-primary')}>
                                    <HelpCircle className="h-4 w-4" />
                                    How to Play
                                </p>
                                <div className="space-y-4">
                                    <p className={`${bodyTextClass} font-semibold text-center`}>
                                        Tap the Quantum Box to observe a new cat.
                                    </p>
                                    <p className={bodyTextClass}>
                                        Every observation collapses the quantum superposition. You might reveal an <span className="font-semibold text-green-500">Alive</span> cat, a <span className="font-semibold text-red-500">Dead</span> cat, or something delightfully <span className="font-semibold text-purple-500">Paradoxical</span>.
                                    </p>
                                    <p className={bodyTextClass}>
                                        Each cat arrives with a unique message. Save your favorites to the diary, or share them with friends to earn bonus Fish Points.
                                    </p>
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/70">
                                        Deeper tutorial coming soon.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
