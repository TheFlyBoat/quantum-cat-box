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
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { CatProfileDialog } from '@/components/features/cat-profile-dialog';
import { useAuth } from '@/context/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import badgeData from '@/lib/badge-data.json';
import { useBadges } from '@/context/badge-context';
import { BadgeCard } from '@/components/features/BadgeCard';
import { badgeImageMap, defaultBadgeImage } from '@/lib/badge-images';

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
    const { isBadgeUnlocked } = useBadges();
    const badges = badgeData.badges as { id: string; name: string; description: string; icon: string }[];
    const [selectedCat, setSelectedCat] = useState<any | null>(null);
    const { storageMode, maybeShowLoginPrompt } = useAuth();

    const awardsDisplay = useMemo(() => {
        const placeholdersNeeded = Math.max(0, 12 - badges.length);
        return [
            ...badges,
            ...Array.from({ length: placeholdersNeeded }, (_, index) => ({
                id: `placeholder-award-${index}`,
                name: '???',
                description: 'A mysterious award waiting to be discovered.',
                icon: '',
            })),
        ];
    }, [badges]);

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

    const tabBaseClass =
        'flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:scale-[1.08] dark:data-[state=active]:bg-white';

    const tabColorClasses: Record<string, string> = {
        Alive: 'bg-emerald-300/80 text-emerald-900 dark:bg-emerald-700 dark:text-emerald-100',
        Dead: 'bg-orange-300/80 text-orange-900 dark:bg-orange-700 dark:text-orange-100',
        Paradox: 'bg-violet-300/80 text-violet-900 dark:bg-violet-700 dark:text-violet-100',
        Awards: 'bg-pink-300/80 text-pink-900 dark:bg-pink-700 dark:text-pink-100',
    };

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="page-title text-primary">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="Alive" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 gap-3 rounded-3xl border border-border/40 bg-background/80 p-2 text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                        {groupOrder.map(groupName => (
                            <TabsTrigger
                                key={groupName}
                                value={groupName}
                                className={cn(
                                    tabBaseClass,
                                    tabColorClasses[groupName] ?? 'bg-muted/60 text-muted-foreground'
                                )}
                            >
                                {groupName}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {groupOrder.map(groupName => (
                        <TabsContent key={groupName} value={groupName}>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {(() => {
                                        const catsInGroup = catGroups[groupName] ?? [];
                                        const placeholdersNeeded = Math.max(0, 12 - catsInGroup.length);
                                        const displayEntries = [
                                            ...catsInGroup,
                                            ...Array.from({ length: placeholdersNeeded }, (_, index) => ({
                                                id: `placeholder-${groupName}-${index}`,
                                                placeholder: true,
                                            })),
                                        ];

                                        return displayEntries.map((entry) => {
                                            if ('placeholder' in entry && entry.placeholder) {
                                                return (
                                                    <Card
                                                        key={entry.id}
                                                        className="flex aspect-[3/4] flex-col overflow-hidden rounded-3xl border border-dashed border-muted-foreground/40 bg-background/60 shadow-inner"
                                                    >
                                                        <CardContent className="flex flex-1 items-center justify-center bg-gradient-to-br from-muted/30 via-transparent to-transparent p-3">
                                                            {renderLockedSilhouette()}
                                                        </CardContent>
                                                        <CardFooter className="bg-background/60 p-2 text-center">
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">???</p>
                                                        </CardFooter>
                                                    </Card>
                                                );
                                            }

                                            const cat = entry;
                                            const unlocked = isUnlocked(cat.id);
                                            const CatComponent = catComponentMap[cat.id];
                                            return (
                                            <Card 
                                                key={cat.id} 
                                                className={cn(
                                                    "group flex aspect-[3/4] flex-col overflow-hidden rounded-3xl border border-border/40 bg-background/80 shadow-sm transition-colors duration-300",
                                                    unlocked ? 'cursor-pointer hover:border-primary' : 'cursor-default'
                                                )}
                                                onClick={() => handleCatClick(cat)}
                                            >
                                                <CardContent className={cn(
                                                    "flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background/70 to-background p-3 transition-colors duration-300",
                                                    unlocked ? "from-primary/10 via-background/80 to-background" : "from-muted/40 via-muted/30 to-background group-hover:from-muted/30"
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
                                        });
                                    })()}
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
                />
            )}
        </Card>
    );
}
