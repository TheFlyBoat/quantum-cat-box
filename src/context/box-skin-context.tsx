
'use client';

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';

type BoxSkin = 'default' | 'carbon' | 'cardboard' | 'black-wooden' | 'special-xk6' | 'stone';

interface BoxSkinContextType {
  selectedSkin: BoxSkin;
  selectSkin: (skin: BoxSkin) => void;
  unlockedSkins: BoxSkin[];
  unlockSkin: (skin: BoxSkin) => void;
}

const BoxSkinContext = createContext<BoxSkinContextType | undefined>(undefined);

const defaultSkins: BoxSkin[] = ['default', 'carbon', 'cardboard', 'black-wooden', 'special-xk6', 'stone'];
const allSkins: BoxSkin[] = ['default', 'carbon', 'cardboard', 'black-wooden', 'special-xk6', 'stone'];

const isBoxSkin = (skin: string | undefined): skin is BoxSkin =>
  typeof skin === 'string' && (allSkins as string[]).includes(skin);

const normalizeSkins = (skins?: string[]): BoxSkin[] => {
  const merged = new Set<BoxSkin>(defaultSkins);
  (skins ?? []).forEach(skin => {
    if (isBoxSkin(skin)) {
      merged.add(skin);
    }
  });
  return Array.from(merged);
};

export const BoxSkinProvider = ({ children }: { children: ReactNode }) => {
  const { user, userData, setUserData, storageMode } = useAuth();

  const unlockedSkins = useMemo(
    () => normalizeSkins(userData?.unlockedSkins),
    [userData],
  );

  const selectedSkin = useMemo(() => {
    const storedSkin = isBoxSkin(userData?.selectedSkin) ? userData?.selectedSkin : 'default';
    return unlockedSkins.includes(storedSkin) ? storedSkin : 'default';
  }, [userData, unlockedSkins]);

  const selectSkin = useCallback((skin: BoxSkin) => {
    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      return { ...base, selectedSkin: skin };
    });
    if (storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { selectedSkin: skin });
    }
  }, [user, setUserData, storageMode]);

  const unlockSkin = useCallback((skin: BoxSkin) => {
    if (unlockedSkins.includes(skin)) return;

    const newSkins = Array.from(new Set([...unlockedSkins, skin]));

    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      return { ...base, unlockedSkins: newSkins };
    });

    if (storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { unlockedSkins: newSkins });
    }
  }, [unlockedSkins, user, setUserData, storageMode]);

  return (
    <BoxSkinContext.Provider value={{ selectedSkin, selectSkin, unlockedSkins, unlockSkin }}>
      {children}
    </BoxSkinContext.Provider>
  );
};

export const useBoxSkin = () => {
  const context = useContext(BoxSkinContext);
  if (context === undefined) {
    throw new Error('useBoxSkin must be used within a BoxSkinProvider');
  }
  return context;
};
