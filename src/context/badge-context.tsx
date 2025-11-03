
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { playSound } from '@/lib/audio';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';
import badgeData from '@/lib/badge-data.json';

type UnlockOptions = {
    celebrateImmediately?: boolean;
}

interface BadgeContextType {
  unlockedBadges: string[];
  unlockBadge: (badgeId: string, options?: UnlockOptions) => void;
  isBadgeUnlocked: (badgeId: string) => boolean;
  lastUnlockedBadgeId: string | null;
  celebrationBadgeId: string | null;
  triggerCelebration: () => void;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

const validBadgeIds = new Set((badgeData.badges ?? []).map(badge => badge.id));

const badgeMigrationMap: Record<string, string | null> = {
  '7-day-streak': 'curious-kitten',
  '30-day-streak': 'curious-kitten',
  '100-opens': null,
  '365-opens': null,
  '10-messages-saved': 'message-keeper',
  '50-messages-saved': 'message-keeper',
  'first-share': 'storyteller',
  '10-shares': 'viral-cat',
  'skin-changer': null,
  'double-collapse': null,
  'improbable-streak': null,
  'cosmic-alignment': null,
  'undead-luck': null,
  '100-fish-points': null,
  'the-collector': null,
};

const migrateBadgeIds = (badges: string[] = []): string[] => {
  const migrated = badges.map(id => {
    if (Object.prototype.hasOwnProperty.call(badgeMigrationMap, id)) {
      return badgeMigrationMap[id] ?? null;
    }
    return id;
  }).filter((id): id is string => !!id && validBadgeIds.has(id));

  return Array.from(new Set(migrated));
};

const haveSameMembers = (original: string[], migrated: string[]) => {
  if (original.length !== migrated.length) return false;
  const sortedOriginal = [...original].sort();
  const sortedMigrated = [...migrated].sort();
  return sortedOriginal.every((value, index) => value === sortedMigrated[index]);
};

export const BadgeProvider = ({ children }: { children: ReactNode }) => {
  const [lastUnlockedBadgeId, setLastUnlockedBadgeId] = useState<string | null>(null);
  const [celebrationBadgeId, setCelebrationBadgeId] = useState<string | null>(null);
  
  const { user, userData, setUserData, storageMode } = useAuth();

  const storedBadges = useMemo(() => userData?.unlockedBadges || [], [userData?.unlockedBadges]);
  const unlockedBadges = useMemo(() => migrateBadgeIds(storedBadges), [storedBadges]);
  const needsMigration = useMemo(() => !haveSameMembers(storedBadges, unlockedBadges), [storedBadges, unlockedBadges]);

  useEffect(() => {
    if (!needsMigration) return;

    const migrate = () => {
      setUserData(prevData => {
        const base = prevData ?? defaultUserData;
        return { ...base, unlockedBadges };
      });
      if (storageMode === 'cloud' && user && user !== 'guest') {
        void saveUserData(user.uid, { unlockedBadges });
      }
    };

    if (typeof queueMicrotask === 'function') {
      queueMicrotask(migrate);
    } else {
      setTimeout(migrate, 0);
    }
  }, [needsMigration, unlockedBadges, setUserData, storageMode, user]);

  const triggerCelebration = useCallback(() => {
    if (!lastUnlockedBadgeId) return;

    setCelebrationBadgeId(lastUnlockedBadgeId);
    playSound('badge-unlocked');

    // Allow the UI to animate before clearing the active badge.
    setTimeout(() => {
      setCelebrationBadgeId(null);
      setLastUnlockedBadgeId(null);
    }, 4000);
  }, [lastUnlockedBadgeId]);

  const unlockBadge = useCallback((badgeId: string, options: UnlockOptions = { celebrateImmediately: true }) => {
    const resolvedBadgeId = Object.prototype.hasOwnProperty.call(badgeMigrationMap, badgeId)
      ? badgeMigrationMap[badgeId]
      : badgeId;

    if (!resolvedBadgeId || !validBadgeIds.has(resolvedBadgeId)) return;
    if (unlockedBadges.includes(resolvedBadgeId)) return;

    const newBadges = [...unlockedBadges, resolvedBadgeId];
    setLastUnlockedBadgeId(resolvedBadgeId); // Set the pending badge ID

    if (options.celebrateImmediately) {
        // We use a micro-task timeout to ensure the state update has propagated
        // before we trigger the sound and visual effect.
        setTimeout(triggerCelebration, 0);
    }
    
    // Persist for logged-in users
    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      return { ...base, unlockedBadges: newBadges };
    });

    if (storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { unlockedBadges: newBadges });
    }
  }, [unlockedBadges, user, setUserData, triggerCelebration, storageMode]);


  const isBadgeUnlocked = useCallback((badgeId: string) => {
    return unlockedBadges.includes(badgeId);
  }, [unlockedBadges]);

  return (
    <BadgeContext.Provider value={{ unlockedBadges, unlockBadge, isBadgeUnlocked, lastUnlockedBadgeId, celebrationBadgeId, triggerCelebration }}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadges = () => {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
};
