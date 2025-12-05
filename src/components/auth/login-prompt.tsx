'use client';

import { useMemo } from 'react';
import { useAuth, LoginPromptReason } from '@/context/auth-context';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cat, Save } from 'lucide-react';

const reasonCopy: Record<LoginPromptReason, string> = {
  'box-opens': 'The timeline is shifting. Secure your discoveries before they fade into the void.',
  'points': 'Your Fish Points are accumulating. Anchor them to your soul before the quantum tide rises.',
  'customize': 'You are shaping reality. Bind these choices to your essence forever.',
  'gallery': 'Your memories are precious. Do not let the fog of uncertainty erase them.',
};

export function LoginPrompt() {
  const { loginPromptOpen, loginPromptReason, dismissLoginPrompt, openLoginModal, storageMode } = useAuth();

  const supportingCopy = useMemo(() => {
    if (!loginPromptReason) return null;
    return reasonCopy[loginPromptReason];
  }, [loginPromptReason]);

  if (storageMode === 'cloud') {
    return null;
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dismissLoginPrompt();
    }
  };

  return (
    <Dialog open={loginPromptOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm overflow-hidden border-0 bg-transparent p-0 shadow-2xl sm:max-w-md">
        <div className="relative flex flex-col items-center bg-slate-950 px-6 py-8 text-center text-white">
          {/* Mystical Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 ring-1 ring-purple-400/30 backdrop-blur-sm">
              <Cat className="h-8 w-8 text-purple-300" />
            </div>

            <div className="space-y-2">
              <h2 className="font-headline text-2xl font-bold tracking-wide text-white drop-shadow-md">
                Preserve Your Destiny
              </h2>
              <p className="font-fortune text-lg leading-relaxed text-purple-100/80">
                {supportingCopy || 'The universe is in flux. Save your progress to keep your cats safe.'}
              </p>
            </div>

            <div className="mt-4 grid w-full gap-3">
              <Button 
                onClick={() => openLoginModal(loginPromptReason ?? undefined)} 
                className="w-full bg-white text-slate-950 hover:bg-purple-100 font-bold text-base py-5"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
              <Button 
                variant="ghost" 
                onClick={dismissLoginPrompt} 
                className="w-full text-purple-300 hover:text-white hover:bg-white/10"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
