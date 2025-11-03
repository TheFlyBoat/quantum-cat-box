
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoxSkin } from '@/context/box-skin-context';
import { BoxIcon, CarbonBoxIcon, CardboardBoxIcon, BlackWoodenBoxIcon, SpecialXK6BoxIcon, StoneBoxIcon } from '@/components/icons';
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



    const handleSelectSkin = (skin: 'default' | 'carbon' | 'cardboard' | 'black-wooden' | 'special-xk6' | 'stone') => {

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

        <Card>

            <CardHeader>

                <CardTitle className="page-title text-primary">Customise</CardTitle>

            </CardHeader>

            <CardContent>

                <Tabs defaultValue="box-skins" className="w-full">

                    <TabsList className="grid w-full grid-cols-2">

                        <TabsTrigger value="box-skins">Box Skins</TabsTrigger>

                        <TabsTrigger value="other">Other</TabsTrigger>

                    </TabsList>

                    <TabsContent value="box-skins">

                        <div className="grid grid-cols-3 gap-4">

                            <TooltipProvider delayDuration={120}>

                                <Tooltip>

                                    <TooltipTrigger asChild>

                                        <Card 

                                            onClick={() => handleSelectSkin('default')}

                                            className={cn(

                                                "overflow-hidden aspect-square flex flex-col cursor-pointer",

                                                selectedSkin === 'default' && 'border-primary'

                                            )}

                                        >

                                             <CardContent className="p-2 flex-grow h-full flex items-center justify-center bg-muted/50 relative">

                                                <BoxIcon className="w-16 h-16" />

                                             </CardContent>

                                            <CardFooter className="p-2 justify-center bg-background/50">

                                                <p className="body-text font-bold text-center">Wooden</p>

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

                                                "overflow-hidden aspect-square flex flex-col cursor-pointer",

                                                selectedSkin === 'carbon' && 'border-primary'

                                            )}

                                        >

                                             <CardContent className="p-2 flex-grow h-full flex items-center justify-center bg-muted/50 relative">

                                                <CarbonBoxIcon className="w-16 h-16" />

                                             </CardContent>

                                            <CardFooter className="p-2 justify-center bg-background/50">

                                                <p className="body-text font-bold text-center">Carbon</p>

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

                                                        "overflow-hidden aspect-square flex flex-col",

                                                        isCardboardUnlocked ? 'cursor-pointer' : 'cursor-default',

                                                        selectedSkin === 'cardboard' && 'border-primary'

                                                    )}

                                                >

                                                     <CardContent className="p-2 flex-grow h-full flex items-center justify-center bg-muted/50 relative">

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

                                                    <CardFooter className="p-2 justify-center bg-background/50">

                                                        <p className="body-text font-bold text-center">Cardboard</p>

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

                                        "overflow-hidden aspect-square flex flex-col cursor-pointer",

                                        selectedSkin === 'black-wooden' && 'border-primary'

                                    )}

                                >

                                     <CardContent className="p-2 flex-grow h-full flex items-center justify-center bg-muted/50 relative">

                                        <BlackWoodenBoxIcon className="w-16 h-16" />

                                     </CardContent>

                                    <CardFooter className="p-2 justify-center bg-background/50">

                                        <p className="body-text font-bold text-center">Black Wooden</p>

                                    </CardFooter>

                                </Card>

                                <Card 

                                    onClick={() => handleSelectSkin('special-xk6')}

                                    className={cn(

                                        "overflow-hidden aspect-square flex flex-col cursor-pointer",

                                        selectedSkin === 'special-xk6' && 'border-primary'

                                    )}

                                >

                                     <CardContent className="p-2 flex-grow h-full flex items-center justify-center bg-muted/50 relative">

                                        <SpecialXK6BoxIcon className="w-16 h-16" />

                                     </CardContent>

                                    <CardFooter className="p-2 justify-center bg-background/50">

                                        <p className="body-text font-bold text-center">Special XK6</p>

                                    </CardFooter>

                                </Card>

                                <Card 

                                    onClick={() => handleSelectSkin('stone')}

                                    className={cn(

                                        "overflow-hidden aspect-square flex flex-col cursor-pointer",

                                        selectedSkin === 'stone' && 'border-primary'

                                    )}

                                >

                                     <CardContent className="p-2 flex-grow h-full flex items-center justify-center bg-muted/50 relative">

                                        <StoneBoxIcon className="w-16 h-16" />

                                     </CardContent>

                                    <CardFooter className="p-2 justify-center bg-background/50">

                                        <p className="body-text font-bold text-center">Stone</p>

                                    </CardFooter>

                                </Card>

                            </TooltipProvider>

                        </div>

                    </TabsContent>

                    <TabsContent value="other">

                        <p className="text-muted-foreground text-center py-8">More customization options coming soon!</p>

                    </TabsContent>

                </Tabs>

            </CardContent>

        </Card>

    );

}

    
