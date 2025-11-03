import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

type UserStatusLabelProps = {
    className?: string;
};

/**
 * Badge showing the current auth state.
 * Guest users get a muted appearance, signed-in users are highlighted.
 */
export function UserStatusLabel({ className }: UserStatusLabelProps) {
    const { user, displayName } = useAuth();
    const isGuest = !user || user === 'guest';

    const preferredName =
        displayName?.trim() ||
        user?.displayName?.trim() ||
        user?.email?.split('@')[0] ||
        null;
    const label = isGuest ? 'Guest' : (preferredName ?? 'Guest');

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
                isGuest
                    ? 'border-border/60 bg-muted/30 text-muted-foreground'
                    : 'border-primary/25 bg-primary/10 text-primary',
                className,
            )}
        >
            {label}
        </span>
    );
}
