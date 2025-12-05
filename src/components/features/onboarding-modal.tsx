'use client';

import { type ComponentType, useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/utils';
import { Box, Fish, Heart, Share2 } from 'lucide-react';

interface OnboardingModalProps {
    open: boolean;
    onClose: () => void;
}

type OnboardingSection = {
  icon: ComponentType<{ className?: string }>;
  accentClass: string;
  title: string;
  titleClass: string;
  body: string;
};

const onboardingSections: OnboardingSection[] = [
  {
    icon: Box,
    accentClass: 'bg-[#A240FF]/10 text-[#A240FF]',
    title: 'Open the Quantum Box',
    titleClass: 'text-[#A240FF]',
    body: 'Tap the Quantum Box to collapse possibilities and reveal a cat in one of three cat states: alive, dead, or paradox.',
  },
  {
    icon: Fish,
    accentClass: 'bg-[#FF809F]/10 text-[#FF809F]',
    title: 'Collect Fish Points',
    titleClass: 'text-[#FF809F]',
    body: 'Earn Fish Points, unlock badges, and grow your streak as you uncover new cats from the quantum realm.',
  },
  {
    icon: Heart,
    accentClass: 'bg-[#3696C9]/10 text-[#3696C9]',
    title: 'Curate Your Cat Diary',
    titleClass: 'text-[#3696C9]',
    body: 'Save your favourite Quantum Messages to the Cat Diary and revisit past revelations in your gallery.',
  },
  {
    icon: Share2,
    accentClass: 'bg-[#A9DB4A]/10 text-[#A9DB4A]',
    title: 'Share the Wonder',
    titleClass: 'text-[#A9DB4A]',
    body: 'Unlock Box Skins, share your discoveries, and return daily for fresh twists in quantum reality.',
  },
];

/**
 * A modal component that guides the user through the app's features.
 * @param open Whether the modal is open.
 * @param onClose A function to call when the modal is closed.
 */
export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
    const [stepIndex, setStepIndex] = useState(0);
    const totalSteps = onboardingSections.length;
    const currentStep = onboardingSections[stepIndex];
    const isLastStep = stepIndex === totalSteps - 1;

    const handleAdvance = () => {
        if (isLastStep) {
            setStepIndex(0);
            onClose();
        } else {
            setStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
        }
    };

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            setStepIndex(0);
            onClose();
        }
    };

    const IconComponent = currentStep.icon;

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="max-w-lg border-0 bg-transparent p-0">
                <DialogTitle>
                    <VisuallyHidden>{currentStep.title}</VisuallyHidden>
                </DialogTitle>
                <div className="flex items-center justify-center">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={handleAdvance}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleAdvance();
                            }
                        }}
                        className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-10 text-center shadow-xl focus:outline-none focus:ring-2 focus:ring-[#A240FF]"
                    >
                        <div
                            className={cn(
                                'flex h-20 w-20 items-center justify-center rounded-2xl',
                                currentStep.accentClass
                            )}
                        >
                            <IconComponent className="h-10 w-10" />
                        </div>
                        <h3 className={cn('font-headline text-3xl font-semibold', currentStep.titleClass)}>
                            {currentStep.title}
                        </h3>
                        <p className="font-body text-lg leading-relaxed text-muted-foreground">
                            {currentStep.body}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
