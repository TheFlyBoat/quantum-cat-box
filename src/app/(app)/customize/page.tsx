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
    const { selectedSkin, selectSkin, isSkinUnlocked, unlockSkin, getSkinCost } = useBoxSkin();
    const { isBadgeUnlocked, unlockBadge } = useBadges();
    const { points } = usePoints();
    const { toast } = useToast();
    const { storageMode, maybeShowLoginPrompt } = useAuth();

    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [selectedSkinForApplyDialog, setSelectedSkinForApplyDialog] = useState(boxSkinData.skins[0]);

    const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
    const [selectedSkinForPurchaseDialog, setSelectedSkinForPurchaseDialog] = useState(boxSkinData.skins[0]);

    const nudgeLogin = () => {
        if (storageMode === 'local') {
            maybeShowLoginPrompt('customize');
        }
    };

    const handleSkinClick = (skin: typeof boxSkinData.skins[number]) => {
        nudgeLogin();
        if (isSkinUnlocked(skin.id)) {
            setSelectedSkinForApplyDialog(skin);
            setIsApplyDialogOpen(true);
            playFeedback('click-1');
        } else {
            setSelectedSkinForPurchaseDialog(skin);
            setIsPurchaseDialogOpen(true);
            playFeedback('click-2');
        }
    };

    const handleApplySkin = () => {
        selectSkin(selectedSkinForApplyDialog.id);
        if (selectedSkinForApplyDialog.id !== 'default' && !isBadgeUnlocked('skin-changer')) {
            unlockBadge('skin-changer');
        }
        setIsApplyDialogOpen(false);
        playFeedback('haptic-1');
        toast({
            title: 'Skin Applied!',
            description: `You are now using the ${selectedSkinForApplyDialog.name} box.`,
        });
        router.push('/home');
    };

    const handlePurchaseSkin = () => {
        const success = unlockSkin(selectedSkinForPurchaseDialog.id);
        if (success) {
            playFeedback('celebration-magic');
            // Optionally select the skin immediately after purchase
            selectSkin(selectedSkinForPurchaseDialog.id);
            router.push('/home');
        }
        setIsPurchaseDialogOpen(false);
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
                                    const unlocked = isSkinUnlocked(skin.id);
                                    const cost = getSkinCost(skin.id);
                                    const canAfford = points >= cost;

                                    return (
                                        <Card
                                            key={skin.id}
                                            onClick={() => handleSkinClick(skin)}
                                            className={cn(
                                                'flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors',
                                                selectedSkin === skin.id && 'border-primary',
                                                !unlocked && 'opacity-50',
                                                !unlocked && !canAfford && 'cursor-not-allowed',
                                                !unlocked && canAfford && 'hover:border-primary'
                                            )}
                                        >
                                            <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">
                                                {SkinIcon ? (
                                                    <SkinIcon className={cn("w-16 h-16", !unlocked && "grayscale")} />
                                                ) : (
                                                    <Lock className="w-8 h-8 text-muted-foreground" />
                                                )}
                                                {!unlocked && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                                                        <Lock className="w-8 h-8" />
                                                        {cost > 0 && (
                                                            <Badge variant="secondary" className="mt-2 flex items-center gap-1">
                                                                <Fish className="w-3 h-3" />
                                                                {cost}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
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

            {/* Apply Skin Dialog */}
            <BoxSkinDialog
                open={isApplyDialogOpen}
                onOpenChange={setIsApplyDialogOpen}
                skin={selectedSkinForApplyDialog}
                onApply={handleApplySkin}
            />

            {/* Purchase Skin Dialog */}
            <AlertDialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unlock {selectedSkinForPurchaseDialog.name} Skin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cost {getSkinCost(selectedSkinForPurchaseDialog.id)} Fish Points. You currently have {points} points.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => playFeedback('click-2')}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handlePurchaseSkin}
                            disabled={points < getSkinCost(selectedSkinForPurchaseDialog.id)}
                        >
                            Unlock for {getSkinCost(selectedSkinForPurchaseDialog.id)} Points
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

