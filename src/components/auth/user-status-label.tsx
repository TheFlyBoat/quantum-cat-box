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
        firebaseUser?.email?.split('@')[0]?.trim() ||
        displayName?.trim() ||
        firebaseUser?.displayName?.trim() ||
        null;
    const label = isGuest ? 'Guest' : preferredName ?? 'Guest';

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
                isGuest
                    ? 'border-[#CDC1E1] bg-transparent text-[#8D52F6] dark:border-[#2F374C] dark:text-[#A8AEBD]'
                    : 'border-transparent bg-[#F2BB33] text-[#1F1404]',
                className,
            )}
        >
            {label}
        </span>
    );
}
