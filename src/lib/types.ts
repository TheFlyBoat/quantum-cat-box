
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
    secondaryCatId?: string;
    // revealedMessage is often handled separately, but tracking it here can be useful
    revealedMessage?: string;
    powerTriggered?: string;
}

export type BoxSkinPowerType =
  | 'baseline'
  | 'outcome_rate'
  | 'free_reroll'
  | 'state_multiplier'
  | 'flat_bonus'
  | 'state_bonus'
  | 'critical'
  | 'recharge_discount'
  | 'new_cat_bias'
  | 'temporal_distortion';

export interface BoxSkinPower {
  title: string;
  description: string;
  badgeText: string;
  type: BoxSkinPowerType;
  value?: number;
  bonusPoints?: number;
  multiplier?: number;
  targetOutcome?: 'alive' | 'dead' | 'paradox';
}

export interface BoxSkin {
  id: string;
  name: string;
  description: string;
  cost: number;
  power: BoxSkinPower;
  unlockCondition?: string;
}

// --- Badge/Achievement Types ---

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  secret?: boolean;
}

// --- User/Progress Types ---

export interface UserProgress {
  catsCollected: string[];
  badgesUnlocked: string[];
  diary: Record<string, string[]>;
  lastDailyBox?: string;
  points: number;
}

// --- UI/Component Types ---

export type CelebrationState = 'idle' | 'celebrating' | 'spotlight' | 'finished';
export type DialogTab = 'settings' | 'info';

export interface ShareAsset {
  file: File;
  dataUrl: string;
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
