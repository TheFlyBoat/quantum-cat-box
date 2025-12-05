import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import type { User } from 'firebase/auth';

type UserStatusLabelProps = {
    className?: string;
};

const isFirebaseUser = (candidate: User | 'guest' | null | undefined): candidate is User =>
    typeof candidate === 'object' && candidate !== null && 'uid' in candidate;

/**
 * Badge showing the current auth state.
 * Guest users get a muted appearance, signed-in users are highlighted.
 */
export function UserStatusLabel({ className }: UserStatusLabelProps) {
    const { user, displayName } = useAuth();
    const firebaseUser = isFirebaseUser(user) ? user : null;
    const isGuest = !firebaseUser;

    const preferredName =
        displayName?.trim() ||
        firebaseUser?.displayName?.trim() ||
        firebaseUser?.email?.split('@')[0]?.trim() ||
        null;
    const label = isGuest ? 'Guest' : preferredName ?? 'Guest';

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
