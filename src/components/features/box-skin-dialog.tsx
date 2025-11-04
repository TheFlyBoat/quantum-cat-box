
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { ComponentType } from 'react';

type BoxSkinDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skin: {
    id: string;
    name: string;
    description: string;
  };
  onApply: () => void;
};

const SKIN_COMPONENTS: Record<string, ComponentType<{ className?: string }>> = {
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

export function BoxSkinDialog({ open, onOpenChange, skin, onApply }: BoxSkinDialogProps) {
  const BoxComponent = SKIN_COMPONENTS[skin.id] ?? BoxIcon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skin.name}</DialogTitle>
          <DialogDescription>{skin.description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-8">
          <BoxComponent className="w-32 h-32" />
        </div>
        <DialogFooter>
          <Button onClick={onApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
