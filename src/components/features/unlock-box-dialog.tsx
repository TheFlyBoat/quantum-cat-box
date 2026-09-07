'use client';

import { Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FishboneIcon } from '@/components/icons/fishbone-icon';
import { cn } from '@/lib/utils';

interface UnlockBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPoints: number;
  cost?: number;
  onConfirmUnlock: () => void;
}

/**
 * Modal dialog prompting the user to unlock the daily Quantum Box
 * early by spending Fish Points.
 */
export function UnlockBoxDialog({
  open,
  onOpenChange,
  currentPoints,
  cost = 10,
  onConfirmUnlock,
}: UnlockBoxDialogProps) {
  const hasEnoughPoints = currentPoints >= cost;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border-border/60 bg-background/95 backdrop-blur-md">
        <DialogHeader className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A240FF]/15 text-[#A240FF] shadow-inner">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-headline font-bold text-foreground">
            Unlock Quantum Box
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground max-w-xs text-center">
            The Quantum Box is recharging until tomorrow. Recharge it immediately with <strong className="text-foreground">Fish Points</strong>!
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Unlock Cost:</span>
            <span className="flex items-center gap-1.5 font-bold text-[#A240FF]">
              <FishboneIcon className="h-4 w-4" />
              {cost} Fish Points
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your Balance:</span>
            <span className={cn(
              'flex items-center gap-1.5 font-bold',
              hasEnoughPoints ? 'text-[#3696C9]' : 'text-rose-500'
            )}>
              <FishboneIcon className="h-4 w-4" />
              {currentPoints} Fish Points
            </span>
          </div>

          {!hasEnoughPoints && (
            <p className="pt-2 text-xs text-rose-500/90 font-medium text-center border-t border-border/30">
              You need {cost - currentPoints} more Fish Points. Observe cats or share to earn more!
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-2xl text-muted-foreground hover:bg-muted/40"
          >
            Keep Waiting
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirmUnlock();
              onOpenChange(false);
            }}
            disabled={!hasEnoughPoints}
            className={cn(
              'rounded-2xl font-bold px-5 text-white shadow-md transition transform active:scale-95',
              hasEnoughPoints
                ? 'bg-gradient-to-r from-[#A240FF] to-[#3696C9] hover:opacity-95 hover:shadow-lg'
                : 'bg-muted-foreground/30'
            )}
          >
            <FishboneIcon className="mr-2 h-4 w-4" />
            Unlock ({cost} Fish Points)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
