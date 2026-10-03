'use client';

import type { Analytics } from 'firebase/analytics';
import { app } from '@/lib/firebase';

type EventParams = Record<string, string | number | boolean | undefined>;

let analyticsPromise: Promise<Analytics | null> | null = null;

/** Lazily starts Firebase Analytics. Resolves to null when unsupported or not configured. */
const getAnalyticsInstance = () => {
  if (analyticsPromise) return analyticsPromise;
  analyticsPromise = (async () => {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
      return null;
    }
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    return (await isSupported()) ? getAnalytics(app) : null;
  })().catch(() => null);
  return analyticsPromise;
};

/** Records a product event. Never throws; a no-op until Analytics is configured. */
export function trackEvent(name: string, params: EventParams = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
  void getAnalyticsInstance().then(async analytics => {
    if (!analytics) return;
    const { logEvent } = await import('firebase/analytics');
    logEvent(analytics, name, cleanParams);
  });
}

/** Starts Analytics so page views are collected from the first screen. */
export function initAnalytics() {
  void getAnalyticsInstance();
}
