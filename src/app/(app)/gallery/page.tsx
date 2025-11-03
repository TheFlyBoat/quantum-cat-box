
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import catData from '@/lib/cat-data.json';
import { useCatCollection } from '@/context/cat-collection-context';
import {
    GingerCatIcon,
    GhostCatIcon,
    ShadowCatIcon,
    BonesCatIcon,
    IdentityCrisisCatIcon,
    AltCat,
    BreuCatIcon,
    ZumbiCatIcon,
    BlizzardCatIcon,
    VoodooCatIcon,
    SleepyCatIcon,
    HologramCatIcon,
    GravityCatIcon,
    GlitchCatIcon,
    VampyCatIcon,
    WonderCatIcon,
    AnomalyCatIcon,
    CatankhamunCatIcon,
    CloudCatIcon,
    CosmicCatIcon,
    DominoCatIcon,
    MysticCatIcon,
    ParadoxCatIcon,
    PixelCatIcon,
    SharkCatIcon,
    SneekyCatIcon,
    SnowballCatIcon,
} from '@/components/cats';
import { useEffect, useState } from 'react';
import { CatDiarySheet } from '@/components/cat-diary-sheet';
import { cn } from '@/lib/utils';
import { CatProfileDialog } from '@/components/cat-profile-dialog';
import { useAuth } from '@/context/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const catComponentMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'ginger': GingerCatIcon,
    'ghost': GhostCatIcon,
    'paradox': ParadoxCatIcon,
    'shadow': ShadowCatIcon,
    'bones': BonesCatIcon,
    'identity-crisis': IdentityCrisisCatIcon,
    'alt': AltCat,
    'breu': BreuCatIcon,
    'zumbi': ZumbiCatIcon,
    'blizzard': BlizzardCatIcon,
    'voodoo': VoodooCatIcon,
    'sleepy': SleepyCatIcon,
    'hologram': HologramCatIcon,
    'gravity': GravityCatIcon,
    'vampy': VampyCatIcon,
    'wonder': WonderCatIcon,
    'glitch': GlitchCatIcon,
    'anomaly': AnomalyCatIcon,
    'catankhamun': CatankhamunCatIcon,
    'cloud': CloudCatIcon,
    'cosmic': CosmicCatIcon,
    'domino': DominoCatIcon,
    'mystic': MysticCatIcon,
    'pixel': PixelCatIcon,
    'shark': SharkCatIcon,
    'sneeky': SneekyCatIcon,
    'snowball': SnowballCatIcon,
};



export default function GalleryPage() {
    const allCats = catData.cats as {id: string, name: string, description: string, type: string, tagline: string, strength: string, weakness: string}[];
    
    const catGroups = allCats.reduce((acc, cat) => {
        if (!acc[cat.type]) {
            acc[cat.type] = [];
        }
        acc[cat.type].push(cat);
        return acc;
    }, {} as Record<string, typeof allCats>);

    const groupOrder = ['Alive', 'Dead', 'Paradox'];

    const { isUnlocked } = useCatCollection();
    const [selectedCat, setSelectedCat] = useState<any | null>(null);
    const [diaryCat, setDiaryCat] = useState<any | null>(null);
    const { storageMode, maybeShowLoginPrompt } = useAuth();

    useEffect(() => {
        if (storageMode === 'local') {
            maybeShowLoginPrompt('gallery');
        }
    }, [storageMode, maybeShowLoginPrompt]);

    const handleCatClick = (cat: any) => {
        if (isUnlocked(cat.id)) {
            setSelectedCat(cat);
        } else if (storageMode === 'local') {
            maybeShowLoginPrompt('gallery');
        }
    }

    const openDiaryForCat = (cat: any) => {
        setSelectedCat(null); // Close the profile dialog
        setDiaryCat(cat);
    }

    const renderLockedSilhouette = () => (
        <div className="relative flex h-full w-full items-center justify-center">
            <Image
                src="/cat-silhouette.svg"
                alt="Locked cat silhouette"
                width={164}
                height={148}
                className="h-24 w-24 opacity-80 transition duration-300 group-hover:opacity-100 sm:h-28 sm:w-28"
                priority={false}
            />
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="page-title text-primary">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="Alive" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/40 p-1 text-[11px] font-semibold uppercase tracking-wide">
                        {groupOrder.map(groupName => (
                            <TabsTrigger key={groupName} value={groupName} className={cn(
                                {
                                    'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200': groupName === 'Alive',
                                    'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200': groupName === 'Dead',
                                    'bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200': groupName === 'Paradox',
                                },
                                'px-2 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground'
                            )}>{groupName}</TabsTrigger>
                        ))}
                    </TabsList>
                    {groupOrder.map(groupName => (
                        <TabsContent key={groupName} value={groupName}>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {catGroups[groupName]?.map((cat) => {
                                    const unlocked = isUnlocked(cat.id);
                                    const CatComponent = catComponentMap[cat.id];
                                    return (
                                        <Card 
                                            key={cat.id} 
                                            className={cn(
                                                "group flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border transition-colors duration-300",
                                                unlocked ? 'cursor-pointer hover:border-primary' : 'cursor-default'
                                            )}
                                            onClick={() => handleCatClick(cat)}
                                        >
                                            <CardContent className={cn(
                                                "flex flex-1 items-center justify-center bg-background/70 p-3 transition-colors duration-300",
                                                unlocked ? "bg-gradient-to-br from-primary/15 via-background to-background" : "bg-muted/60 group-hover:bg-muted/50"
                                            )}>
                                                {(() => {
                                                    const isLocked = !unlocked;
                                                    const catPreview = (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <CatComponent
                                                                className={cn(
                                                                    "h-[88px] w-[88px] transition duration-500 ease-out sm:h-[96px] sm:w-[96px]",
                                                                    isLocked && "grayscale saturate-0 opacity-60 group-hover:grayscale-0 group-hover:saturate-100 group-hover:opacity-100"
                                                                )}
                                                            />
                                                        </div>
                                                    );

                                                    if (unlocked && CatComponent) {
                                                        return (
                                                            <TooltipProvider delayDuration={150}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="h-full w-full">
                                                                            {catPreview}
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top" className="font-medium">
                                                                        {cat.name}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        );
                                                    }

                                                    if (!CatComponent) {
                                                        return renderLockedSilhouette();
                                                    }

                                                    return (
                                                        <TooltipProvider delayDuration={150}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="h-full w-full flex items-center justify-center">
                                                                        <Image
                                                                            src="/favicon.svg"
                                                                            alt="Locked cat placeholder"
                                                                            width={96}
                                                                            height={96}
                                                                            className="h-20 w-20 opacity-60 transition duration-300 group-hover:opacity-100"
                                                                        />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="font-medium">
                                                                    {cat.name}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    );
                                                })()}
                                            </CardContent>
                                            <CardFooter className="bg-background/60 p-2 text-center">
                                                {unlocked ? (
                                                    cat.id === 'vampy' ? (
                                                        <span className="sr-only">{cat.name}</span>
                                                    ) : (
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                            {cat.name}
                                                        </p>
                                                    )
                                                ) : (
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">???</p>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
            {selectedCat && (
                <CatProfileDialog
                    cat={selectedCat}
                    open={!!selectedCat}
                    onOpenChange={(isOpen) => !isOpen && setSelectedCat(null)}
                    onOpenDiary={() => openDiaryForCat(selectedCat)}
                />
            )}
            {diaryCat && (
                <CatDiarySheet 
                    cat={diaryCat} 
                    open={!!diaryCat}
                    onOpenChange={(isOpen) => !isOpen && setDiaryCat(null)}
                />
            )}
        </Card>
    );
}
