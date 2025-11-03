
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import badgeData from '@/lib/badge-data.json';
import { useBadges } from '@/context/badge-context';
import { BadgeCard } from '@/components/features/BadgeCard';
import { badgeImageMap, defaultBadgeImage } from '@/lib/badge-images';

export default function AwardsPage() {
    const badges = badgeData.badges as {id: string, name: string, description: string, icon: string}[];
    const { isBadgeUnlocked } = useBadges();

    const unlockedBadges = badges.filter(badge => isBadgeUnlocked(badge.id));
    const lockedBadges = badges.filter(badge => !isBadgeUnlocked(badge.id));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="page-title text-primary">Awards</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="unlocked" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/40 p-1 text-xs font-semibold uppercase tracking-wide">
                        <TabsTrigger value="unlocked" className="px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground">
                            Unlocked
                        </TabsTrigger>
                        <TabsTrigger value="locked" className="px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground">
                            Locked
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="unlocked">
                        <div className="grid grid-cols-3 gap-4">
                            {unlockedBadges.map((badge) => (
                                <BadgeCard
                                    key={badge.id}
                                    badge={badge}
                                    unlocked={true}
                                    badgeImage={badgeImageMap[badge.id] ?? defaultBadgeImage}
                                />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="locked">
                        <div className="grid grid-cols-3 gap-4">
                            {lockedBadges.map((badge) => (
                                <BadgeCard
                                    key={badge.id}
                                    badge={badge}
                                    unlocked={false}
                                    badgeImage={badgeImageMap[badge.id] ?? defaultBadgeImage}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
