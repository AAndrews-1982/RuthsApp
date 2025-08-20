import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { useCart } from '../app/context/CartContext';

/**
 * Top-right square cart button with badge.
 * - Renders nothing when the cart is empty.
 * - Tapping navigates to /checkout.
 */
export default function CartMini() {
  const { itemCount, subtotal } = useCart();

  // Hide completely when empty
  if (itemCount === 0) return null;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <TouchableOpacity
        accessibilityLabel="Open cart and checkout"
        activeOpacity={0.9}
        style={styles.button}
        onPress={() => router.push('/checkout')}
      >
        {/* SVG cart icon (clean, similar to provided image) */}
        <Svg width={28} height={28} viewBox="0 0 64 64">
          {/* cart basket outline */}
          <Path
            d="M10 16h12l6 22h20l8-20H26"
            stroke="#111827"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* inner grid bars */}
          <Line x1="30" y1="18" x2="24" y2="38" stroke="#111827" strokeWidth={4} />
          <Line x1="38" y1="18" x2="34" y2="38" stroke="#111827" strokeWidth={4} />
          <Line x1="46" y1="18" x2="44" y2="38" stroke="#111827" strokeWidth={4} />
          {/* base bar */}
          <Line x1="28" y1="42" x2="48" y2="42" stroke="#111827" strokeWidth={5} strokeLinecap="round" />
          {/* wheels */}
          <Circle cx="32" cy="52" r="4.5" fill="#111827" />
          <Circle cx="48" cy="52" r="4.5" fill="#111827" />
        </Svg>

        {/* red badge counter */}
        <View style={styles.badge}>
          <Text style={styles.badgeTxt} numberOfLines={1}>
            {itemCount}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Optional small total pill (comment out if you only want the icon) */}
      <View style={styles.totalPill}>
        <Text style={styles.totalTxt}>${subtotal.toFixed(2)}</Text>
      </View>
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
  button: {
    width: 56,
    height: 56,
    borderRadius: 12,               // square with soft corners
    backgroundColor: '#ffffff',
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

  totalPill: {
    marginTop: 6,
    backgroundColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  totalTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
