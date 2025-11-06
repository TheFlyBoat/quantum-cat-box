'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useDiary } from "@/context/diary-context";
import { Eye, HeartCrack, Swords, BookOpen, ArrowLeft } from "lucide-react";
import { catComponentMap } from '@/lib/cat-components';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VisuallyHidden } from '../ui/visually-hidden';

interface CatProfileDialogProps {
    cat: {
        id: string;
        name: string;
        description: string;
        type: string;
        tagline: string;
        strength: string;
        weakness: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * A dialog component that displays the profile and diary of a cat.
 * @param cat The cat to display the profile for.
 * @param open Whether the dialog is open.
 * @param onOpenChange A function to call when the dialog is opened or closed.
 */
export function CatProfileDialog({ cat, open, onOpenChange }: CatProfileDialogProps) {
    const [view, setView] = useState<'details' | 'diary'>('details');
    const { getRevealCount, getDiary } = useDiary();
    
    const revealCount = getRevealCount(cat.id);
    const savedQuantumMessages = getDiary(cat.id);
    const CatComponent = catComponentMap[cat.id];
    
    const displayName = cat.name.endsWith(" Cat") ? cat.name : `${cat.name} Cat`;

    // Reset to details view when dialog is closed
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setView('details');
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="grid grid-cols-1 p-0 sm:max-w-2xl sm:grid-cols-2">
                 <DialogTitle>
                    <VisuallyHidden>{view === 'details' ? displayName : `${displayName}'s Diary`}</VisuallyHidden>
                </DialogTitle>
                <div className={cn(
                    "flex w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-primary/20 via-background to-background p-8 sm:rounded-tr-none sm:rounded-l-2xl",
                )}>
                     {CatComponent && <CatComponent className="h-32 w-32 sm:h-44 sm:w-44" />}
                </div>
                <div className="flex flex-col space-y-4 p-6">
                    <DialogHeader className="text-center sm:text-left">
                        <div className="flex items-start justify-between">
                             <Badge variant="outline" className="text-[11px]">{cat.type} Cat</Badge>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="secondary" className="flex items-center gap-1.5 text-[11px]">
                                           <Eye className="h-3.5 w-3.5" />
                                           <span>{revealCount}</span>
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Total Observations</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <h2 className="section-title mt-2 text-xl font-headline">
                            {view === 'details' ? displayName : `${displayName}'s Diary`}
                        </h2>
                        <DialogDescription className="body-text italic text-accent text-sm">&ldquo;{cat.tagline}&rdquo;</DialogDescription>
                    </DialogHeader>

                    {view === 'details' ? (
                        <>
                            <p className="body-text text-sm text-muted-foreground text-center sm:text-left">{cat.description}</p>
                            <div className="space-y-3 flex-grow">
                                 <Card>
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-3">
                                            <Swords className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <div>
                                                <h4 className="section-title text-xs uppercase tracking-wide text-muted-foreground/70">Strength</h4>
                                                <p className="body-text text-sm text-muted-foreground">{cat.strength}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                 </Card>
                                  <Card>
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-3">
                                            <HeartCrack className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                            <div>
                                                <h4 className="section-title text-xs uppercase tracking-wide text-muted-foreground/70">Weakness</h4>
                                                <p className="body-text text-sm text-muted-foreground">{cat.weakness}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                 </Card>
                            </div>
                            <Button onClick={() => setView('diary')} className="mt-auto w-full" variant="outline">
                                <BookOpen className="mr-2 h-4 w-4" />
                                View Diary
                            </Button>
                        </>
                    ) : (
                        <>
                            <ScrollArea className="flex-grow pr-4 -mr-6 h-64">
                                <div className="space-y-4">
                                    {savedQuantumMessages.length > 0 ? (
                                         savedQuantumMessages.map((quantumMessage, index) => (
                                            <div key={`${index}-${quantumMessage.slice(0, 10)}`} className="bg-muted/50 rounded-lg p-3 body-text text-muted-foreground italic">
                                                &ldquo;{quantumMessage}&rdquo;
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-sm text-muted-foreground text-center py-8">No Quantum Messages saved for this cat yet.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <Button onClick={() => setView('details')} className="mt-auto w-full" variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Details
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}