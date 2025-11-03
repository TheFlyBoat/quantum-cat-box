
'use client';

import { Wrench, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { soundList, playSound } from '@/lib/audio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CatState } from '@/lib/types';

/**
 * A component for development purposes only.
 * It allows the developer to select a cat to view, test sounds, and preview the share card.
 * @param allCats A list of all cats.
 * @param onCatSelect A function to call when a cat is selected.
 * @param catState The state of the cat.
 * @param message The message from the cat.
 */
export function DevPanel({ allCats, onCatSelect, catState, message }: {
    allCats: {id: string, name: string}[];
    onCatSelect: (catId: string) => void;
    catState: CatState;
    message: string;
}) {
    return (
        <div className={cn("mb-2 w-full space-y-4 animate-fade-in-up")}>
            <Badge className="gap-1"><Wrench className="h-3.5 w-3.5" />Dev Mode</Badge>
            <Select onValueChange={onCatSelect}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a cat to view" />
                </SelectTrigger>
                <SelectContent>
                    {allCats.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Sound Test</p>
                <div className="grid grid-cols-3 gap-2">
                    {soundList.map(sound => (
                        <Button key={sound} variant="outline" size="sm" onClick={() => playSound(sound)}>{sound}</Button>
                    ))}
                </div>
            </div>
            {catState.outcome !== 'initial' && message && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="w-full gap-1.5">
                            <Eye className="h-4 w-4" />
                            Preview Share Card
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Share Preview</DialogTitle>
                        </DialogHeader>
                        <div style={{ width: '320px', height: '520px', margin: 'auto' }}>
                            {/* The ShareCard is rendered in the parent, so this is just a placeholder */}
                            Preview
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Separator />
        </div>
    );
}
