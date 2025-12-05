
'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';

interface PointsContextType {
  points: number;
  addPoints: (amount: number, options?: { celebrateImmediately?: boolean }) => void;
  spendPoints: (amount: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const { user, userData, setUserData, storageMode } = useAuth();
  const points = userData?.points ?? 0;

  const addPoints = useCallback((amount: number, _options?: { celebrateImmediately?: boolean }) => {
    const newPoints = points + amount;
    setUserData(prevData => {
      const base = prevData ?? defaultUserData;
      return { ...base, points: newPoints };
    });

    if (storageMode === 'cloud' && user && user !== 'guest') {
      void saveUserData(user.uid, { points: newPoints });
    }
  }, [points, setUserData, storageMode, user]);

  const spendPoints = useCallback((amount: number) => {
    addPoints(-amount);
  }, [addPoints]);

  return (
    <PointsContext.Provider value={{ points, addPoints, spendPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
