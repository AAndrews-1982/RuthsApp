// app/more/add-missing-points.tsx
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRewards } from '../../src/context/RewardsContext';
import { router } from 'expo-router';

const placeholderImage = require('../../assets/images/placeholder.png');

// ----- Tier model (mirrors Rewards) -----
const TIERS = [
  { name: 'White', threshold: 300 },
  { name: 'Yellow', threshold: 800 },
  { name: 'Red', threshold: 2000 },
  { name: 'Lightning', threshold: Infinity }, // final tier
] as const;

type TierName = typeof TIERS[number]['name'];

function tierFromPoints(points: number): { tier: TierName; prev: number; next: number } {
  if (points < 300) return { tier: 'White', prev: 0, next: 300 };
  if (points < 800) return { tier: 'Yellow', prev: 300, next: 800 };
  if (points < 2000) return { tier: 'Red', prev: 800, next: 2000 };
  return { tier: 'Lightning', prev: 2000, next: Infinity };
}

// ----- Rewards catalog (show only those user qualifies for) -----
const REWARDS = [
  { points: 50,  title: 'Free Drink' },
  { points: 75,  title: 'Free Side' },
  { points: 100, title: 'Free Tender' },
  { points: 150, title: 'Free Slider' },
  { points: 200, title: 'Free Slider' },
  { points: 250, title: 'Free Tender' },
  { points: 300, title: 'Free Tender' },
  { points: 350, title: 'Free Slider' },
  { points: 400, title: 'Free Slider' },
  { points: 450, title: 'Free Tender' },
  { points: 500, title: 'Free Side' },
  { points: 550, title: 'Free Drink' },
  { points: 600, title: 'Free Tender' },
  { points: 650, title: 'Free Side' },
  { points: 700, title: 'Free Slider' },
  { points: 750, title: 'Free Slider' },
  { points: 800, title: 'Free Slider' },
  { points: 850, title: 'Free Side' },
  { points: 900, title: 'Free Slider' },
  { points: 950, title: 'Free Tender' },
  { points: 1000, title: 'Free Meal (Flights & Party Packs excluded)' },
];

const GRACE_DAYS = 30;

// ----- helpers for date / grace check -----
function parseYmd(input: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) return null;
  const y = +m[1], mo = +m[2] - 1, d = +m[3];
  const dt = new Date(Date.UTC(y, mo, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo || dt.getUTCDate() !== d) return null;
  return dt;
}
function daysBetweenUtc(a: Date, b: Date) {
  const MS = 86400000;
  const A = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const B = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((B - A) / MS);
}
function fmtYmdUTC(dt: Date) {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ----- small circular progress like Rewards -----
function PointsCircle({ points }: { points: number }) {
  const { prev, next, tier } = tierFromPoints(points);
  const atFinal = next === Infinity;

  const within = Math.max(0, points - prev);
  const needed = atFinal ? 1 : Math.max(1, next - prev);
  const pct = atFinal ? 1 : Math.min(1, within / needed);

  const size = 140;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <View style={styles.circleWrap}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#facc15"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash}, ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.circleCenter}>
        <Text style={styles.pointsBig}>{points}</Text>
        <Text style={styles.pointsSub}>pts</Text>
        <Text style={styles.tierText}>{tier} Tier</Text>
        {!atFinal ? (
          <Text style={styles.progressText}>
            {within}/{needed} to next
          </Text>
        ) : (
          <Text style={styles.progressText}>Top tier</Text>
        )}
      </View>
    </View>
  );
}

export default function AddMissingPointsScreen() {
  const { points, addSpend } = useRewards();

  // form state
  const [code, setCode] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const purchaseDate = useMemo(() => parseYmd(dateStr), [dateStr]);

  const expiryInfo = useMemo(() => {
    if (!purchaseDate) return null;
    const expires = new Date(purchaseDate.getTime());
    expires.setUTCDate(expires.getUTCDate() + GRACE_DAYS);
    const today = new Date();
    const daysUsed = daysBetweenUtc(purchaseDate, today);
    const isExpired = daysUsed >= GRACE_DAYS;
    const daysLeft = Math.max(0, GRACE_DAYS - daysUsed);
    return { expires, isExpired, daysLeft };
  }, [purchaseDate]);

  const availableRewards = useMemo(
    () => REWARDS.filter((r) => points >= r.points),
    [points]
  );

  const amount = Number(amountStr.replace(/[^0-9.]/g, ''));
  const codeValid = /^\d{6}$/.test(code);
  const amountValid = !Number.isNaN(amount) && amount > 0 && amount < 10000;
  const dateValid = !!purchaseDate;
  const canSubmit =
    codeValid && amountValid && dateValid && !expiryInfo?.isExpired && !submitting;

  const handleSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!canSubmit) {
      if (!codeValid) return setErrorMsg('Enter a valid 6-digit code.');
      if (!amountValid) return setErrorMsg('Enter a valid amount (e.g., 12.34).');
      if (!dateValid) return setErrorMsg('Enter the purchase date as YYYY-MM-DD.');
      if (expiryInfo?.isExpired) return setErrorMsg('Code expired (over 30 days).');
    }
    try {
      setSubmitting(true);

      /**
       * 🔒 Server-side (recommended):
       *   - Validate the 6-digit code against POS
       *   - Use the purchase date tied to the code (not user input)
       *   - Reject if > 30 days old or already used
       *   - Return authoritative amount, then addSpend(amountFromServer)
       */
      await addSpend(amount);

      setSuccessMsg(
        `Success! Points added for $${amount.toFixed(2)} from ${fmtYmdUTC(purchaseDate!)}.`
      );
      setCode('');
      setAmountStr('');
      setDateStr('');
    } catch (e) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Rewards-style header */}
          <Text style={styles.mainTitle}>Rewards</Text>
          <Image source={placeholderImage} style={styles.mainImage} resizeMode="cover" />

          {/* Points tracker (circular) */}
          <View style={styles.trackerCard}>
            <PointsCircle points={points} />
          </View>

          {/* Available rewards (same section title) */}
          <Text style={styles.otherTitle}>Your Available Rewards</Text>
          <View style={styles.cardContainer}>
            {availableRewards.length === 0 ? (
              <Text style={styles.muted}>Earn points to unlock rewards.</Text>
            ) : (
              availableRewards.map((r) => (
                <View key={r.points} style={styles.card}>
                  <Image source={placeholderImage} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{r.title}</Text>
                    <Text style={styles.cardDesc}>{r.points} points</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* ---- Add Missing Points (placed UNDER "Your Available Rewards") ---- */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add Missing Points</Text>

            <Field
              label="6-Digit Receipt Code"
              placeholder="123456"
              keyboardType="number-pad"
              value={code}
              onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
              helper={code.length > 0 && !codeValid ? 'Code must be 6 digits.' : ' '}
            />

            <Field
              label="Purchase Amount (USD)"
              placeholder="12.34"
              keyboardType="decimal-pad"
              value={amountStr}
              onChangeText={setAmountStr}
              helper={
                amountStr.length > 0 && !amountValid ? 'Enter a valid amount (e.g., 12.34).' : ' '
              }
            />

            <Field
              label="Receipt Date (YYYY-MM-DD)"
              placeholder="2025-08-01"
              keyboardType="numbers-and-punctuation"
              value={dateStr}
              onChangeText={(t) => setDateStr(t.trim())}
              helper={
                purchaseDate
                  ? `Expires on ${fmtYmdUTC(
                      new Date(purchaseDate.getTime() + GRACE_DAYS * 86400000)
                    )} (${expiryInfo?.daysLeft ?? 0} day${
                      (expiryInfo?.daysLeft ?? 0) === 1 ? '' : 's'
                    } left)`
                  : ' '
              }
            />

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerTitle}>30-Day Grace Period</Text>
              <Text style={styles.disclaimerText}>
                Codes are valid for {GRACE_DAYS} days from the purchase date and will
                automatically expire. Verification is based on the purchase date associated with
                the code, not the date you enter.
              </Text>
            </View>

            {/* messages */}
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

            <TouchableOpacity
              style={[styles.submitBtn, !canSubmit && { opacity: 0.5 }]}
              disabled={!canSubmit}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.submitText}>{submitting ? 'Submitting…' : 'Add Points'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/more/index')}>
              <Text style={styles.backText}>← Back to More</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* Reusable field */
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  helper,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'number-pad'
    | 'decimal-pad'
    | 'email-address'
    | 'phone-pad'
    | 'numbers-and-punctuation';
  helper?: string;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        keyboardType={keyboardType}
      />
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 32 },

  // Rewards header
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
  },

  // Points circle card
  trackerCard: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  circleWrap: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center' },
  circleCenter: { position: 'absolute', alignItems: 'center' },
  pointsBig: { fontSize: 22, fontWeight: '900', color: '#111827' },
  pointsSub: { fontSize: 12, color: '#6b7280' },
  tierText: { fontSize: 12, color: '#111827', marginTop: 2, fontWeight: '700' },
  progressText: { fontSize: 12, color: '#6b7280' },

  // Available rewards (copied style)
  otherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 6,
  },
  cardContainer: { width: '100%', gap: 12, marginBottom: 8 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  cardImage: { width: 100, height: 100, backgroundColor: '#e5e7eb' },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#111827' },
  cardDesc: { fontSize: 14, color: '#4b5563' },
  muted: { color: '#6b7280', marginBottom: 8 },

  // Form section under rewards
  formCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginTop: 6,
  },
  formTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },

  inputLabel: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  helper: { marginTop: 6, fontSize: 12, color: '#6b7280' },

  disclaimer: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
  },
  disclaimerTitle: { fontSize: 13, fontWeight: '800', color: '#111827', marginBottom: 4 },
  disclaimerText: { fontSize: 12, color: '#4b5563', lineHeight: 18 },

  error: { marginTop: 8, color: '#b91c1c', fontWeight: '700' },
  success: { marginTop: 8, color: '#065f46', fontWeight: '700' },

  submitBtn: {
    marginTop: 14,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  backLink: { marginTop: 12, alignItems: 'center' },
  backText: { color: '#2563eb', fontWeight: '700' },
});
