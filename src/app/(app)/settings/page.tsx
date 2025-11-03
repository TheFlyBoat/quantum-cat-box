'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import { useFeedback } from '@/context/feedback-context';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { User, Volume2, VolumeX, Moon, Sun, RotateCcw, Accessibility, Vibrate } from 'lucide-react';
import { playSound } from '@/lib/audio';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function SettingsPage() {
    const { user, reset } = useAuth();
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="page-title text-teal-500">Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="account" className="bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 data-[state=active]:bg-background data-[state=active]:text-foreground">Account</TabsTrigger>
                        <TabsTrigger value="audio" className="bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 data-[state=active]:bg-background data-[state=active]:text-foreground">Audio</TabsTrigger>
                        <TabsTrigger value="appearance" className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 data-[state=active]:bg-background data-[state=active]:text-foreground">Appearance</TabsTrigger>
                        <TabsTrigger value="reset" className="bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200 data-[state=active]:bg-background data-[state=active]:text-foreground">Reset</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-start gap-4">
                                    {user && user !== 'guest' ? (
                                        <>
                                            <Badge variant="outline">Logged in as: {user.email}</Badge>
                                            <Button variant="outline" onClick={logout}>
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="secondary">Guest Mode</Badge>
                                            <Link href="/login">
                                                <Button>Log In</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="audio">
                        <Card>
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="sound-toggle" className="flex items-center gap-2 cursor-pointer">
                                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                        <span>Sound Effects</span>
                                    </Label>
                                    <Switch
                                        id="sound-toggle"
                                        checked={soundEnabled}
                                        onCheckedChange={handleSoundToggle}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="vibration-toggle" className="flex items-center gap-2 cursor-pointer">
                                        <Vibrate className="w-5 h-5" />
                                        <span>Vibrations</span>
                                    </Label>
                                    <Switch
                                        id="vibration-toggle"
                                        checked={vibrationEnabled}
                                        onCheckedChange={handleVibrationToggle}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="volume-slider" className="flex items-center gap-2 cursor-pointer">
                                        <span>Volume</span>
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="appearance">
                        <Card>
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="theme-toggle" className="flex items-center gap-2 cursor-pointer">
                                        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                        <span>Dark Mode</span>
                                    </Label>
                                    <Switch
                                        id="theme-toggle"
                                        checked={theme === 'dark'}
                                        onCheckedChange={handleThemeToggle}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="reduce-motion-toggle" className="flex items-center gap-2 cursor-pointer">
                                        <Accessibility className="w-5 h-5" />
                                        <span>Reduce Motion</span>
                                    </Label>
                                    <Switch
                                        id="reduce-motion-toggle"
                                        checked={reduceMotion}
                                        onCheckedChange={handleMotionToggle}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="reset">
                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="section-title flex items-center gap-2 text-destructive"><RotateCcw /> Reset Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Reset All Progress</Button>
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}