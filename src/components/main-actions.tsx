
'use client';

import { Heart, Share2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * A component that displays the main actions after a cat is revealed.
 * @param onSave A function to call when the save button is clicked.
 * @param onShare A function to call when the share button is clicked.
 * @param onReset A function to call when the reset button is clicked.
 * @param isSaved Whether the message is saved.
 * @param isShared Whether the outcome has been shared.
 * @param reduceMotion Whether to reduce motion.
 * @param isShareDisabled Whether the share button is disabled.
 * @param isResetDisabled Whether the reset button is disabled.
 */
export function MainActions({
    onSave,
    onShare,
    onReset,
    isSaved,
    isShared,
    reduceMotion,
    isShareDisabled = false,
    isResetDisabled = false
}: {
    onSave: () => void;
    onShare: () => void;
    onReset: () => void;
    isSaved: boolean;
    isShared: boolean;
    reduceMotion: boolean;
    isShareDisabled?: boolean;
    isResetDisabled?: boolean;
}) {
    return (
        <div className={cn("flex items-center justify-center gap-4 mt-4 w-full", !reduceMotion && "animate-bounce-in")}>
            <Button
                size="icon"
                variant="outline"
                aria-pressed={isSaved}
                aria-label={isSaved ? 'Remove from diary' : 'Save to diary'}
                className={cn(
                    'transition-all duration-200 ease-in-out transform hover:scale-110',
                    isSaved
                        ? 'border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/20'
                        : 'text-muted-foreground hover:text-primary'
                )}
                onClick={onSave}
            >
                <Heart
                    className={cn(
                        'h-4 w-4 transition-colors',
                        isSaved ? 'fill-current text-red-500' : 'text-muted-foreground'
                    )}
                />
            </Button>

            <Button onClick={onShare} size="sm" className={cn(
                "bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 ease-in-out transform hover:scale-105",
                isShared && "bg-green-500 hover:bg-green-500/90"
                )}
                disabled={isShareDisabled}>
                <Share2 className="mr-2 h-3.5 w-3.5" />
                {isShared ? "Shared" : "Share"}
            </Button>

            <Button
                size="icon"
                variant="outline"
                onClick={onReset}
                className={cn(
                    'transition-all duration-200 ease-in-out transform hover:scale-110',
                    'text-muted-foreground hover:text-primary',
                    isResetDisabled && 'pointer-events-none opacity-50'
                )}
                disabled={isResetDisabled}
                aria-label="Try Again"
            >
                <RotateCcw className={cn('h-4 w-4', isResetDisabled ? 'text-muted-foreground/50' : 'text-primary')} />
            </Button>
        </div>
    );
}
