
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo, useRef } from 'react';
import { playFeedback } from '@/lib/audio';
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
  collectBadge: (badgeId: string) => void;
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
  const [celebrationBadgeId, setCelebrationBadgeId] = useState<string | null>(null);
  const [pendingBadges, setPendingBadges] = useState<string[]>([]);

  const pendingBadgesRef = useRef<string[]>([]);

  const { user, userData, setUserData, storageMode } = useAuth();

  useEffect(() => {
    pendingBadgesRef.current = pendingBadges;
  }, [pendingBadges]);

  const storedBadges = useMemo(() => userData?.unlockedBadges || [], [userData?.unlockedBadges]);
  const unlockedBadges = useMemo(() => migrateBadgeIds(storedBadges), [storedBadges]);
  const needsMigration = useMemo(() => !haveSameMembers(storedBadges, unlockedBadges), [storedBadges, unlockedBadges]);
  const lastUnlockedBadgeId = useMemo(() => pendingBadges[0] ?? null, [pendingBadges]);

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

  const startCelebration = useCallback((badgeId: string) => {
    if (!badgeId) return;

    setCelebrationBadgeId(previous => {
      if (previous === badgeId) return previous;
      playFeedback('badge-unlocked');
      return badgeId;
    });
  }, []);

  const triggerCelebration = useCallback(() => {
    const nextBadgeId = pendingBadgesRef.current[0];
    if (!nextBadgeId) return;
    startCelebration(nextBadgeId);
  }, [startCelebration]);

  const unlockBadge = useCallback((badgeId: string, options: UnlockOptions = { celebrateImmediately: true }) => {
    const resolvedBadgeId = Object.prototype.hasOwnProperty.call(badgeMigrationMap, badgeId)
      ? badgeMigrationMap[badgeId]
      : badgeId;

    if (!resolvedBadgeId || !validBadgeIds.has(resolvedBadgeId)) return;
    if (unlockedBadges.includes(resolvedBadgeId)) return;
    if (pendingBadgesRef.current.includes(resolvedBadgeId)) return;

    setPendingBadges(prev => {
      const next = [...prev, resolvedBadgeId];
      pendingBadgesRef.current = next;
      return next;
    });

    if (options.celebrateImmediately) {
      const scheduleCelebration = () => triggerCelebration();
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(scheduleCelebration);
      } else {
        setTimeout(scheduleCelebration, 0);
      }
    }
  }, [triggerCelebration, unlockedBadges]);

  const collectBadge = useCallback((badgeId: string) => {
    if (!badgeId || !validBadgeIds.has(badgeId)) return;

    setPendingBadges(prev => {
      const next = prev.filter(id => id !== badgeId);
      pendingBadgesRef.current = next;
      return next;
    });

    setCelebrationBadgeId(current => (current === badgeId ? null : current));

    let updatedBadges: string[] | null = null;
    let didUpdate = false;

    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      const existing = base.unlockedBadges ?? [];

      if (existing.includes(badgeId)) {
        updatedBadges = existing;
        return base;
      }

      updatedBadges = [...existing, badgeId];
      didUpdate = true;
      return { ...base, unlockedBadges: updatedBadges };
    });

    if (didUpdate && updatedBadges && storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { unlockedBadges: updatedBadges });
    }
  }, [setUserData, storageMode, user]);

  const isBadgeUnlocked = useCallback((badgeId: string) => {
    return unlockedBadges.includes(badgeId);
  }, [unlockedBadges]);

  return (
    <BadgeContext.Provider value={{ unlockedBadges, unlockBadge, isBadgeUnlocked, lastUnlockedBadgeId, celebrationBadgeId, collectBadge, triggerCelebration }}>
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
