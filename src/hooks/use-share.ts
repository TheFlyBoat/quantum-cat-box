
'use client';

import { useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import { usePoints } from '@/context/points-context';
import { useBadges } from '@/context/badge-context';
import { useAuth } from '@/context/auth-context';
import { defaultUserData, saveUserData, type UserData } from '@/lib/user-data';

export const SHARE_REWARD_POINTS = 10;

export interface ShareAsset {
    dataUrl: string;
    file: File;
}

export function useShare(message: string) {
    const { addPoints } = usePoints();
    const { isBadgeUnlocked, unlockBadge } = useBadges();
    const { user, setUserData, storageMode, userData } = useAuth();
    const createShareAsset = useCallback(async (ref: React.RefObject<HTMLDivElement>): Promise<ShareAsset> => {
        if (!ref.current || !message) {
            throw new Error('Share content is not ready yet.');
        }

        if (typeof document !== 'undefined' && document.fonts) {
            await document.fonts.ready;
        }

        const dataUrl = await htmlToImage.toPng(ref.current, {
            cacheBust: true,
            pixelRatio: 2,
            fontEmbedCSS: `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Patrick+Hand&family=Quicksand:wght@400;600&display=swap');`
        });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'quantum-cat.png', { type: 'image/png' });

        return { dataUrl, file };
    }, [message]);

    /**
     * Counts a share and awards Fish Points for the first share of the day only.
     * Returns whether points were awarded, so the UI can say so.
     */
    const rewardShare = useCallback((): boolean => {
        const base = userData ?? defaultUserData;
        const today = new Date().toDateString();
        const isRewarded = base.lastShareRewardDate !== today;
        const newShareCount = (base.shareCount ?? 0) + 1;
        const updates: Partial<UserData> = isRewarded
            ? { shareCount: newShareCount, lastShareRewardDate: today }
            : { shareCount: newShareCount };

        setUserData(prevData => ({ ...(prevData ?? defaultUserData), ...updates }));

        if (storageMode === 'cloud' && user && user !== 'guest') {
            void saveUserData(user.uid, updates);
        }

        if (isRewarded) {
            addPoints(SHARE_REWARD_POINTS);
        }

        if (newShareCount === 1 && !isBadgeUnlocked('storyteller')) {
            unlockBadge('storyteller');
        }

        if (newShareCount >= 5 && !isBadgeUnlocked('viral-cat')) {
            unlockBadge('viral-cat');
        }

        return isRewarded;
    }, [addPoints, isBadgeUnlocked, unlockBadge, setUserData, storageMode, user, userData]);

    const isShareRewardAvailable = (userData?.lastShareRewardDate ?? '') !== new Date().toDateString();

    return { createShareAsset, rewardShare, isShareRewardAvailable };
}
