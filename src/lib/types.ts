
import { type LucideIcon } from 'lucide-react';

// --- Cat Related Types ---

export type CatOutcome = 'initial' | 'alive' | 'dead' | 'paradox';

export interface CatData {
  id: string;
  name: string;
  description: string;
  type: 'Alive' | 'Dead' | 'Paradox';
  points: number;
  tagline: string;
  strength: string;
  weakness: string;
}

export interface CatState {
    outcome: CatOutcome;
    catId?: string;
    // revealedMessage is often handled separately, but tracking it here can be useful
    revealedMessage?: string;
}

// --- Badge/Achievement Types ---

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // The key used to look up the icon component
  condition: string;
  secret?: boolean;
}

// --- User/Progress Types ---

export interface UserProgress {
  catsCollected: string[]; // List of cat IDs
  badgesUnlocked: string[]; // List of badge IDs
  diary: Record<string, string[]>; // catId -> list of messages
  lastDailyBox?: string; // ISO Date string of last open
  points: number;
}

// --- UI/Component Types ---

export type CelebrationState = 'idle' | 'celebrating' | 'spotlight' | 'finished';
export type DialogTab = 'settings' | 'info';

export interface ShareAsset {
    file: File;
    dataUrl: string;
}

export interface BoxSkin {
    id: string;
    name: string;
    description: string;
    unlockCondition?: string;
}

// --- Context Types (Generic) ---

export interface AuthContextType {
    user: any | null; // Replace 'any' with Firebase User type if needed, but keeping generic for now is fine
    isLoading: boolean;
    isGuest: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
}
