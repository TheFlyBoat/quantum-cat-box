'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  useRef,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  defaultUserData,
  loadUserData,
  resetUserData,
  saveUserData,
  UserData,
} from '@/lib/user-data';
import { useRouter } from 'next/navigation';

type UserType = User | 'guest' | null;
type StorageMode = 'local' | 'cloud';
export type LoginPromptReason = 'box-opens' | 'points' | 'customize' | 'gallery';

interface AuthContextType {
  user: UserType | undefined;
  loading: boolean;
  displayName: string | null;
  storageMode: StorageMode;
  tempUserId: string;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  reset: () => void;
  loginPromptOpen: boolean;
  loginPromptReason: LoginPromptReason | null;
  loginModalOpen: boolean;
  loginSuccess: boolean;
  localProgressMessageSeen: boolean;
  maybeShowLoginPrompt: (reason: LoginPromptReason) => void;
  dismissLoginPrompt: () => void;
  openLoginModal: (reason?: LoginPromptReason) => void;
  closeLoginModal: () => void;
  acknowledgeLoginSuccess: () => void;
  markLocalMessageSeen: () => void;
}

const LOCAL_PROGRESS_KEY = 'quantum-cat-progress-v1';
const TEMP_USER_ID_KEY = 'quantum-cat-temp-user-id';
const LOCAL_MESSAGE_KEY = 'quantum-cat-local-msg';
const LOGIN_DISMISS_KEY = 'quantum-cat-login-dismissed';
const AUTH_STATE_KEY = 'quantum-cat-auth-state';

const isBrowser = () => typeof window !== 'undefined';

const generateTempId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const getLocalUserData = (): UserData => {
  if (!isBrowser()) {
    return { ...defaultUserData };
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) {
      return { ...defaultUserData };
    }
    const parsed = JSON.parse(raw);
    return { ...defaultUserData, ...parsed };
  } catch (error) {
    console.error('Failed to parse local user data', error);
    return { ...defaultUserData };
  }
};

const setLocalUserData = (data: UserData) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to persist local user data', error);
  }
};

const clearLocalUserData = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(LOCAL_PROGRESS_KEY);
  } catch (error) {
    console.error('Failed to clear local user data', error);
  }
};

const getTempUserId = (): string => {
  if (!isBrowser()) return 'local-only';
  const stored = window.localStorage.getItem(TEMP_USER_ID_KEY);
  if (stored) return stored;
  const fresh = generateTempId();
  try {
    window.localStorage.setItem(TEMP_USER_ID_KEY, fresh);
  } catch (error) {
    console.error('Failed to store temp user id', error);
  }
  return fresh;
};

const getLocalMessageSeen = (): boolean => {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(LOCAL_MESSAGE_KEY) === 'seen';
};

const persistLocalMessageSeen = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(LOCAL_MESSAGE_KEY, 'seen');
  } catch (error) {
    console.error('Failed to persist local progress message flag', error);
  }
};

const getTodayStamp = () => new Date().toDateString();

const getPromptDismissed = (): boolean => {
  if (!isBrowser()) return false;
  try {
    const stored = window.localStorage.getItem(LOGIN_DISMISS_KEY);
    if (!stored) {
      return false;
    }
    const today = getTodayStamp();
    if (stored !== today) {
      window.localStorage.removeItem(LOGIN_DISMISS_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const persistPromptDismissed = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(LOGIN_DISMISS_KEY, getTodayStamp());
  } catch {
    // ignore
  }
};

const clearPromptDismissed = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(LOGIN_DISMISS_KEY);
  } catch {
    // ignore
  }
};

const unionUnique = <T,>(a: T[] = [], b: T[] = []) => Array.from(new Set([...a, ...b]));

const mergeDiaryData = (
  cloud?: UserData['diary'],
  local?: UserData['diary'],
): NonNullable<UserData['diary']> => {
  const result: NonNullable<UserData['diary']> = {};
  const ids = new Set<string>([
    ...Object.keys(cloud ?? {}),
    ...Object.keys(local ?? {}),
  ]);

  ids.forEach((id) => {
    const cloudEntry = cloud?.[id];
    const localEntry = local?.[id];
    const messages = unionUnique(cloudEntry?.messages ?? [], localEntry?.messages ?? []);
    const count = Math.max(cloudEntry?.count ?? 0, localEntry?.count ?? 0);
    result[id] = { messages, count };
  });

  return result;
};

const hasMeaningfulProgress = (data: UserData) => {
  if (!data) return false;
  const cats = data.unlockedCats?.length ?? 0;
  const badges = data.unlockedBadges?.length ?? 0;
  const points = data.points ?? 0;
  const diaryEntries = Object.keys(data.diary ?? {}).length;
  const observations = data.totalObservations ?? 0;
  const shareCount = data.shareCount ?? 0;
  return cats > 0 || badges > 0 || points > 0 || diaryEntries > 0 || observations > 0 || shareCount > 0;
};

const mergeUserRecords = (cloud: UserData, local: UserData): UserData => {
  const unlockedCats = unionUnique(cloud.unlockedCats ?? [], local.unlockedCats ?? []);
  const unlockedBadges = unionUnique(cloud.unlockedBadges ?? [], local.unlockedBadges ?? []);
  const unlockedSkins = unionUnique(
    cloud.unlockedSkins ?? defaultUserData.unlockedSkins ?? [],
    local.unlockedSkins ?? defaultUserData.unlockedSkins ?? [],
  );
  const points = Math.max(cloud.points ?? 0, local.points ?? 0);
  const totalObservations = Math.max(cloud.totalObservations ?? 0, local.totalObservations ?? 0);
  const streak = Math.max(cloud.streak ?? 0, local.streak ?? 0);
  const shareCount = Math.max(cloud.shareCount ?? 0, local.shareCount ?? 0);
  const lastObservationDate = cloud.lastObservationDate ?? local.lastObservationDate;
  const lastBoxOpenDate = cloud.lastBoxOpenDate ?? local.lastBoxOpenDate;
  const revealHistory = (local.revealHistory?.length ?? 0) > (cloud.revealHistory?.length ?? 0)
    ? local.revealHistory
    : cloud.revealHistory;

  let selectedSkin = cloud.selectedSkin ?? local.selectedSkin ?? defaultUserData.selectedSkin;
  if (local.selectedSkin && unlockedSkins.includes(local.selectedSkin)) {
    selectedSkin = local.selectedSkin;
  } else if (selectedSkin && !unlockedSkins.includes(selectedSkin)) {
    selectedSkin = 'default';
  }

  const defaultSettings = defaultUserData.settings ?? {
    soundEnabled: true,
    vibrationEnabled: true,
    volume: 0.5,
    reduceMotion: false,
  };

  const mergedSettings = {
    soundEnabled: local.settings?.soundEnabled ?? cloud.settings?.soundEnabled ?? defaultSettings.soundEnabled,
    vibrationEnabled: local.settings?.vibrationEnabled ?? cloud.settings?.vibrationEnabled ?? defaultSettings.vibrationEnabled,
    volume: local.settings?.volume ?? cloud.settings?.volume ?? defaultSettings.volume,
    reduceMotion: local.settings?.reduceMotion ?? cloud.settings?.reduceMotion ?? defaultSettings.reduceMotion,
  };

  return {
    ...cloud,
    nickname: cloud.nickname ?? local.nickname,
    unlockedCats,
    unlockedBadges,
    unlockedSkins,
    selectedSkin,
    points,
    totalObservations,
    streak,
    shareCount,
    lastObservationDate,
    lastBoxOpenDate,
    diary: mergeDiaryData(cloud.diary, local.diary),
    revealHistory,
    settings: mergedSettings,
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<StorageMode>('local');
  const [userDataState, setUserDataState] = useState<UserData | null>(null);
  const [tempUserId] = useState<string>(() => getTempUserId());
  const [loginPromptState, setLoginPromptState] = useState<{ open: boolean; reason: LoginPromptReason | null }>({
    open: false,
    reason: null,
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [localProgressMessageSeen, setLocalProgressMessageSeen] = useState<boolean>(() => getLocalMessageSeen());
  const [loginPromptDismissed, setLoginPromptDismissed] = useState<boolean>(() => getPromptDismissed());
  const storageModeRef = useRef<StorageMode>('local');

  useEffect(() => {
    if (storageMode === storageModeRef.current) {
      return;
    }

    const updateSuccessFlag = (value: boolean) => {
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(() => setLoginSuccess(value));
      } else {
        setTimeout(() => setLoginSuccess(value), 0);
      }
    };

    if (storageMode === 'cloud') {
      updateSuccessFlag(true);
    } else if (storageModeRef.current === 'cloud') {
      updateSuccessFlag(false);
    }

    storageModeRef.current = storageMode;
  }, [storageMode]);

  const maybeOpenLoginPrompt = useCallback((reason: LoginPromptReason) => {
    if (storageMode === 'cloud' || user !== 'guest') return;
    if (loginPromptDismissed) return;

    let opened = false;
    setLoginPromptState((prev) => {
      if (prev.open) return prev;
      opened = true;
      return { open: true, reason };
    });

    if (opened) {
      setLoginPromptDismissed(true);
      persistPromptDismissed();
    }
  }, [storageMode, loginPromptDismissed, user]);

  const maybeShowLoginPrompt = useCallback((reason: LoginPromptReason) => {
    maybeOpenLoginPrompt(reason);
  }, [maybeOpenLoginPrompt]);

  const dismissLoginPrompt = useCallback(() => {
    setLoginPromptState({ open: false, reason: null });
    setLoginPromptDismissed(true);
    persistPromptDismissed();
  }, []);

  const openLoginModal = useCallback((reason?: LoginPromptReason) => {
    setLoginPromptState({ open: false, reason: reason ?? null });
    setLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setLoginModalOpen(false);
  }, []);

  const acknowledgeLoginSuccess = useCallback(() => {
    setLoginSuccess(false);
  }, []);

  const markLocalMessageSeen = useCallback(() => {
    if (!localProgressMessageSeen) {
      setLocalProgressMessageSeen(true);
      persistLocalMessageSeen();
    }
  }, [localProgressMessageSeen]);

  const updateUserData = useCallback<React.Dispatch<React.SetStateAction<UserData | null>>>((value) => {
    setUserDataState((prev) => {
      const next = typeof value === 'function'
        ? (value as (prevState: UserData | null) => UserData | null)(prev)
        : value;

      console.log('updateUserData', next);

      if (!next) {
        if (storageMode === 'local') {
          clearLocalUserData();
        }
        return next;
      }

      if (storageMode === 'local') {
        setLocalUserData(next);
        const totalObservations = next.totalObservations ?? 0;
        const pointsValue = next.points ?? 0;

        if (totalObservations >= 3) {
          maybeOpenLoginPrompt('box-opens');
        }
        if (pointsValue >= 10) {
          maybeOpenLoginPrompt('points');
        }
      }

      return next;
    });
  }, [storageMode, maybeOpenLoginPrompt]);

  const handleUserLogin = async (firebaseUser: User) => {
    setLoading(true);
    try {
      sessionStorage.setItem(AUTH_STATE_KEY, 'logged-in');
    } catch {
      // ignore
    }

    const localData = getLocalUserData();
    let mergedData: UserData;

    try {
      const remoteData = await loadUserData(firebaseUser.uid);
      mergedData = hasMeaningfulProgress(localData)
        ? mergeUserRecords(remoteData, localData)
        : remoteData;

      if (hasMeaningfulProgress(localData)) {
        await saveUserData(firebaseUser.uid, mergedData);
      }
    } catch (error) {
      console.error('Failed to load user data', error);
      mergedData = hasMeaningfulProgress(localData)
        ? mergeUserRecords({ ...defaultUserData }, localData)
        : { ...defaultUserData };
    }

    setUser(firebaseUser);
    setDisplayName(firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : null));
    setStorageMode('cloud');
    setLoginPromptState({ open: false, reason: null });
    setLoginPromptDismissed(false);
    clearPromptDismissed();
    setUserDataState(mergedData);
    setLoginModalOpen(false);
    clearLocalUserData();
    setLoading(false);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    try {
      sessionStorage.setItem(AUTH_STATE_KEY, 'guest');
    } catch {
      // ignore
    }

    const localData = getLocalUserData();
    setUser('guest');
    setDisplayName(null);
    setStorageMode('local');
    setUserDataState(localData);
    setLoginModalOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        handleUserLogin(firebaseUser);
      } else {
        handleGuestLogin();
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    await signInWithPopup(auth, provider);
  }, []);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    try {
      sessionStorage.setItem(AUTH_STATE_KEY, 'guest');
    } catch {
      // ignore
    }
    setLoginPromptState({ open: false, reason: null });
    setLoginPromptDismissed(false);
    clearPromptDismissed();
    setStorageMode('local');
    setUser('guest');
    setDisplayName(null);
    const localData = getLocalUserData();
    setUserDataState(localData);
    router.push('/home');
  }, [router]);

  const continueAsGuest = useCallback(() => {
    setUser('guest');
    setDisplayName(null);
    setStorageMode('local');
    const localData = getLocalUserData();
    setUserDataState(localData);
    try {
      sessionStorage.setItem(AUTH_STATE_KEY, 'guest');
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      if (user && user !== 'guest') {
        await resetUserData(user.uid);
      }
    } catch (error) {
      console.error('Could not reset user data', error);
    }

    try {
      if (isBrowser()) {
        Object.keys(window.localStorage)
          .filter((key) => key.startsWith('quantum-cat-'))
          .forEach((key) => window.localStorage.removeItem(key));
        Object.keys(window.sessionStorage)
          .filter((key) => key.startsWith('quantum-cat-'))
          .forEach((key) => window.sessionStorage.removeItem(key));
      }
    } catch (error) {
      console.error('Failed to clear storage during reset', error);
    }

    setLocalUserData({ ...defaultUserData });
    setUserDataState({ ...defaultUserData });
    setLocalProgressMessageSeen(false);
    setLoginPromptDismissed(false);
    setLoginPromptState({ open: false, reason: null });
    await logout();
  }, [logout, user]);

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    loading,
    displayName,
    storageMode,
    tempUserId,
    userData: userDataState,
    setUserData: updateUserData,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    continueAsGuest,
    reset,
    loginPromptOpen: loginPromptState.open,
    loginPromptReason: loginPromptState.reason,
    loginModalOpen,
    loginSuccess,
    localProgressMessageSeen,
    maybeShowLoginPrompt,
    dismissLoginPrompt,
    openLoginModal,
    closeLoginModal,
    acknowledgeLoginSuccess,
    markLocalMessageSeen,
  }), [
    user,
    loading,
    displayName,
    storageMode,
    tempUserId,
    userDataState,
    updateUserData,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    continueAsGuest,
    reset,
    loginPromptState.open,
    loginPromptState.reason,
    loginModalOpen,
    loginSuccess,
    localProgressMessageSeen,
    maybeShowLoginPrompt,
    dismissLoginPrompt,
    openLoginModal,
    closeLoginModal,
    acknowledgeLoginSuccess,
    markLocalMessageSeen,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
