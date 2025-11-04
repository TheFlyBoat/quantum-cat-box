
'use client';

import { useCallback, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { usePoints } from '@/context/points-context';
import { useBadges } from '@/context/badge-context';
import { useAuth } from '@/context/auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';

export interface ShareAsset {
    dataUrl: string;
    file: File;
}

export function useShare(message: string) {
    const shareCardRef = useRef<HTMLDivElement>(null);
    const { addPoints } = usePoints();
    const { isBadgeUnlocked, unlockBadge } = useBadges();
    const { user, setUserData, storageMode, userData } = useAuth();
    const sessionShareCountRef = useRef(0);

    useEffect(() => {
        sessionShareCountRef.current = userData?.shareCount ?? 0;
    }, [userData]);

    const createShareAsset = useCallback(async (): Promise<ShareAsset> => {
        if (!shareCardRef.current || !message) {
            throw new Error('Share content is not ready yet.');
        }

        const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            fontEmbedCSS: `@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');`
        });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'quantum-cat.png', { type: 'image/png' });

        return { dataUrl, file };
    }, [message]);

    const rewardShare = useCallback(() => {
        let newShareCount = 0;

        setUserData(prevData => {
            const base = prevData ?? defaultUserData;
            newShareCount = (base.shareCount ?? 0) + 1;
            return { ...base, shareCount: newShareCount };
        });

        if (storageMode === 'cloud' && user && user !== 'guest') {
            void saveUserData(user.uid, { shareCount: newShareCount });
        } else {
            sessionShareCountRef.current = newShareCount;
        }

        addPoints(10);

        if (newShareCount === 1 && !isBadgeUnlocked('storyteller')) {
            unlockBadge('storyteller');
        }

        if (newShareCount >= 5 && !isBadgeUnlocked('viral-cat')) {
            unlockBadge('viral-cat');
        }
    }, [addPoints, isBadgeUnlocked, unlockBadge, setUserData, storageMode, user]);

    return { shareCardRef, createShareAsset, rewardShare };
}
