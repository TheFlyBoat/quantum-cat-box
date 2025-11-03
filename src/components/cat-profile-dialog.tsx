
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { useDiary } from "@/context/diary-context";
import { Eye, HeartCrack, Swords, BookOpen } from "lucide-react";
import { catComponentMap } from '@/lib/cat-components';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
    onOpenDiary: () => void;
}

/**
 * A dialog component that displays the profile of a cat.
 * @param cat The cat to display the profile for.
 * @param open Whether the dialog is open.
 * @param onOpenChange A function to call when the dialog is opened or closed.
 * @param onOpenDiary A function to call when the diary is opened.
 */
export function CatProfileDialog({ cat, open, onOpenChange, onOpenDiary }: CatProfileDialogProps) {
    const { getRevealCount } = useDiary();
    const revealCount = getRevealCount(cat.id);
    const CatComponent = catComponentMap[cat.id];
    
    const displayName = cat.name.endsWith(" Cat") ? cat.name : `${cat.name} Cat`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="grid grid-cols-1 p-0 sm:max-w-2xl sm:grid-cols-2">
                <div className={cn(
                    "flex w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-primary/20 via-background to-background p-8 sm:rounded-tr-none sm:rounded-l-2xl",
                )}>
                     {CatComponent && <CatComponent className="h-32 w-32 sm:h-44 sm:w-44" />}
                </div>
                <div className="flex flex-col space-y-4 p-6">
                    <DialogHeader className="text-center sm:text-left">
                        <div className="flex items-start justify-between">
                             <Badge variant="outline" className="text-[11px]">{cat.type} Cat</Badge>
                             <Badge variant="secondary" className="flex items-center gap-1.5 text-[11px]">
                               <Eye className="h-3.5 w-3.5" />
                               <span>{revealCount}</span>
                            </Badge>
                        </div>
                        <DialogTitle className="section-title mt-2 text-xl">{displayName}</DialogTitle>
                        <DialogDescription className="body-text italic text-accent text-sm">&ldquo;{cat.tagline}&rdquo;</DialogDescription>
                    </DialogHeader>

                    <p className="body-text text-sm text-muted-foreground text-center sm:text-left">{cat.description}</p>
                    
                    <div className="space-y-3 flex-grow">
                         <Card>
                            <CardContent className="p-3">
                                <div className="flex items-start gap-3">
                                    <Swords className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
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
                                    <HeartCrack className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                    <div>
                                        <h4 className="section-title text-xs uppercase tracking-wide text-muted-foreground/70">Weakness</h4>
                                        <p className="body-text text-sm text-muted-foreground">{cat.weakness}</p>
                                    </div>
                                </div>
                            </CardContent>
                         </Card>
                    </div>

                    <Button onClick={onOpenDiary} className="mt-auto w-full" variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Diary
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
