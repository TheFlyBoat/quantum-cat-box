
'use client';

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useBadges } from './badge-context';
import catData from '@/lib/cat-data.json';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';

interface CatCollectionContextType {
  unlockedCats: string[];
  unlockCat: (catId: string, options?: { celebrateImmediately?: boolean }) => void;
  isUnlocked: (catId: string) => boolean;
}

const allCats = catData.cats as {id: string, name: string, description: string, type: string}[];

const CatCollectionContext = createContext<CatCollectionContextType | undefined>(undefined);

export const CatCollectionProvider = ({ children }: { children: ReactNode }) => {
  const { unlockBadge, isBadgeUnlocked } = useBadges();
  const { user, userData, setUserData, storageMode } = useAuth();
  const unlockedCats = useMemo(() => userData?.unlockedCats || [], [userData]);

  const unlockCat = useCallback((catId: string, options?: { celebrateImmediately?: boolean }) => {
    const celebrateOptions = { celebrateImmediately: options?.celebrateImmediately ?? true };
    
    if (unlockedCats.includes(catId)) return;

    const newUnlockedCats = [...unlockedCats, catId];

    const newlyUnlockedCat = allCats.find(c => c.id === catId);
    if (!newlyUnlockedCat) return;

    const countCatsOfType = (type: string) =>
        newUnlockedCats.filter(id => {
            const cat = allCats.find(c => c.id === id);
            return cat?.type === type;
        }).length;

    if (newlyUnlockedCat.type === 'Alive') {
        const aliveCount = countCatsOfType('Alive');
        if (aliveCount >= 3 && !isBadgeUnlocked('alive-kicking')) {
            unlockBadge('alive-kicking', celebrateOptions);
        }
    }

    if (newlyUnlockedCat.type === 'Dead') {
        const deadCount = countCatsOfType('Dead');
        if (deadCount >= 3 && !isBadgeUnlocked('rest-in-pieces')) {
            unlockBadge('rest-in-pieces', celebrateOptions);
        }
    }

    if (newlyUnlockedCat.type === 'Paradox') {
        const paradoxCount = countCatsOfType('Paradox');
        if (paradoxCount >= 3 && !isBadgeUnlocked('paradox-seeker')) {
            unlockBadge('paradox-seeker', celebrateOptions);
        }
    }

    const checkSetCompletion = (type: string) => {
        const allCatsOfType = allCats.filter(c => c.type === type);
        const unlockedCatsOfType = newUnlockedCats.map(id => allCats.find(c => c.id === id)).filter(c => c && c.type === type);
        return allCatsOfType.length > 0 && allCatsOfType.length === unlockedCatsOfType.length;
    }

    if (!isBadgeUnlocked('the-archivist')) {
        if (checkSetCompletion('Alive') || checkSetCompletion('Dead') || checkSetCompletion('Paradox')) {
            unlockBadge('the-archivist', celebrateOptions);
        }
    }
    
    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      return { ...base, unlockedCats: newUnlockedCats };
    });

    if (storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { unlockedCats: newUnlockedCats });
    }

  }, [unlockedCats, unlockBadge, isBadgeUnlocked, user, setUserData, storageMode]);

  const isUnlocked = (catId: string) => {
    return unlockedCats.includes(catId);
  };

  return (
    <CatCollectionContext.Provider value={{ unlockedCats, unlockCat, isUnlocked }}>
      {children}
    </CatCollectionContext.Provider>
  );
};

export const useCatCollection = () => {
  const context = useContext(CatCollectionContext);
  if (context === undefined) {
    throw new Error('useCatCollection must be used within a CatCollectionProvider');
  }
  return context;
};
