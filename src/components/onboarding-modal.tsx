'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Box, Fish, Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
    open: boolean;
    onClose: () => void;
}

const sections = [
    {
        icon: Box,
        iconClass: 'text-teal-500',
        title: 'Open the Box',
        titleClass: 'text-purple-500',
        body: 'Each tap collapses reality, revealing a unique cat: Alive, Dead, or Paradox, each with a cosmic message.',
    },
    {
        icon: Fish,
        iconClass: 'text-purple-500',
        title: 'Collect & Discover',
        titleClass: 'text-cyan-500',
        body: 'Earn Fish Points, unlock badges, and grow your streak as you reveal new quantum cats.',
    },
    {
        icon: Heart,
        iconClass: 'text-cyan-500',
        title: 'Save & Reflect',
        titleClass: 'text-rose-400',
        body: 'Keep your favourite messages in each cat’s diary and explore your growing gallery of discoveries.',
    },
    {
        icon: Share2,
        iconClass: 'text-rose-400',
        title: 'Share the Wonder',
        titleClass: 'text-teal-500',
        body: 'Unlock box skins, share your revelations, and return daily for a new cat and a new twist in reality.',
    },
];

/**
 * A modal component that guides the user through the app's features.
 * @param open Whether the modal is open.
 * @param onClose A function to call when the modal is closed.
 */
export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
    const [stepIndex, setStepIndex] = useState(0);
    const totalSteps = sections.length;
    const currentStep = sections[stepIndex];
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
                        className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-10 text-center shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <div
                            className={cn(
                                'flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100',
                                currentStep.iconClass
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
