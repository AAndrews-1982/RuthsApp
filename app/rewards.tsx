import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRewards, MILESTONES, TIERS } from './context/RewardsContext';

const placeholder = require('../assets/images/placeholder.png');

/** Minimal circular progress component */
function CircleProgress({
  size = 160,
  strokeWidth = 12,
  progress = 0, // 0..1
  trackColor = '#e5e7eb',
  fillColor = '#111827',
  children,
}: {
  size?: number;
  strokeWidth?: number;
  progress?: number;
  trackColor?: string;
  fillColor?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={trackColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={fillColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          // Start at 12 o'clock
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* Center content */}
      <View style={styles.ringCenter}>{children}</View>
    </View>
  );
}

export default function RewardsScreen() {
  const {
    loading,
    points,
    tier,
    tierInfo,
    nextTierAt,
    nextTierRemaining,
    anniversaryStart,
    redemptions,
    redeemMilestone,
  } = useRewards();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.scroll, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#6b7280' }}>Loading rewards…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Progress logic for the ring:
  // - For WHITE/YELLOW/RED: progress = points / nextTierAt
  // - For LIGHTNING (no next tier): show full ring
  const pctToNext = nextTierAt !== undefined ? Math.min(1, points / nextTierAt) : 1;

  // Only show rewards the customer qualifies for and hasn't redeemed this cycle
  const unlockedUnredeemed = Object.entries(MILESTONES)
    .filter(([ptsStr]) => {
      const ptsReq = Number(ptsStr);
      return points >= ptsReq && !redemptions[ptsStr];
    })
    .sort((a, b) => Number(a[0]) - Number(b[0]));

  const onRedeem = async (pts: number, title: string) => {
    await redeemMilestone(pts);
    Alert.alert('Reward added 🎉', `You redeemed: ${title}\n\nCheck your account for details.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Title */}
        <Text style={styles.mainTitle}>Your Rewards</Text>

        {/* Tier + Points Circle */}
        <View style={styles.tierCard}>
          <View style={styles.tierTopRow}>
            <Text style={styles.tierLabel}>{TIERS[tier].label}</Text>
            <Text style={styles.annivText}>Since {new Date(anniversaryStart).toLocaleDateString()}</Text>
          </View>

          <View style={styles.ringWrap}>
            <CircleProgress size={190} strokeWidth={14} progress={pctToNext}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.pointsBig}>{points}</Text>
                <Text style={styles.pointsSub}>points</Text>
                {nextTierAt !== undefined ? (
                  <Text style={styles.pointsHint}>
                    {nextTierRemaining === 0 ? 'Eligible for promotion' : `${nextTierRemaining} to next tier`}
                  </Text>
                ) : (
                  <Text style={[styles.pointsHint, { color: '#047857' }]}>Top tier</Text>
                )}
              </View>
            </CircleProgress>
          </View>

          <Text style={styles.tierBlurb}>{tierInfo.blurb}</Text>
        </View>

        {/* Redeemable Rewards (ONLY what they qualify for and haven't redeemed) */}
        <Text style={styles.sectionTitle}>Your Available Rewards</Text>
        {unlockedUnredeemed.length === 0 ? (
          <Text style={styles.emptyText}>No rewards to redeem yet. Keep earning!</Text>
        ) : (
          <View style={styles.cardContainer}>
            {unlockedUnredeemed.map(([ptsStr, info]) => {
              const pts = Number(ptsStr);
              return (
                <View key={ptsStr} style={styles.card}>
                  <Image source={placeholder} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{info.title}</Text>
                    <Text style={styles.cardDesc}>{pts} pts</Text>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => onRedeem(pts, info.title)}
                        style={styles.redeemButton}
                      >
                        <Text style={styles.redeemText}>Redeem</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },

  tierCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  tierTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tierLabel: {
    backgroundColor: '#111827',
    color: '#fff',
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  annivText: { fontSize: 12, color: '#6b7280' },

  ringWrap: { marginTop: 10, alignItems: 'center', justifyContent: 'center' },
  ringCenter: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsBig: { fontSize: 36, fontWeight: '900', color: '#111827', lineHeight: 40 },
  pointsSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  pointsHint: { marginTop: 6, fontSize: 12, color: '#4b5563' },

  tierBlurb: { marginTop: 12, fontSize: 13, color: '#374151', textAlign: 'center' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyText: { color: '#6b7280', fontSize: 14, marginBottom: 8 },

  cardContainer: { width: '100%', gap: 16 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#111827' },
  cardDesc: { fontSize: 14, color: '#4b5563' },
  cardFooter: { marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' },

  redeemButton: { backgroundColor: '#dc2626', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  redeemText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
