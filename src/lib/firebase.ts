
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  type AppCheck,
} from 'firebase/app-check';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyPlaceholderKeyForBuildSafetyOnly',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'thequantumcatbox.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'thequantumcatbox',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'thequantumcatbox.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '258085757068',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:258085757068:web:7e88b7cfd3e4bf73261ba9',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

let appCheckInstance: AppCheck | null = null;

/**
 * Safely initializes Firebase App Check with comprehensive development guardrails.
 *
 * Guardrails enforced:
 * 1. Server guard: Returns null in Node.js (when window or document is undefined),
 *    preventing fatal document reference errors during Next.js Server Actions and SSR.
 * 2. Caching: Returns cached singleton instance across HMR Fast Refresh cycles to prevent
 *    'appCheck/already-initialized' errors.
 * 3. Development debug token: In development mode, sets self.FIREBASE_APPCHECK_DEBUG_TOKEN.
 * 4. Graceful site key handling: If NEXT_PUBLIC_RECAPTCHA_SITE_KEY is absent, returns null
 *    with an informational log in development.
 * 5. Exception shield: Wraps initializeAppCheck in try/catch to ensure errors return null
 *    instead of triggering unhandled promise rejections.
 */
function initAppCheck(): AppCheck | null {
  // 1. Server guard: Never execute in Node.js / SSR / Server Action environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  // 2. Return cached instance if already initialized (HMR Fast Refresh safe)
  if (appCheckInstance) {
    return appCheckInstance;
  }

  // Allow explicit developer opt-out
  if (process.env.NEXT_PUBLIC_APPCHECK_DISABLED === 'true') {
    return null;
  }

  const isDev = process.env.NODE_ENV === 'development';
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // 3. Development debug token handling
  if (isDev) {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
      process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN || true;
  }

  // 4. Verify site key: If absent, gracefully skip/return null with an informational log in development
  if (!siteKey) {
    if (isDev) {
      console.info('[Firebase App Check]: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined. Skipping App Check in development.');
    }
    return null;
  }

  // 5. Wrap in try/catch to prevent unhandled promise rejections or runtime crashes
  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    return appCheckInstance;
  } catch (error) {
    console.warn('[Firebase App Check]: Initialization failed, continuing without App Check:', error);
    return null;
  }
}

// Automatically trigger client-side initialization when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => initAppCheck(), { once: true });
  } else {
    initAppCheck();
  }
}

export { app, auth, db, initAppCheck };
export type { AppCheck };

