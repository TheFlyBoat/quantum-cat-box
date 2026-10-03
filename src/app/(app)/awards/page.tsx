'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBadges } from '@/context/badge-context';
import { useBadgeProgress } from '@/context/badge-progress-context';
import { useCatCollection } from '@/context/cat-collection-context';
import { useDiary } from '@/context/diary-context';
import { usePoints } from '@/context/points-context';
import badgeData from '@/lib/badge-data.json';
import catData from '@/lib/cat-data.json';
import { BadgeCard } from '@/components/features/badge-card';
import { badgeImageMap, defaultBadgeImage } from '@/lib/badge-images';
import { cn } from '@/lib/utils';
import { Box, Cat, Fish, ScrollText, Skull, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const allCats = catData.cats as { id: string; name: string; description: string; type: string }[];

export default function AwardsPage() {
    const { isBadgeUnlocked } = useBadges();
    const badges = badgeData.badges as { id: string; name: string; description: string; icon: string }[];
    const { totalObservations } = useBadgeProgress();
    const { unlockedCats } = useCatCollection();
    const { data: diaryData } = useDiary();
    const { points } = usePoints();

    const catTypeCounts = useMemo(() => {
        const counts = { Alive: 0, Dead: 0, Paradox: 0 };
        unlockedCats.forEach(catId => {
            const cat = allCats.find(c => c.id === catId);
            if (cat && counts.hasOwnProperty(cat.type)) {
                counts[cat.type as keyof typeof counts]++;
            }
        });
        return counts;
    }, [unlockedCats]);

    const totalSavedMessages = useMemo(() => {
        return Object.values(diaryData).reduce((sum, entry) => sum + entry.messages.length, 0);
    }, [diaryData]);

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

    const tabBaseClass =
        'flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:scale-[1.06] data-[state=active]:shadow-md data-[state=active]:font-black';

    const tabColorClasses: Record<string, string> = {
        Badges: 'bg-pink-100 text-pink-800 hover:bg-pink-200/70 dark:bg-pink-950/60 dark:text-pink-300 data-[state=active]:bg-[#FF809F] data-[state=active]:text-[#002D41] data-[state=active]:font-semibold dark:data-[state=active]:bg-[#FF809F] dark:data-[state=active]:text-[#002D41]',
        Data: 'bg-sky-100 text-sky-800 hover:bg-sky-200/70 dark:bg-sky-950/60 dark:text-sky-300 data-[state=active]:bg-[#3696C9] data-[state=active]:text-[#002D41] data-[state=active]:font-semibold dark:data-[state=active]:bg-[#3696C9] dark:data-[state=active]:text-[#002D41]',
    };

    const stats = [
        { label: 'Boxes Opened', value: totalObservations, icon: Box, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Fish Points', value: points, icon: Fish, color: 'text-sky-500', bg: 'bg-sky-500/10', highlight: true },
        { label: 'Alive Cats', value: catTypeCounts.Alive, icon: Cat, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Dead Cats', value: catTypeCounts.Dead, icon: Skull, color: 'text-stone-500', bg: 'bg-stone-500/10' },
        { label: 'Paradox Cats', value: catTypeCounts.Paradox, icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { label: 'Saved Messages', value: totalSavedMessages, icon: ScrollText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="page-title text-primary">Awards</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="Badges" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 gap-3 rounded-3xl border border-border/40 bg-background/80 p-2 text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="Badges" className={cn(tabBaseClass, tabColorClasses['Badges'])}>Badges</TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Badges & Achievements</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger value="Data" className={cn(tabBaseClass, tabColorClasses['Data'])}>Data</TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Observation Statistics</TooltipContent>
                        </Tooltip>
                    </TabsList>
                    <TabsContent value="Badges">
                        <div className="grid grid-cols-3 gap-3">
                            {awardsDisplay.map((badge, index) => {
                                const isPlaceholder = badge.id.startsWith('placeholder-award-');
                                const unlocked = !isPlaceholder && isBadgeUnlocked(badge.id);
                                const badgeImage = !isPlaceholder ? (badgeImageMap[badge.id] ?? defaultBadgeImage) : undefined;
                                return (
                                    <BadgeCard
                                        key={`${badge.id}-${index}`}
                                        badge={badge}
                                        unlocked={unlocked}
                                        badgeImage={badgeImage}
                                    />
                                );
                            })}
                        </div>
                    </TabsContent>
                    <TabsContent value="Data">
                        <div className="grid grid-cols-2 gap-4 py-2">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div 
                                        key={index} 
                                        className={cn(
                                            "flex flex-col items-center justify-center rounded-3xl border p-6 transition-all hover:scale-[1.02]",
                                            stat.highlight 
                                                ? "col-span-2 border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/20" 
                                                : "border-border/40 bg-card/50 shadow-sm backdrop-blur-sm"
                                        )}
                                    >
                                        <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-2xl", stat.bg)}>
                                            <Icon className={cn("h-6 w-6", stat.color)} />
                                        </div>
                                        <p className={cn(
                                            "font-headline font-bold",
                                            stat.highlight ? "text-4xl text-sky-600 dark:text-sky-400" : "text-2xl text-foreground"
                                        )}>
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                            {stat.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
