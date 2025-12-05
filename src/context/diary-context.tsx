
'use client';

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useBadges } from './badge-context';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';

type DiaryEntry = {
  messages: string[];
  count: number;
};

type DiaryData = {
  [catId: string]: DiaryEntry;
};

interface DiaryContextType {
  data: DiaryData;
  toggleDiaryEntry: (catId: string, message: string) => boolean;
  recordReveal: (catId: string) => void;
  isMessageSaved: (catId: string, message: string) => boolean;
  getDiary: (catId: string) => string[];
  getRevealCount: (catId: string) => number;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
  const { unlockBadge, isBadgeUnlocked } = useBadges();
  const { user, userData, setUserData, storageMode } = useAuth();
  const data = useMemo(() => userData?.diary || {}, [userData]);
  const unlockedCats = useMemo(() => userData?.unlockedCats || [], [userData?.unlockedCats]);

  const toggleDiaryEntry = useCallback((catId: string, message: string) => {
    let result: { saved: boolean; diary: DiaryData; unlockBadge: boolean } | null = null;

    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      const baseDiary: DiaryData = base.diary ?? {};
      const existingEntry = baseDiary[catId] ?? { messages: [], count: 0 };
      const hasMessage = existingEntry.messages.includes(message);

      const updatedMessages = hasMessage
        ? existingEntry.messages.filter(entry => entry !== message)
        : [...existingEntry.messages, message];
      const newEntry: DiaryEntry = {
        messages: updatedMessages,
        count: existingEntry.count,
      };

      const newDiary: DiaryData = { ...baseDiary };

      if (newEntry.messages.length === 0 && newEntry.count === 0) {
        delete newDiary[catId];
      } else {
        newDiary[catId] = newEntry;
      }

      let shouldUnlockBadge = false;
      if (!hasMessage) {
        const totalSavedMessages = Object.values(newDiary).reduce(
          (sum, entry) => sum + entry.messages.length,
          0,
        );

        if (totalSavedMessages >= 5 && !isBadgeUnlocked('message-keeper')) {
          shouldUnlockBadge = true;
        }
      }

      result = { saved: !hasMessage, diary: newDiary, unlockBadge: shouldUnlockBadge };

      return { ...base, diary: newDiary };
    });

    const outcome = result as { saved: boolean; diary: DiaryData; unlockBadge: boolean } | null;

    if (outcome?.unlockBadge) {
      unlockBadge('message-keeper');
    }

    if (storageMode === 'cloud' && user && user !== 'guest' && outcome) {
      void saveUserData(user.uid, { diary: outcome.diary });
    }

    return outcome?.saved ?? false;
  }, [isBadgeUnlocked, unlockBadge, setUserData, storageMode, user]);

  const recordReveal = useCallback((catId: string) => {
    let updatedDiary: DiaryData | null = null;

    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      const baseDiary: DiaryData = base.diary ?? {};
      const existingEntry = baseDiary[catId] ?? { messages: [], count: 0 };
      const newEntry: DiaryEntry = {
        messages: existingEntry.messages,
        count: existingEntry.count + 1,
      };
      const newDiary: DiaryData = { ...baseDiary, [catId]: newEntry };
      updatedDiary = newDiary;
      return { ...base, diary: newDiary };
    });

    if (storageMode === 'cloud' && user && user !== 'guest' && updatedDiary) {
      void saveUserData(user.uid, { diary: updatedDiary });
    }
  }, [setUserData, storageMode, user]);

  const isMessageSaved = useCallback((catId: string, message: string) => {
    return data[catId]?.messages.includes(message) ?? false;
  }, [data]);

  const getDiary = useCallback((catId: string) => {
    return data[catId]?.messages || [];
  }, [data]);

  const getRevealCount = useCallback((catId: string) => {
    const diaryCount = data[catId]?.count || 0;
    const isUnlocked = unlockedCats.includes(catId);

    if (isUnlocked && diaryCount === 0) {
      return 1;
    }
    
    return diaryCount;
  }, [data, unlockedCats]);

  return (
    <DiaryContext.Provider value={{ data, toggleDiaryEntry, recordReveal, isMessageSaved, getDiary, getRevealCount }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};
