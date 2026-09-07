
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CatOutcome } from '@/lib/types';
import boxSkinData from '@/lib/box-skin-data.json';

export type BoxSkinId = (typeof boxSkinData.skins)[number]['id'];

const starterSkins = boxSkinData.skins
  .filter(skin => skin.cost === 0)
  .map(skin => skin.id as BoxSkinId);

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
  lastBoxOpenDate?: string;
  streak?: number;
  totalObservations?: number;
  unlockedBadges?: string[];
  selectedSkin?: BoxSkinId;
  unlockedSkins?: BoxSkinId[];
  unlockedCats?: string[];
  diary?: { [catId: string]: { messages: string[]; count: number } };
  points?: number;
  revealHistory?: RevealHistoryEntry[];
  shareCount?: number;
  settings?: UserSettings;
}

export const defaultUserData: UserData = {
  streak: 0,
  totalObservations: 0,
  unlockedBadges: [],
  unlockedSkins: starterSkins,
  selectedSkin: 'default',
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

/**
 * Recursively removes undefined fields from an object so Firestore setDoc / updateDoc
 * never throws "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean as T;
}

export async function saveUserData(userId: string, data: Partial<UserData>): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  const cleanData = sanitizeForFirestore(data);
  await setDoc(userDocRef, cleanData, { merge: true });
}

export async function resetUserData(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const cleanData = sanitizeForFirestore(defaultUserData);
    await setDoc(userDocRef, cleanData);
  } catch (error) {
    console.error('Error resetting user data:', error);
  }
}

export async function loadUserData(userId: string): Promise<UserData> {
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
}
