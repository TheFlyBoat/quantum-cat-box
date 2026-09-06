'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import catData from '@/lib/cat-data.json';
import { catComponentMap } from '@/lib/cat-components';
import { useCatCollection } from '@/context/cat-collection-context';
import { CatProfileDialog } from '@/components/features/cat-profile-dialog';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

type CatInfo = {
    id: string;
    name: string;
    description: string;
    type: string;
    tagline: string;
    strength: string;
    weakness: string;
};

type PlaceholderEntry = {
    id: string;
    placeholder: true;
};

type GalleryEntry = CatInfo | PlaceholderEntry;

const isPlaceholderEntry = (entry: GalleryEntry): entry is PlaceholderEntry =>
    'placeholder' in entry && entry.placeholder === true;

export default function GalleryPage() {
    const allCats = catData.cats as CatInfo[];
    
    const catGroups = allCats.reduce<Record<string, CatInfo[]>>((acc, cat) => {
        if (!acc[cat.type]) {
            acc[cat.type] = [];
        }
        acc[cat.type].push(cat);
        return acc;
    }, {});

    const groupOrder = ['Alive', 'Dead', 'Paradox'];

    const { isUnlocked } = useCatCollection();
    const [selectedCat, setSelectedCat] = useState<CatInfo | null>(null);
    const { storageMode, maybeShowLoginPrompt } = useAuth();

    useEffect(() => {
        if (storageMode === 'local') {
            maybeShowLoginPrompt('gallery');
        }
    }, [storageMode, maybeShowLoginPrompt]);

    const handleCatClick = (cat: CatInfo) => {
        if (isUnlocked(cat.id)) {
            setSelectedCat(cat);
        } else if (storageMode === 'local') {
            maybeShowLoginPrompt('gallery');
        }
    };

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
                            <div className="grid grid-cols-3 gap-3">
                                    {(() => {
                                        const catsInGroup = catGroups[groupName] ?? [];
                                        const placeholdersNeeded = Math.max(0, 12 - catsInGroup.length);
                                        const placeholders: PlaceholderEntry[] = Array.from({ length: placeholdersNeeded }, (_, index) => ({
                                            id: `placeholder-${groupName}-${index}`,
                                            placeholder: true,
                                        }));

                                        const displayEntries: GalleryEntry[] = [
                                            ...catsInGroup,
                                            ...placeholders,
                                        ];

                                        return displayEntries.map((entry) => {
                                            if (isPlaceholderEntry(entry)) {
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
                                                        if (!CatComponent) {
                                                            return (
                                                                <TooltipProvider delayDuration={150}>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="h-full w-full">
                                                                                {renderLockedSilhouette()}
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top" className="space-y-1 text-center">
                                                                            <p className="font-medium">{cat.name}</p>
                                                                            <p className="text-xs text-muted-foreground">Preview not available yet.</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            );
                                                        }

                                                        const isLocked = !unlocked;
                                                        if (unlocked) {
                                                            return (
                                                                <TooltipProvider delayDuration={150}>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div className="h-full w-full">
                                                                                <div className="flex h-full w-full items-center justify-center">
                                                                                    <CatComponent
                                                                                        className={cn(
                                                                                            "h-[88px] w-[88px] transition duration-500 ease-out sm:h-[96px] sm:w-[96px]",
                                                                                            isLocked && "grayscale saturate-0 opacity-60 group-hover:grayscale-0 group-hover:saturate-100 group-hover:opacity-100"
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top" className="font-medium">
                                                                            {cat.name}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            );
                                                        }

                                                        return (
                                                            <TooltipProvider delayDuration={150}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="h-full w-full">
                                                                            <div className="flex h-full w-full items-center justify-center">
                                                                                {renderLockedSilhouette()}
                                                                            </div>
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
