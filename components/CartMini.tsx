// components/CartMini.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, Platform, View, Text } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { useCart } from '../app/context/CartContext';

function usePrevious<T>(val: T) {
  const ref = useRef(val);
  useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref.current as T | undefined;
}

const BOLT_COLOR = '#facc15'; // Yellow bolt

export default function CartMini() {
  const { itemCount, subtotal } = useCart();
  const prevCount = usePrevious(itemCount) ?? 0;

  const [visible, setVisible] = useState(itemCount > 0);

  // Bolt animation pieces
  const boltBaseScale = useSharedValue(0);
  const boltStretchX = useSharedValue(1);
  const boltStretchY = useSharedValue(1);
  const boltRotate = useSharedValue(0);
  const boltOpacity = useSharedValue(0);

  // Flash ring (glow)
  const ringScale = useSharedValue(0.4);
  const ringOpacity = useSharedValue(0);

  // Bag (cart) icon
  const bagScale = useSharedValue(itemCount > 0 ? 1 : 0);
  const bagOpacity = useSharedValue(itemCount > 0 ? 1 : 0);

  useEffect(() => {
    if (itemCount > prevCount) {
      setVisible(true);

      // Reset EVERY time so the animation is identical for each add
      boltOpacity.value = 1;
      boltBaseScale.value = 0.6;
      boltStretchX.value = 1;
      boltStretchY.value = 1;
      boltRotate.value = 0;

      ringOpacity.value = 0;
      ringScale.value = 0.6;

      // Hide/re-prime the bag so it can reappear smoothly
      bagOpacity.value = 0;
      bagScale.value = 0.6;

      // Stage 1: Bolt expands
      const expandMs = 600;
      boltBaseScale.value = withTiming(2.0, {
        duration: expandMs,
        easing: Easing.out(Easing.cubic),
      });

      // Stage 2: Lightning strike (stretch + squeeze + jitter + flash ring)
      const strikeStart = expandMs;
      boltStretchY.value = withDelay(
        strikeStart,
        withSequence(
          withTiming(2.2, { duration: 140, easing: Easing.in(Easing.quad) }),
          withTiming(1.0, { duration: 110, easing: Easing.out(Easing.quad) })
        )
      );
      boltStretchX.value = withDelay(
        strikeStart,
        withSequence(
          withTiming(0.6, { duration: 140, easing: Easing.in(Easing.quad) }),
          withTiming(1.0, { duration: 110, easing: Easing.out(Easing.quad) })
        )
      );
      boltRotate.value = withDelay(
        strikeStart + 30,
        withSequence(
          withTiming(-10, { duration: 70 }),
          withTiming(8, { duration: 90 }),
          withTiming(-4, { duration: 60 }),
          withTiming(0, { duration: 60 })
        )
      );

      // Flash ring
      ringOpacity.value = withDelay(
        strikeStart + 30,
        withTiming(0.45, { duration: 20 })
      );
      ringScale.value = withDelay(
        strikeStart + 30,
        withTiming(2.6, { duration: 240, easing: Easing.out(Easing.cubic) })
      );
      ringOpacity.value = withDelay(
        strikeStart + 30,
        withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) })
      );

      // Stage 3: Smooth transition → bag
      const bagStart = strikeStart + 220;
      bagScale.value = withDelay(
        bagStart,
        withTiming(1, { duration: 380, easing: Easing.out(Easing.back(1.2)) })
      );
      bagOpacity.value = withDelay(
        bagStart,
        withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) })
      );
      boltOpacity.value = withDelay(
        bagStart,
        withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) })
      );
    } else if (itemCount === 0 && prevCount > 0) {
      // Emptied cart → hide button
      bagOpacity.value = withTiming(0, { duration: 180 }, () =>
        runOnJS(setVisible)(false)
      );
      bagScale.value = withTiming(0.9, { duration: 180 });
    }
  }, [itemCount]);

  // Animated styles
  const boltStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: boltBaseScale.value },
      { scaleX: boltStretchX.value },
      { scaleY: boltStretchY.value },
      { rotate: `${boltRotate.value}deg` },
    ],
    opacity: boltOpacity.value,
    zIndex: 3,
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
    zIndex: 2,
  }));
  const bagStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bagScale.value }],
    opacity: bagOpacity.value,
    zIndex: 1,
  }));

  if (!visible) return null;

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      {/* Flash ring */}
      <Animated.View
        style={[styles.overlay, styles.ring, ringStyle]}
        pointerEvents="none"
      />

      {/* Lightning bolt */}
      <Animated.View style={[styles.overlay, boltStyle]} pointerEvents="none">
        <Svg width={30} height={30} viewBox="0 0 64 64">
          <Path d="M36 4 L12 36 h14 l-6 24 28-36 h-14 z" fill={BOLT_COLOR} />
        </Svg>
      </Animated.View>

      {/* Bag button (tap → checkout) */}
      <Animated.View style={[styles.iconBox, bagStyle]}>
        <TouchableOpacity
          accessibilityLabel="Cart"
          activeOpacity={0.9}
          style={styles.button}
          onPress={() => router.push('/checkout')}
        >
          {/* Shopping BAG icon (stroke only) */}
          <Svg width={28} height={28} viewBox="0 0 64 64">
            {/* Bag body */}
            <Path
              d="M18 22 h28 a4 4 0 0 1 4 4 v28 a4 4 0 0 1 -4 4 H18 a4 4 0 0 1 -4 -4 V26 a4 4 0 0 1 4 -4 z"
              fill="none"
              stroke="#111827"
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Handle */}
            <Path
              d="M24 22 a8 8 0 0 1 16 0"
              fill="none"
              stroke="#111827"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </Svg>

          {/* item counter */}
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{itemCount}</Text>
          </View>
        </TouchableOpacity>

        {/* Subtotal pill (always one line, positioned below the bag) */}
        {itemCount > 0 ? (
          <View pointerEvents="none" style={styles.totalPill}>
            <Text
              style={styles.totalTxt}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.9}
            >
              ${subtotal.toFixed(2)}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: Platform.select({ ios: 60, android: 40, default: 40 }),
    right: 16,
    zIndex: 1000,
    alignItems: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    borderRadius: 999,
    backgroundColor: 'rgba(250, 204, 21, 0.25)', // translucent yellow
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTxt: { color: '#fff', fontWeight: '900', fontSize: 12 },

  // Subtotal pill sits BELOW the bag so it has room to be one line
  totalPill: {
    position: 'absolute',
    top: 62, // just below the 56px bag
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#111827',
    minWidth: 84, // ensures "$13.99" stays one line
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  totalTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
