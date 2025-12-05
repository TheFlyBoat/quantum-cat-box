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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBadges } from '@/context/badge-context';
import { usePoints } from '@/context/points-context';
import { Lock, Fish, PawPrint } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { playFeedback } from '@/lib/audio';
import { useAuth } from '@/context/auth-context';
import { BoxSkinDialog } from '@/components/features/box-skin-dialog';
import boxSkinData from '@/lib/box-skin-data.json';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ThemeOption = {
    id: string;
    name: string;
    description: string;
    tagline: string;
    previewLabel: string;
    previewClassName: string;
    swatches: string[];
    toastDescription: string;
    cardClassName: string;
    pawSurfaceClassName: string;
    pawColor: string;
    pawGlow: string;
};

const themeOptions: ThemeOption[] = [
    {
        id: 'light',
        name: 'Quantum Lavender',
        description: 'Keep the original pastel glow and playful palette.',
        tagline: 'Lavender mist and balanced contrast for daytime reveals.',
        previewLabel: 'Lavender Glow',
        previewClassName: 'from-[#f9f7ff] via-[#fde7ff] to-[#dbeafe]',
        swatches: ['bg-[#6366f1]', 'bg-[#f472b6]', 'bg-[#14b8a6]'],
        toastDescription: 'Back to the classic Quantum Cat look.',
        cardClassName: 'bg-gradient-to-br from-[#f9f7ff]/75 via-[#fde7ff]/55 to-[#dbeafe]/75',
        pawSurfaceClassName: 'bg-white/30',
        pawColor: '#6366f1',
        pawGlow: 'rgba(99, 102, 241, 0.55)',
    },
    {
        id: 'aurora',
        name: 'Aurora Flux',
        description: 'Neon gradients with a deep-space vibe and glowing accents.',
        tagline: 'Best for night owls chasing cosmic surprises.',
        previewLabel: 'Polar Lights',
        previewClassName: 'from-[#0f172a] via-[#312e81] to-[#0ea5e9]',
        swatches: ['bg-[#6366f1]', 'bg-[#0ea5e9]', 'bg-[#fbbf24]'],
        toastDescription: 'Aurora Flux engaged. Enjoy the neon nightlife!',
        cardClassName: 'bg-gradient-to-br from-[#0f172a]/85 via-[#312e81]/60 to-[#0ea5e9]/45',
        pawSurfaceClassName: 'bg-white/20',
        pawColor: '#fbbf24',
        pawGlow: 'rgba(251, 191, 36, 0.6)',
    },
    {
        id: 'sunrise',
        name: 'Sunrise Bloom',
        description: 'Warm daylight tones with optimistic gradients and softer shadows.',
        tagline: 'Perfect for morning rituals and optimistic streaks.',
        previewLabel: 'Golden Hour',
        previewClassName: 'from-[#fff7ed] via-[#ffe4e6] to-[#fde68a]',
        swatches: ['bg-[#f97316]', 'bg-[#fb7185]', 'bg-[#38bdf8]'],
        toastDescription: 'Sunrise Bloom applied. Bask in the warm glow!',
        cardClassName: 'bg-gradient-to-br from-[#fff7ed]/85 via-[#ffe4e6]/65 to-[#fde68a]/80',
        pawSurfaceClassName: 'bg-white/35',
        pawColor: '#f97316',
        pawGlow: 'rgba(249, 115, 22, 0.45)',
    },
    {
        id: 'forest',
        name: 'Verdant Grove',
        description: 'Earthy woodlands with botanical highlights and inked typography.',
        tagline: 'Ground yourself before lifting the lid on destiny.',
        previewLabel: 'Deep Woods',
        previewClassName: 'from-[#022c22] via-[#064e3b] to-[#0f172a]',
        swatches: ['bg-[#047857]', 'bg-[#f59e0b]', 'bg-[#dc2626]'],
        toastDescription: 'Verdant Grove set. Follow the rustling leaves.',
        cardClassName: 'bg-gradient-to-br from-[#022c22]/80 via-[#064e3b]/60 to-[#0f172a]/70',
        pawSurfaceClassName: 'bg-white/18',
        pawColor: '#f59e0b',
        pawGlow: 'rgba(245, 158, 11, 0.5)',
    },
    {
        id: 'celestial',
        name: 'Eclipse Prime',
        description: 'Midnight obsidian paired with radiant gold and nebula highlights.',
        tagline: 'Summon the cat beneath a cosmic aurora.',
        previewLabel: 'Stellar Drift',
        previewClassName: 'from-[#020617] via-[#0f172a] to-[#1e293b]',
        swatches: ['bg-[#fbbf24]', 'bg-[#38bdf8]', 'bg-[#c084fc]'],
        toastDescription: 'Eclipse Prime engaged. Stars align for your reveal.',
        cardClassName: 'bg-gradient-to-br from-[#020617]/85 via-[#0f172a]/65 to-[#1e293b]/70',
        pawSurfaceClassName: 'bg-white/18',
        pawColor: '#fbbf24',
        pawGlow: 'rgba(251, 191, 36, 0.55)',
    },
    {
        id: 'retro',
        name: 'Retro Arcade',
        description: 'VHS warmth with playful neons and softened geometry.',
        tagline: 'Travel back to quantum classics with stylised controls.',
        previewLabel: 'Analog Glow',
        previewClassName: 'from-[#fef3c7] via-[#fbcfe8] to-[#bfdbfe]',
        swatches: ['bg-[#f97316]', 'bg-[#22d3ee]', 'bg-[#ec4899]'],
        toastDescription: 'Retro Arcade loaded. Queue the synthwave soundtrack.',
        cardClassName: 'bg-gradient-to-br from-[#fef3c7]/85 via-[#fbcfe8]/60 to-[#bfdbfe]/80',
        pawSurfaceClassName: 'bg-white/40',
        pawColor: '#ec4899',
        pawGlow: 'rgba(236, 72, 153, 0.5)',
    },
];

export default function CustomizePage() {
    const router = useRouter();
    const { selectedSkin, selectSkin, isSkinUnlocked, unlockSkin, getSkinCost } = useBoxSkin();
    const { isBadgeUnlocked, unlockBadge } = useBadges();
    const { points } = usePoints();
    const { toast } = useToast();
    const { storageMode, maybeShowLoginPrompt } = useAuth();
    const { theme: activeTheme, resolvedTheme, setTheme } = useTheme();

    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [selectedSkinForApplyDialog, setSelectedSkinForApplyDialog] = useState(boxSkinData.skins[0]);

    const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
    const [selectedSkinForPurchaseDialog, setSelectedSkinForPurchaseDialog] = useState(boxSkinData.skins[0]);
    const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
    const [selectedThemeOption, setSelectedThemeOption] = useState<ThemeOption | null>(null);

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

    const isThemeActive = (id: string) => {
        if (id === 'light') {
            return activeTheme === 'light' || (activeTheme === 'system' && resolvedTheme === 'light');
        }
        return activeTheme === id;
    };

    const handleThemeSelect = (option: ThemeOption) => {
        nudgeLogin();
        playFeedback('click-3');
        setTheme(option.id);
        toast({
            title: `${option.name} applied`,
            description: option.toastDescription,
        });
        setIsThemeDialogOpen(false);
    };

    const handleThemeCardClick = (option: ThemeOption) => {
        nudgeLogin();
        playFeedback('click-1');
        setSelectedThemeOption(option);
        setIsThemeDialogOpen(true);
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
                            <TooltipProvider delayDuration={200}>
                                <div className="grid grid-cols-3 gap-4">
                                    {boxSkinData.skins.map((skin) => {
                                        const SkinIcon = skinIcons[skin.id];
                                        const unlocked = isSkinUnlocked(skin.id);
                                        const cost = getSkinCost(skin.id);
                                        const canAfford = points >= cost;

                                        return (
                                            <Tooltip key={skin.id}>
                                                <TooltipTrigger asChild>
                                                    <Card
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
                                                            <SkinIcon className={cn('h-16 w-16', !unlocked && 'grayscale')} />
                                                        ) : (
                                                            <Lock className="h-8 w-8 text-muted-foreground" />
                                                        )}
                                                        {!unlocked && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                                                                <Lock className="h-8 w-8" />
                                                                {cost > 0 && (
                                                                    <Badge variant="secondary" className="mt-2 flex items-center gap-1">
                                                                        <Fish className="h-3 w-3" />
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
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[220px] text-center" side="top">
                                                <p className="text-sm font-semibold text-foreground">{skin.name}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{skin.description}</p>
                                                {cost > 0 && (
                                                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                                        <Fish className="h-3 w-3" />
                                                        {cost} Fish Points
                                                    </div>
                                                )}
                                            </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </TooltipProvider>
                        </TabsContent>
                        <TabsContent value="themes">
                            <div className="grid grid-cols-3 gap-4">
                                {themeOptions.map(option => {
                                    const active = isThemeActive(option.id);
                                    return (
                                        <TooltipProvider delayDuration={150} key={option.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Card
                                                        onClick={() => handleThemeCardClick(option)}
                                                        className={cn(
                                                            'group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-border/40 bg-background/80 p-4 shadow-md transition hover:shadow-xl hover:border-primary',
                                                            option.cardClassName,
                                                            active && 'border-primary shadow-lg'
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-[1.02]',
                                                                option.previewClassName
                                                            )}
                                                        >
                                                            <div className="absolute inset-0 flex gap-2 opacity-45">
                                                                {option.swatches.map((swatch, index) => (
                                                                    <div
                                                                        key={`${option.id}-band-${index}`}
                                                                        className={cn('flex-1 rounded-full blur-3xl', swatch)}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.3),transparent_50%)] opacity-70 transition-all duration-300 group-hover:opacity-95" />
                                                            <div
                                                                className={cn(
                                                                    'relative flex h-20 w-20 items-center justify-center rounded-full border border-white/40 shadow-2xl backdrop-blur-lg',
                                                                    option.pawSurfaceClassName
                                                                )}
                                                                style={{ boxShadow: `0 0 38px ${option.pawGlow}` }}
                                                            >
                                                                <PawPrint
                                                                    className="h-12 w-12 drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]"
                                                                    color={option.pawColor}
                                                                    stroke="rgba(255,255,255,0.9)"
                                                                    strokeWidth={1.6}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="font-medium">
                                                    {option.name}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    );
                                })}
                            </div>
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

            {/* Theme Dialog */}
            <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    {selectedThemeOption && (
                        <>
                            <DialogTitle className="flex items-center justify-between">
                                <span>{selectedThemeOption.name}</span>
                                {isThemeActive(selectedThemeOption.id) && (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                                        Active
                                    </Badge>
                                )}
                            </DialogTitle>
                            <DialogDescription>{selectedThemeOption.description}</DialogDescription>
                            <div className="space-y-4">
                                <div
                                    className={cn(
                                        'relative flex h-40 w-full items-center justify-center overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br text-white shadow-sm',
                                        selectedThemeOption.previewClassName
                                    )}
                                >
                                    <span className="text-sm font-semibold uppercase tracking-wide drop-shadow-lg">
                                        {selectedThemeOption.previewLabel}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">{selectedThemeOption.tagline}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Each theme refreshes the entire interface with curated colors, typography, and subtle backgrounds for a different mood.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedThemeOption.swatches.map(swatch => (
                                        <span
                                            key={swatch}
                                            className={cn(
                                                'h-6 w-6 rounded-full border border-white/70 shadow-sm',
                                                swatch
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                            <DialogFooter className="mt-4 flex items-center justify-between gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsThemeDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleThemeSelect(selectedThemeOption)}
                                    disabled={isThemeActive(selectedThemeOption.id)}
                                >
                                    {isThemeActive(selectedThemeOption.id) ? 'Theme Active' : 'Apply Theme'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
