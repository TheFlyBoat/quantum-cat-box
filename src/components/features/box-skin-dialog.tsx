
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
import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type BoxSkinDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skin: {
    id: string;
    name: string;
    description: string;
    power?: {
      title: string;
      description: string;
      badgeText: string;
    };
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
      <DialogContent className="rounded-3xl p-6 border-border/60 bg-background/95 backdrop-blur-md sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl font-headline font-bold text-primary">{skin.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">{skin.description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center p-6 my-1">
          <BoxComponent className="w-32 h-32 drop-shadow-md" />
        </div>

        {skin.power && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3.5 text-left flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0 mt-0.5">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Equipped Power</span>
                <Badge variant="outline" className="text-[10px] font-bold border-primary/40 text-primary">
                  {skin.power.badgeText}
                </Badge>
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">{skin.power.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{skin.power.description}</p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 flex sm:justify-center">
          <Button
            onClick={onApply}
            className="w-full sm:w-auto px-8 rounded-2xl font-bold bg-primary text-primary-foreground shadow-md hover:opacity-95"
          >
            Equip Box Skin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
