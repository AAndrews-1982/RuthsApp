import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** ------------------------------
 *  TIERS & RULES
 *  ------------------------------ */
export type TierKey = 'WHITE' | 'YELLOW' | 'RED' | 'LIGHTNING';

type Tier = {
  key: TierKey;
  label: string;
  earnRate: number;         // points per $1 (not shown to customers, used for math only)
  nextAt?: number;          // points needed to promote from this tier (no next for Lightning)
  blurb?: string;
};

export const TIERS: Record<TierKey, Tier> = {
  WHITE:      { key: 'WHITE',      label: 'White',      earnRate: 1, nextAt: 300,  blurb: 'Welcome tier. Start earning perks!' },
  YELLOW:     { key: 'YELLOW',     label: 'Yellow',     earnRate: 3, nextAt: 800,  blurb: 'Accelerated earning for regulars.' },
  RED:        { key: 'RED',        label: 'Red',        earnRate: 4, nextAt: 2000, blurb: 'Premium status with bigger perks.' },
  LIGHTNING:  { key: 'LIGHTNING',  label: 'Lightning',  earnRate: 5,               blurb: 'Top tier. Exclusive offers & drops.' },
};

/** Points milestones (one-time per year). We DO NOT deduct points; once unlocked,
 *  a milestone can be redeemed once per anniversary cycle.
 */
export const MILESTONES: Record<number, { title: string }> = {
  50:   { title: 'Free drink' },
  75:   { title: 'Free side' },
  100:  { title: 'Free tender' },
  150:  { title: 'Free slider' },
  200:  { title: 'Free slider' },
  250:  { title: 'Free tender' },
  300:  { title: 'Free tender' },
  350:  { title: 'Free slider' },
  400:  { title: 'Free slider' },
  450:  { title: 'Free tender' },
  500:  { title: 'Free side' },
  550:  { title: 'Free drink' },
  600:  { title: 'Free tender' },
  650:  { title: 'Free side' },
  700:  { title: 'Free slider' },
  750:  { title: 'Free slider' },
  800:  { title: 'Free slider' },
  850:  { title: 'Free side' },
  900:  { title: 'Free slider' },
  950:  { title: 'Free tender' },
  1000: { title: 'Free meal (Slider Flight, Tender Flight, and Party Packs excluded)' },
};

/** ------------------------------
 *  STORAGE KEYS
 *  ------------------------------ */
const STORAGE = {
  // points earned in the current anniversary cycle
  points: 'rewards.points',
  // highest tier achieved (persists across years)
  tier: 'rewards.tier',
  // object: { "50": true, "75": false, ... } for the CURRENT cycle
  redemptions: 'rewards.redemptions',
  // ISO date string for the start of the CURRENT anniversary cycle
  anniversaryStart: 'rewards.anniversaryStart',
};

/** ------------------------------
 *  TYPES
 *  ------------------------------ */
type Redemptions = Record<string, boolean>;

type RewardsContextValue = {
  loading: boolean;
  points: number;                 // points in the current anniversary year
  tier: TierKey;                  // highest tier achieved (status is retained year-to-year)
  tierInfo: Tier;
  nextTierAt?: number;            // points needed to move from current tier to the next (undefined for Lightning)
  nextTierRemaining?: number;     // how many points remaining to reach next tier
  anniversaryStart: Date;         // start date for the current anniversary cycle
  addSpend: (amountUSD: number) => Promise<void>;  // add points via spend, using current tier earn rate
  redeemMilestone: (pointsRequired: number) => Promise<void>;
  redemptions: Redemptions;       // which milestones have been redeemed in the CURRENT cycle
  resetCycleDev?: () => Promise<void>;            // dev helper to test resets
};

/** ------------------------------
 *  HELPERS
 *  ------------------------------ */
const parseDate = (v?: string | null) => (v ? new Date(v) : undefined);
const formatISO = (d: Date) => d.toISOString();

const addYears = (date: Date, years: number) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/** Roll the anniversary cycle forward if needed (handle multiple years of inactivity). */
const ensureCurrentCycle = async (): Promise<{ anniversaryStart: Date; bumped: boolean }> => {
  const stored = await AsyncStorage.getItem(STORAGE.anniversaryStart);
  const now = new Date();

  if (!stored) {
    // First run: start cycle now
    await AsyncStorage.setItem(STORAGE.anniversaryStart, formatISO(now));
    return { anniversaryStart: now, bumped: false };
  }

  let start = parseDate(stored)!;
  // If now >= start + 1yr, roll forward & clear points/redemptions
  let bumped = false;
  while (now >= addYears(start, 1)) {
    start = addYears(start, 1);
    bumped = true;
  }
  if (bumped) {
    await AsyncStorage.multiSet([
      [STORAGE.anniversaryStart, formatISO(start)],
      [STORAGE.points, '0'],
      [STORAGE.redemptions, JSON.stringify({})],
    ]);
  }
  return { anniversaryStart: start, bumped };
};

/** Promotion check: given current tier & points, compute updated tier. */
const computeTierFromPoints = (currentTier: TierKey, points: number): TierKey => {
  let tier: TierKey = currentTier;
  // Promote step-by-step so large additions still climb properly
  while (true) {
    const info = TIERS[tier];
    if (!info.nextAt) break; // Lightning has no next
    if (points >= info.nextAt) {
      // Promote to next in sequence
      if (tier === 'WHITE') tier = 'YELLOW';
      else if (tier === 'YELLOW') tier = 'RED';
      else if (tier === 'RED') tier = 'LIGHTNING';
      else break;
    } else {
      break;
    }
  }
  return tier;
};

/** ------------------------------
 *  CONTEXT
 *  ------------------------------ */
const RewardsContext = createContext<RewardsContextValue | undefined>(undefined);

export const RewardsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState<TierKey>('WHITE');
  const [redemptions, setRedemptions] = useState<Redemptions>({});
  const [anniversaryStart, setAnniversaryStart] = useState<Date>(new Date());

  // Load & normalize cycle on boot
  useEffect(() => {
    (async () => {
      const { anniversaryStart: start } = await ensureCurrentCycle();
      setAnniversaryStart(start);

      const [pointsStr, tierStr, redemptionsStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE.points),
        AsyncStorage.getItem(STORAGE.tier),
        AsyncStorage.getItem(STORAGE.redemptions),
      ]);

      setPoints(pointsStr ? parseInt(pointsStr, 10) : 0);
      setTier((tierStr as TierKey) || 'WHITE');
      setRedemptions(redemptionsStr ? JSON.parse(redemptionsStr) : {});
      setLoading(false);
    })();
  }, []);

  const tierInfo = TIERS[tier];

  const nextTierAt = tierInfo.nextAt;
  const nextTierRemaining = nextTierAt !== undefined ? Math.max(0, nextTierAt - points) : undefined;

  const persistPoints = async (value: number) => {
    setPoints(value);
    await AsyncStorage.setItem(STORAGE.points, String(value));
  };

  const persistTier = async (value: TierKey) => {
    setTier(value);
    await AsyncStorage.setItem(STORAGE.tier, value);
  };

  const persistRedemptions = async (value: Redemptions) => {
    setRedemptions(value);
    await AsyncStorage.setItem(STORAGE.redemptions, JSON.stringify(value));
  };

  const addSpend = async (amountUSD: number) => {
    if (!Number.isFinite(amountUSD) || amountUSD <= 0) return;

    // Make sure we’re in the current cycle (handles annual reset automatically)
    const { anniversaryStart: start } = await ensureCurrentCycle();
    setAnniversaryStart(start);

    // Earn points using current tier earnRate (not shown to users)
    const earned = Math.floor(amountUSD * tierInfo.earnRate);
    const nextPoints = points + earned;

    // Promotions use current-year points; tier is STICKY (highest achieved)
    const maybeNewTier = computeTierFromPoints(tier, nextPoints);

    await persistPoints(nextPoints);
    if (maybeNewTier !== tier) {
      await persistTier(maybeNewTier);
    }
  };

  const redeemMilestone = async (pointsRequired: number) => {
    const key = String(pointsRequired);
    if (!MILESTONES[pointsRequired]) return;
    if (redemptions[key]) return; // already redeemed this cycle
    if (points < pointsRequired) return; // not yet eligible

    const updated = { ...redemptions, [key]: true };
    await persistRedemptions(updated);
  };

  const resetCycleDev = async () => {
    const now = new Date();
    await AsyncStorage.multiSet([
      [STORAGE.anniversaryStart, formatISO(now)],
      [STORAGE.points, '0'],
      [STORAGE.redemptions, JSON.stringify({})],
    ]);
    setAnniversaryStart(now);
    setPoints(0);
    setRedemptions({});
    // Tier is intentionally NOT reset (status is retained)
  };

  const value: RewardsContextValue = {
    loading,
    points,
    tier,
    tierInfo,
    nextTierAt,
    nextTierRemaining,
    anniversaryStart,
    addSpend,
    redeemMilestone,
    redemptions,
    resetCycleDev,
  };

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
};

export const useRewards = () => {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards must be used within RewardsProvider');
  return ctx;
};
