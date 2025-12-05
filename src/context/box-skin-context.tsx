
'use client';

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData, type BoxSkinId } from '@/lib/user-data';
import boxSkinData from '@/lib/box-skin-data.json';
import { usePoints } from './points-context';
import { useToast } from '@/hooks/use-toast';

type SkinId = BoxSkinId;

interface BoxSkinContextType {
  selectedSkin: SkinId;
  selectSkin: (skin: SkinId) => void;
  unlockedSkins: SkinId[];
  unlockSkin: (skinId: SkinId) => boolean;
  getSkinCost: (skinId: SkinId) => number;
  isSkinUnlocked: (skinId: SkinId) => boolean;
}

const BoxSkinContext = createContext<BoxSkinContextType | undefined>(undefined);

const allSkinIds: SkinId[] = boxSkinData.skins.map(skin => skin.id);

const isSkinId = (skin: string | undefined): skin is SkinId =>
  typeof skin === 'string' && (allSkinIds as string[]).includes(skin);

const normalizeSkins = (skins?: string[]): SkinId[] => {
  const merged = new Set<SkinId>();
  // Always include free skins by default
  boxSkinData.skins.filter(s => s.cost === 0).forEach(s => merged.add(s.id));

  (skins ?? []).forEach(skin => {
    if (isSkinId(skin)) {
      merged.add(skin);
    }
  });
  return Array.from(merged);
};

export const BoxSkinProvider = ({ children }: { children: ReactNode }) => {
  const { user, userData, setUserData, storageMode } = useAuth();
  const { points, spendPoints } = usePoints();
  const { toast } = useToast();

  const unlockedSkins = useMemo(
    () => normalizeSkins(userData?.unlockedSkins),
    [userData],
  );

  const selectedSkin = useMemo(() => {
    const storedSkin = isSkinId(userData?.selectedSkin) ? userData?.selectedSkin : 'default';
    return unlockedSkins.includes(storedSkin) ? storedSkin : 'default';
  }, [userData, unlockedSkins]);

  const selectSkin = useCallback((skin: SkinId) => {
    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      return { ...base, selectedSkin: skin };
    });
    if (storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { selectedSkin: skin });
    }
  }, [user, setUserData, storageMode]);

  const getSkinCost = useCallback((skinId: SkinId) => {
    const skin = boxSkinData.skins.find(s => s.id === skinId);
    return skin?.cost ?? 0;
  }, []);

  const isSkinUnlocked = useCallback((skinId: SkinId) => {
    return unlockedSkins.includes(skinId);
  }, [unlockedSkins]);

  const unlockSkin = useCallback((skinId: SkinId): boolean => {
    if (isSkinUnlocked(skinId)) {
      toast({
        title: 'Skin already unlocked!',
        description: `You already own the ${skinId} box.`,
      });
      return true;
    }

    const cost = getSkinCost(skinId);

    if (points < cost) {
      toast({
        variant: 'destructive',
        title: 'Not enough Fish Points!',
        description: `You need ${cost} Fish Points to unlock this skin.`,
      });
      return false;
    }

    // Deduct points
    spendPoints(cost);

    // Add skin to unlocked list
    const newSkins = Array.from(new Set([...unlockedSkins, skinId]));

    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      return { ...base, unlockedSkins: newSkins };
    });

    if (storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { unlockedSkins: newSkins });
    }

    toast({
      title: 'Skin Unlocked!',
      description: `You have unlocked the ${skinId} box for ${cost} Fish Points.`,
    });
    return true;
  }, [unlockedSkins, isSkinUnlocked, getSkinCost, points, spendPoints, setUserData, storageMode, user, toast]);

  return (
    <BoxSkinContext.Provider value={{ selectedSkin, selectSkin, unlockedSkins, unlockSkin, getSkinCost, isSkinUnlocked }}>
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
