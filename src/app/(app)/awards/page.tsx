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
import { BadgeCard } from '@/components/features/BadgeCard';
import { badgeImageMap, defaultBadgeImage } from '@/lib/badge-images';
import { cn } from '@/lib/utils';

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
        'flex-1 px-3 py-1.5 font-semibold transition transform rounded-2xl hover:scale-105 hover:shadow-md data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:scale-[1.08] dark:data-[state=active]:bg-white';

    const tabColorClasses: Record<string, string> = {
        Badges: 'bg-pink-300/80 text-pink-900 dark:bg-pink-700 dark:text-pink-100',
        Data: 'bg-sky-300/80 text-sky-900 dark:bg-sky-700 dark:text-sky-100',
    };

    const stats = [
        { label: 'Boxes Opened', value: totalObservations },
        { label: 'Alive Cats', value: catTypeCounts.Alive },
        { label: 'Dead Cats', value: catTypeCounts.Dead },
        { label: 'Paradox Cats', value: catTypeCounts.Paradox },
        { label: 'Saved Messages', value: totalSavedMessages },
        { label: 'Infinite Games Played', value: 'N/A' }, // Placeholder for now
        { label: 'Fish Points', value: points },
    ];

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader>
                <CardTitle className="page-title text-primary">Awards</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="Badges" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 gap-3 rounded-3xl border border-border/40 bg-background/80 p-2 text-[11px] font-semibold uppercase tracking-wide shadow-sm">
                        <TabsTrigger value="Badges" className={cn(tabBaseClass, tabColorClasses['Badges'])}>Badges</TabsTrigger>
                        <TabsTrigger value="Data" className={cn(tabBaseClass, tabColorClasses['Data'])}>Data</TabsTrigger>
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
                        <div className="grid grid-cols-3 gap-3">
                            {stats.map((stat, index) => (
                                <Card key={index} className="flex aspect-[3/4] flex-col items-center justify-center rounded-3xl border border-border/40 bg-background/80 shadow-sm p-4">
                                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center mt-2">{stat.label}</p>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
