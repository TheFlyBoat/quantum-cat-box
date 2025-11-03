
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CatOutcome } from '@/lib/types';

export interface RevealHistoryEntry {
  id: string;
  type: CatOutcome;
}

export interface UserSettings {
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  volume?: number;
  reduceMotion?: boolean;
}

export interface UserData {
  nickname?: string;
  lastObservationDate?: string;
  streak?: number;
  totalObservations?: number;
  unlockedBadges?: string[];
    selectedSkin?: 'default' | 'carbon' | 'cardboard' | 'black-wooden' | 'special-xk6' | 'stone';
    unlockedSkins?: ('default' | 'carbon' | 'cardboard' | 'black-wooden' | 'special-xk6' | 'stone')[];
  unlockedCats?: string[];
  diary?: { [catId: string]: { messages: string[]; count: number } };
  points?: number;
  revealHistory?: RevealHistoryEntry[];
  shareCount?: number;
  settings?: UserSettings;
}

export const defaultUserData: UserData = {
  nickname: undefined,
  lastObservationDate: undefined,
  streak: 0,
  totalObservations: 0,
  unlockedBadges: [],
      unlockedSkins: ['default', 'carbon'],  selectedSkin: 'default',
  unlockedCats: [],
  diary: {},
  points: 0,
  revealHistory: [],
  shareCount: 0,
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    volume: 0.5,
    reduceMotion: false,
  },
};

export async function saveUserData(userId: string, data: Partial<UserData>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

export async function resetUserData(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, defaultUserData);
  } catch (error) {
    console.error('Error resetting user data:', error);
  }
}

export async function loadUserData(userId: string): Promise<UserData> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // Merge fetched data with defaults to ensure all keys are present
      return { ...defaultUserData, ...docSnap.data() };
    } else {
      // No document for this user, create one with default data
      await saveUserData(userId, defaultUserData);
      return defaultUserData;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return defaultUserData; // Return default data on error
  }
}
