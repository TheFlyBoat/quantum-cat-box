'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoxSkin } from '@/context/box-skin-context';
import { BoxIcon, CarbonBoxIcon, CardboardBoxIcon, BlackWoodenBoxIcon, SpecialXK6BoxIcon, StoneBoxIcon, TardisBoxIcon } from '@/components/icons';
import { CircuitBoardBoxIcon } from '@/components/icons/circuit-board-box-icon';
import { CrystalBoxIcon } from '@/components/icons/crystal-box-icon';
import { GalaxyBoxIcon } from '@/components/icons/galaxy-box-icon';
import { PlushBoxIcon } from '@/components/icons/plush-box-icon';
import { SteampunkBoxIcon } from '@/components/icons/steampunk-box-icon';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useBadges } from '@/context/badge-context';
import { usePoints } from '@/context/points-context';
import { Lock, Fish } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { playFeedback } from '@/lib/audio';
import { useAuth } from '@/context/auth-context';
import { BoxSkinDialog } from '@/components/features/box-skin-dialog';
import boxSkinData from '@/lib/box-skin-data.json';

export default function CustomizePage() {
    const router = useRouter();
    const { selectedSkin, selectSkin, unlockedSkins, unlockSkin } = useBoxSkin();
    const { isBadgeUnlocked, unlockBadge } = useBadges();
    const { points, addPoints } = usePoints();
    const { toast } = useToast();
    const { storageMode, maybeShowLoginPrompt } = useAuth();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSkinForDialog, setSelectedSkinForDialog] = useState(boxSkinData.skins[0]);

    const cardboardCost = 100;

    const nudgeLogin = () => {
        if (storageMode === 'local') {
            maybeShowLoginPrompt('customize');
        }
    };

    const handleSkinClick = (skin: typeof boxSkinData.skins[0]) => {
        if (!unlockedSkins.includes(skin.id) && skin.id !== 'default' && skin.id !== 'cardboard') {
            return; // Or show a toast
        }
        setSelectedSkinForDialog(skin);
        setIsDialogOpen(true);
        playFeedback('click-1');
    };

    const handleApplySkin = () => {
        selectSkin(selectedSkinForDialog.id as any);
        if (selectedSkinForDialog.id !== 'default' && !isBadgeUnlocked('skin-changer')) {
            unlockBadge('skin-changer');
        }
        setIsDialogOpen(false);
        playFeedback('haptic-1');
        toast({
            title: 'Skin Applied!',
            description: `You are now using the ${selectedSkinForDialog.name} box.`,
        });
        router.push('/home');
    };

    const handlePurchaseCardboard = () => {
        nudgeLogin();
        if (points >= cardboardCost) {
            addPoints(-cardboardCost);
            unlockSkin('cardboard');
            selectSkin('cardboard');
            playFeedback('celebration-magic');
            toast({
                title: 'Skin Unlocked!',
                description: 'You can now use the Cardboard Box skin.',
            });
        } else {
            playFeedback('haptic-3');
            toast({
                variant: 'destructive',
                title: 'Not enough points!',
                description: `You need ${cardboardCost} Fish Points to unlock this skin.`,
            });
        }
    };

    const skinIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
        default: BoxIcon,
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

    return (
        <>
            <Card className="border-none bg-transparent shadow-none">
                <CardHeader>
                    <CardTitle className="page-title text-primary">Customise</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="box-skins" className="w-full" onValueChange={() => playFeedback('click-3')}>
                        <TabsList className="grid w-full grid-cols-2 gap-3 rounded-3xl border border-border/40 bg-background/80 p-2 text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                            <TabsTrigger
                                value="box-skins"
                                className={cn('flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:scale-[1.08] dark:data-[state=active]:bg-white', 'bg-sky-300/80 text-sky-900 dark:bg-sky-700 dark:text-sky-100')}
                            >
                                Box Skins
                            </TabsTrigger>
                            <TabsTrigger
                                value="themes"
                                className={cn('flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:scale-[1.08] dark:data-[state=active]:bg-white', 'bg-pink-300/80 text-pink-900 dark:bg-pink-700 dark:text-pink-100')}
                            >
                                Themes
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="box-skins">
                            <div className="grid grid-cols-3 gap-4">
                                {boxSkinData.skins.map((skin) => {
                                    const SkinIcon = skinIcons[skin.id];
                                    const isUnlocked = unlockedSkins.includes(skin.id);
                                    const isCardboard = skin.id === 'cardboard';

                                    if (isCardboard && !isUnlocked) {
                                        return (
                                            <AlertDialog key={skin.id}>
                                                <AlertDialogTrigger asChild>
                                                    <Card className={cn('flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm transition-colors cursor-pointer')}>
                                                        <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">
                                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                                <Lock className="w-8 h-8" />
                                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                                    <Fish className="w-3 h-3" />
                                                                    {cardboardCost}
                                                                </Badge>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter className="bg-background/60 p-2 text-center">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{skin.name}</p>
                                                        </CardFooter>
                                                    </Card>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Unlock Cardboard Skin?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will cost {cardboardCost} Fish Points. You currently have {points} points.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => playFeedback('click-2')}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handlePurchaseCardboard} disabled={points < cardboardCost}>
                                                            Unlock for {cardboardCost} Points
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        );
                                    }

                                    return (
                                        <Card
                                            key={skin.id}
                                            onClick={() => handleSkinClick(skin)}
                                            className={cn(
                                                'flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors',
                                                selectedSkin === skin.id && 'border-primary',
                                                !isUnlocked && skin.id !== 'default' && 'opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">
                                                {SkinIcon ? <SkinIcon className="w-16 h-16" /> : <Lock className="w-8 h-8 text-muted-foreground" />}
                                            </CardContent>
                                            <CardFooter className="bg-background/60 p-2 text-center">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{skin.name}</p>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                        <TabsContent value="themes">
                            <p className="text-muted-foreground text-center py-8">More customization options coming soon!</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <BoxSkinDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                skin={selectedSkinForDialog}
                onApply={handleApplySkin}
            />
        </>
    );
}

