
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoxSkin } from '@/context/box-skin-context';
import { BoxIcon, CarbonBoxIcon, CardboardBoxIcon, BlackWoodenBoxIcon, SpecialXK6BoxIcon, StoneBoxIcon, TardisBoxIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useBadges } from '@/context/badge-context';
import { usePoints } from '@/context/points-context';
import { Lock, Fish } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { playSound } from '@/lib/audio';
import { useAuth } from '@/context/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';



export default function CustomizePage() {

    const { selectedSkin, selectSkin, unlockedSkins, unlockSkin } = useBoxSkin();

    const { isBadgeUnlocked, unlockBadge } = useBadges();

    const { points, addPoints } = usePoints();

    const { toast } = useToast();

    const { storageMode, maybeShowLoginPrompt } = useAuth();



    const cardboardCost = 100;

    const isCardboardUnlocked = unlockedSkins.includes('cardboard');



    const nudgeLogin = () => {

        if (storageMode === 'local') {

            maybeShowLoginPrompt('customize');

        }

    };



    const handleSelectSkin = (skin: 'default' | 'carbon' | 'cardboard' | 'black-wooden' | 'special-xk6' | 'stone' | 'tardis') => {

        nudgeLogin();



        if (skin === 'cardboard' && !isCardboardUnlocked) {

            // This is handled by the AlertDialog now

            return;

        }



        if (skin !== 'default' && !isBadgeUnlocked('skin-changer')) {

            unlockBadge('skin-changer');

        }

        selectSkin(skin);

    };



    const handlePurchaseCardboard = () => {

        nudgeLogin();



        if (points >= cardboardCost) {

            addPoints(-cardboardCost);

            unlockSkin('cardboard');

            selectSkin('cardboard');

            playSound('celebration-magic');

            toast({

                title: "Skin Unlocked!",

                description: "You can now use the Cardboard Box skin.",

            });

        } else {

            playSound('haptic-3');

            toast({

                variant: 'destructive',

                title: "Not enough points!",

                description: `You need ${cardboardCost} Fish Points to unlock this skin.`,

            });

        }

    }



    return (

        <Card className="border-none bg-transparent shadow-none">

            <CardHeader>

                <CardTitle className="page-title text-primary">Customise</CardTitle>

            </CardHeader>

            <CardContent>

                <Tabs defaultValue="box-skins" className="w-full">

                    {(() => {
                        const tabBaseClass =
                            'flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:scale-[1.08] dark:data-[state=active]:bg-white';

                        return (
                            <TabsList className="grid w-full grid-cols-2 gap-3 rounded-3xl border border-border/40 bg-background/80 p-2 text-[11px] font-semibold uppercase tracking-wide shadow-sm">

                                <TabsTrigger
                                    value="box-skins"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-sky-300/80 text-sky-900 dark:bg-sky-700 dark:text-sky-100'
                                    )}
                                >
                                    Box Skins
                                </TabsTrigger>

                                <TabsTrigger
                                    value="themes"
                                    className={cn(
                                        tabBaseClass,
                                        'bg-pink-300/80 text-pink-900 dark:bg-pink-700 dark:text-pink-100'
                                    )}
                                >
                                    Themes
                                </TabsTrigger>

                            </TabsList>
                        );
                    })()}

                    <TabsContent value="box-skins">

                        <div className="grid grid-cols-3 gap-4">

                            <TooltipProvider delayDuration={120}>

                                <Tooltip>

                                    <TooltipTrigger asChild>

                                        <Card 

                                            onClick={() => handleSelectSkin('default')}

                                            className={cn(

                                                "flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors",

                                                selectedSkin === 'default' && 'border-primary'

                                            )}

                                        >

                                             <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">

                                                <BoxIcon className="w-16 h-16" />

                                             </CardContent>

                                            <CardFooter className="bg-background/60 p-2 text-center">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Wooden</p>

                                            </CardFooter>

                                        </Card>

                                    </TooltipTrigger>

                                    <TooltipContent side="top">

                                        <p>Classic wooden crate tuned for baseline collapses.</p>

                                    </TooltipContent>

                                </Tooltip>

                                <Tooltip>

                                    <TooltipTrigger asChild>

                                        <Card 

                                            onClick={() => handleSelectSkin('carbon')}

                                            className={cn(

                                                "flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors",

                                                selectedSkin === 'carbon' && 'border-primary'

                                            )}

                                        >

                                             <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">

                                                <CarbonBoxIcon className="w-16 h-16" />

                                             </CardContent>

                                            <CardFooter className="bg-background/60 p-2 text-center">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Carbon</p>

                                            </CardFooter>

                                        </Card>

                                    </TooltipTrigger>

                                    <TooltipContent side="top">

                                        <p>A sleek, dark carbon fiber box.</p>

                                    </TooltipContent>

                                </Tooltip>

                                

                                <AlertDialog>

                                    <Tooltip>

                                        <TooltipTrigger asChild>

                                            <AlertDialogTrigger asChild>

                                                <Card 

                                                    onClick={() => isCardboardUnlocked && handleSelectSkin('cardboard')}

                                                    className={cn(

                                                        "flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm transition-colors",

                                                        isCardboardUnlocked ? 'cursor-pointer' : 'cursor-default',

                                                        selectedSkin === 'cardboard' && 'border-primary'

                                                    )}

                                                >

                                                     <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">

                                                       {isCardboardUnlocked ? (

                                                           <CardboardBoxIcon className="w-16 h-16" />

                                                        ) : (

                                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">

                                                                <Lock className="w-8 h-8" />

                                                                <Badge variant="secondary" className="flex items-center gap-1">

                                                                    <Fish className="w-3 h-3"/>

                                                                    {cardboardCost}

                                                                </Badge>

                                                            </div>

                                                        )}

                                                     </CardContent>

                                                    <CardFooter className="bg-background/60 p-2 text-center">

                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cardboard</p>

                                                    </CardFooter>

                                                </Card>

                                            </AlertDialogTrigger>

                                        </TooltipTrigger>

                                        <TooltipContent side="top">

                                            <p>{isCardboardUnlocked ? 'Recycled timelines keep things whimsically unpredictable.' : `Unlock with ${cardboardCost} Fish Points to embrace paradox thrift.`}</p>

                                        </TooltipContent>

                                    </Tooltip>

                                    {!isCardboardUnlocked && (

                                        <AlertDialogContent>

                                            <AlertDialogHeader>

                                                <AlertDialogTitle>Unlock Cardboard Skin?</AlertDialogTitle>

                                                <AlertDialogDescription>

                                                    This will cost {cardboardCost} Fish Points. You currently have {points} points.

                                                </AlertDialogDescription>

                                            </AlertDialogHeader>

                                            <AlertDialogFooter>

                                                <AlertDialogCancel onClick={() => playSound('click-2')}>Cancel</AlertDialogCancel>

                                                <AlertDialogAction onClick={handlePurchaseCardboard} disabled={points < cardboardCost}>

                                                    Unlock for {cardboardCost} Points

                                                </AlertDialogAction>

                                            </AlertDialogFooter>

                                        </AlertDialogContent>

                                    )}

                                </AlertDialog>

                                <Card 

                                    onClick={() => handleSelectSkin('black-wooden')}

                                    className={cn(

                                        "flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors",

                                        selectedSkin === 'black-wooden' && 'border-primary'

                                    )}

                                >

                                     <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">

                                        <BlackWoodenBoxIcon className="w-16 h-16" />

                                     </CardContent>

                                    <CardFooter className="bg-background/60 p-2 text-center">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Black Wooden</p>

                                    </CardFooter>

                                </Card>

                                <Card 

                                    onClick={() => handleSelectSkin('special-xk6')}

                                    className={cn(

                                        "flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors",

                                        selectedSkin === 'special-xk6' && 'border-primary'

                                    )}

                                >

                                     <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">

                                        <SpecialXK6BoxIcon className="w-16 h-16" />

                                     </CardContent>

                                    <CardFooter className="bg-background/60 p-2 text-center">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Special XK6</p>

                                    </CardFooter>

                                </Card>

                                <Card 

                                    onClick={() => handleSelectSkin('stone')}

                                    className={cn(

                                        "flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors",

                                        selectedSkin === 'stone' && 'border-primary'

                                    )}

                                >

                                     <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">

                                        <StoneBoxIcon className="w-16 h-16" />

                                     </CardContent>

                                    <CardFooter className="bg-background/60 p-2 text-center">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stone</p>

                                    </CardFooter>

                                </Card>

                                <Tooltip>

                                    <TooltipTrigger asChild>

                                        <Card 

                                            onClick={() => handleSelectSkin('tardis')}

                                            className={cn(

                                                "flex aspect-square flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm cursor-pointer transition-colors",

                                                selectedSkin === 'tardis' && 'border-primary'

                                            )}

                                        >

                                             <CardContent className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3">

                                                <TardisBoxIcon className="w-16 h-16" />

                                             </CardContent>

                                            <CardFooter className="bg-background/60 p-2 text-center">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time Capsule</p>

                                            </CardFooter>

                                        </Card>

                                    </TooltipTrigger>

                                    <TooltipContent side="top">

                                        <p>Temporal shielding for cats who open boxes before they exist.</p>

                                    </TooltipContent>

                                </Tooltip>

                            </TooltipProvider>

                            {Array.from({ length: 5 }).map((_, index) => (
                                <Card
                                    key={`placeholder-skin-${index}`}
                                    className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-dashed border-muted-foreground/40 bg-background/60 shadow-inner"
                                >
                                    <CardContent className="flex flex-1 items-center justify-center bg-gradient-to-br from-muted/30 via-transparent to-transparent p-3">
                                        <div className="relative flex h-full w-full items-center justify-center">
                                            <Lock className="h-10 w-10 text-muted-foreground/70" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-background/60 p-2 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Coming Soon</p>
                                    </CardFooter>
                                </Card>
                            ))}

                        </div>

                    </TabsContent>

                    <TabsContent value="themes">

                        <p className="text-muted-foreground text-center py-8">More customization options coming soon!</p>

                    </TabsContent>

                </Tabs>

            </CardContent>

        </Card>

    );

}

    
