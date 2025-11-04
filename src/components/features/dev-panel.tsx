
'use client';

import { Eye, Wrench } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { soundList, playFeedback } from '@/lib/audio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type CatState } from '@/lib/types';

type DevPanelProps = {
    allCats: Array<{ id: string; name: string }>;
    onCatSelect: (catId: string) => void;
    catState: CatState;
    quantumMessage: string;
};

/**
 * A component for development purposes only.
 * It allows the developer to select a cat to view, test sounds, and preview the share card.
 * @param allCats A list of all cats.
 * @param onCatSelect A function to call when a cat is selected.
 * @param catState The state of the cat.
 * @param quantumMessage The current Quantum Message.
 */
export function DevPanel({ allCats, onCatSelect, catState, quantumMessage }: DevPanelProps) {
    return (
        <div className={cn("mb-2 w-full space-y-4 animate-fade-in-up")}>
            <Badge className="gap-1 text-xs uppercase tracking-wide"><Wrench className="h-3.5 w-3.5" />Quantum Dev Mode</Badge>
            <Select onValueChange={onCatSelect}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a Quantum Cat to view" />
                </SelectTrigger>
                <SelectContent>
                    {allCats.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Quantum Sound Lab</p>
                <div className="grid grid-cols-3 gap-2">
                    {soundList.map(sound => (
                        <Button
                            key={sound}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => playFeedback(sound)}
                            aria-label={`Play ${sound} sound`}
                        >
                            {sound}
                        </Button>
                    ))}
                </div>
            </div>
            {catState.outcome !== 'initial' && quantumMessage && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="w-full gap-1.5">
                            <Eye className="h-4 w-4" />
                            Preview Quantum Message Share
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Quantum Message Share Preview</DialogTitle>
                        </DialogHeader>
                        <div style={{ width: '320px', height: '520px', margin: 'auto' }}>
                            {/* The ShareCard renders in the parent; this keeps spacing consistent for the preview dialog. */}
                            Quantum Message preview
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Separator />
        </div>
    );
}
