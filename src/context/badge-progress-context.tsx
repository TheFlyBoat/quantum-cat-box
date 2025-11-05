'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { differenceInCalendarDays, startOfToday } from 'date-fns';
import { useBadges } from './badge-context';
import { CatOutcome } from '@/lib/types';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';

interface Observation {
    id: string;
    type: CatOutcome;
}

export interface BadgeProgressContextType {
  streak: number;
  totalObservations: number;
  recordObservation: (catId: string, catType: CatOutcome) => void;
}

const BadgeProgressContext = createContext<BadgeProgressContextType | undefined>(undefined);

export const BadgeProgressProvider = ({ children }: { children: ReactNode }) => {
  const { unlockBadge, isBadgeUnlocked } = useBadges();
  const { user, userData, setUserData, storageMode } = useAuth();

  const streak = userData?.streak ?? 0;
  const totalObservations = userData?.totalObservations ?? 0;

  const recordObservation = useCallback((catId: string, catType: CatOutcome) => {
    const today = startOfToday();

    const base = userData ?? defaultUserData;
    const newTotal = (base.totalObservations ?? 0) + 1;
    const lastDate = base.lastObservationDate ? new Date(base.lastObservationDate) : null;
    let newStreak = base.streak ?? 0;
    const existingHistory = base.revealHistory ?? [];

    if (!lastDate || differenceInCalendarDays(today, lastDate) > 0) {
        if (lastDate && differenceInCalendarDays(today, lastDate) === 1) {
            newStreak = (base.streak ?? 0) + 1;
        } else {
            newStreak = 1;
        }
    }

    const celebrateOptions = { celebrateImmediately: false };


    // Badge Checks for Streaks
    if (newStreak === 3 && !isBadgeUnlocked('curious-kitten')) unlockBadge('curious-kitten', celebrateOptions);
    
    // Surprise Badge Checks
    const newHistory: Observation[] = [{ id: catId, type: catType }, ...existingHistory].slice(0, 3);

    if (newHistory.length === 3 && newHistory.every(obs => obs.id === newHistory[0].id)) {
        if (!isBadgeUnlocked('quantum-echo')) unlockBadge('quantum-echo', celebrateOptions);
    }

    // Persist data for logged-in users
    const updates = {
        totalObservations: newTotal,
        streak: newStreak,
        lastObservationDate: today.toISOString(),
        revealHistory: newHistory,
    } as const;

    setUserData(prevData => {
        const base = prevData ?? defaultUserData;
        return { ...base, ...updates };
    });

    if (storageMode === 'cloud' && user && user !== 'guest') {
        void saveUserData(user.uid, updates);
    }
  }, [isBadgeUnlocked, unlockBadge, setUserData, storageMode, user, userData]);

  return (
    <BadgeProgressContext.Provider value={{ streak, totalObservations, recordObservation }}>
      {children}
    </BadgeProgressContext.Provider>
  );
};

export const useBadgeProgress = () => {
  const context = useContext(BadgeProgressContext);
  if (context === undefined) {
    throw new Error('useBadgeProgress must be used within an BadgeProgressProvider');
  }
  return context;
};
