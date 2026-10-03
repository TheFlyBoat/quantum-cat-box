'use client';

import { Fish } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BoxIcon,
  CarbonBoxIcon,
  CardboardBoxIcon,
  BlackWoodenBoxIcon,
  SpecialXK6BoxIcon,
  StoneBoxIcon,
  TardisBoxIcon,
} from '@/components/icons';
import { CircuitBoardBoxIcon } from '@/components/icons/circuit-board-box-icon';
import { CrystalBoxIcon } from '@/components/icons/crystal-box-icon';
import { GalaxyBoxIcon } from '@/components/icons/galaxy-box-icon';
import { PlushBoxIcon } from '@/components/icons/plush-box-icon';
import { SteampunkBoxIcon } from '@/components/icons/steampunk-box-icon';
import { useBoxSkin } from '@/context/box-skin-context';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';

const SKIN_COMPONENTS: Record<string, ComponentType<{ className?: string; isOpen?: boolean }>> = {
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

interface UnlockBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPoints: number;
  cost?: number;
  onConfirmUnlock: () => void;
}

/**
 * Modal confirmation dialog prompting the user to unlock the daily Quantum Box early.
 * Follows the Box Skin purchase dialog layout and visual standards.
 */
export function UnlockBoxDialog({
  open,
  onOpenChange,
  currentPoints,
  cost = 10,
  onConfirmUnlock,
}: UnlockBoxDialogProps) {
  const { selectedSkin } = useBoxSkin();
  const BoxComponent = SKIN_COMPONENTS[selectedSkin] ?? BoxIcon;
  const hasEnoughPoints = currentPoints >= cost;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border-border/60 bg-background/95 backdrop-blur-md">
        <DialogHeader className="text-center sm:text-center flex flex-col items-center gap-1">
          <DialogTitle className="text-2xl font-headline font-bold text-foreground">
            Unlock Quantum Box?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            You have <strong className="text-foreground">{currentPoints} Fish Points</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* Box Component Preview with Single Clear Price Tag */}
        <div className="flex flex-col items-center justify-center p-4 my-2">
          <div className="relative flex items-center justify-center h-32 w-32 drop-shadow-md">
            <BoxComponent className="h-full w-full" />
          </div>
          <Badge
            variant="secondary"
            className="mt-3 flex items-center gap-1.5 px-3 py-1 text-sm font-bold bg-[#A240FF]/15 text-[#A240FF] border border-[#A240FF]/30 rounded-full"
          >
            <Fish className="h-3.5 w-3.5 text-[#3696C9]" />
            {cost} Fish Points
          </Badge>
        </div>

        {!hasEnoughPoints && (
          <p className="text-xs text-rose-500 font-medium text-center -mt-1 mb-2">
            Need {cost - currentPoints} more points to unlock.
          </p>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2 justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-2xl text-muted-foreground hover:bg-muted/40"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirmUnlock();
              onOpenChange(false);
            }}
            disabled={!hasEnoughPoints}
            className={cn(
              'rounded-2xl font-bold px-6 text-white shadow-md transition transform active:scale-95',
              hasEnoughPoints
                ? 'bg-gradient-to-r from-[#A240FF] to-[#3696C9] hover:opacity-95 hover:shadow-lg'
                : 'bg-muted-foreground/30 cursor-not-allowed'
            )}
          >
            <Fish className="mr-1.5 h-4 w-4" />
            Unlock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
