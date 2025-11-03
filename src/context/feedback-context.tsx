'use client';

import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useAuth } from './auth-context';
import { defaultUserData, saveUserData } from '@/lib/user-data';

interface FeedbackContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
    const { user, userData, setUserData, storageMode } = useAuth();

    const settings = useMemo(() => {
        const fallback = defaultUserData.settings ?? {
            soundEnabled: true,
            vibrationEnabled: true,
            volume: 0.5,
            reduceMotion: false,
        };
        return {
            soundEnabled: userData?.settings?.soundEnabled ?? fallback.soundEnabled ?? true,
            vibrationEnabled: userData?.settings?.vibrationEnabled ?? fallback.vibrationEnabled ?? true,
            volume: userData?.settings?.volume ?? fallback.volume ?? 0.5,
            reduceMotion: userData?.settings?.reduceMotion ?? fallback.reduceMotion ?? false,
        };
    }, [userData]);

    const setSoundEnabled = useCallback((enabled: boolean) => {
        setUserData(prev => {
            const next = prev ?? { ...defaultUserData };
            return {
                ...next,
                settings: {
                    ...next.settings,
                    soundEnabled: enabled,
                },
            };
        });
        if (storageMode === 'cloud' && user && user !== 'guest') {
            saveUserData(user.uid, { settings: { soundEnabled: enabled } });
        }
    }, [setUserData, storageMode, user]);

    const setVibrationEnabled = useCallback((enabled: boolean) => {
        setUserData(prev => {
            const next = prev ?? { ...defaultUserData };
            return {
                ...next,
                settings: {
                    ...next.settings,
                    vibrationEnabled: enabled,
                },
            };
        });
        if (storageMode === 'cloud' && user && user !== 'guest') {
            saveUserData(user.uid, { settings: { vibrationEnabled: enabled } });
        }
    }, [setUserData, storageMode, user]);

    const setVolume = useCallback((volume: number) => {
        setUserData(prev => {
            const next = prev ?? { ...defaultUserData };
            return {
                ...next,
                settings: {
                    ...next.settings,
                    volume,
                },
            };
        });
        if (storageMode === 'cloud' && user && user !== 'guest') {
            saveUserData(user.uid, { settings: { volume } });
        }
    }, [setUserData, storageMode, user]);

    const setReduceMotion = useCallback((enabled: boolean) => {
        setUserData(prev => {
            const next = prev ?? { ...defaultUserData };
            return {
                ...next,
                settings: {
                    ...next.settings,
                    reduceMotion: enabled,
                },
            };
        });
        if (storageMode === 'cloud' && user && user !== 'guest') {
            saveUserData(user.uid, { settings: { reduceMotion: enabled } });
        }
    }, [setUserData, storageMode, user]);

    return (
        <FeedbackContext.Provider
            value={{
                soundEnabled: settings.soundEnabled,
                setSoundEnabled,
                vibrationEnabled: settings.vibrationEnabled,
                setVibrationEnabled,
                volume: settings.volume,
                setVolume,
                reduceMotion: settings.reduceMotion,
                setReduceMotion,
            }}
        >
            {children}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (context === undefined) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};
