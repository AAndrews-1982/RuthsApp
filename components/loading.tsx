// Loading.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type Props = { onFinish: () => void };

export default function Loading({ onFinish }: Props) {
  const [shouldRender, setShouldRender] = useState(false);

  // Animated values
  const rotate = useSharedValue(0);        // orbit rotation
  const pulse = useSharedValue(1);         // bolt gentle pulse
  const boltZoom = useSharedValue(1);      // bolt mega-zoom at the end
  const orbitScale = useSharedValue(1);    // ring explosion
  const orbitOpacity = useSharedValue(1);  // ring fades out
  const screenOpacity = useSharedValue(1); // whole overlay fades when finishing

  // Styles
  const boltStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * boltZoom.value }],
  }));

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }, { scale: orbitScale.value }],
    opacity: orbitOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  useEffect(() => {
    setShouldRender(true);

    // Start orbit rotation (infinite)
    rotate.value = withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1);

    // Bolt subtle breathing
    pulse.value = withRepeat(
      withTiming(1.12, { duration: 350, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Wrap-up sequence after ~2.2s:
    const t = setTimeout(() => {
      // 1) Explode the ring & fade it
      orbitScale.value = withTiming(6, { duration: 420, easing: Easing.out(Easing.quad) });
      orbitOpacity.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.quad) });

      // 2) Mega‑zoom the bolt (fills screen); stop the gentle pulse visually
      pulse.value = withTiming(1, { duration: 120 });
      boltZoom.value = withSequence(
        withTiming(1.6, { duration: 140, easing: Easing.out(Easing.cubic) }),
        withTiming(12,  { duration: 420, easing: Easing.out(Easing.exp) })
      );

      // 3) Fade the whole screen and finish
      screenOpacity.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) }, () => {
        runOnJS(onFinish)();
      });
    }, 2200);

    return () => clearTimeout(t);
  }, []);

  if (!shouldRender) return null;

  // Geometry for the orbiting dots
  const R = 50; // base radius
  const { width, height } = Dimensions.get('window');
  const centerX = 60;
  const centerY = 60;

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <Animated.View style={[styles.orbitContainer, orbitStyle]}>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * 2 * Math.PI;
          const x = R * Math.cos(angle);
          const y = R * Math.sin(angle);
          return <View key={i} style={[styles.dot, { top: centerY + y, left: centerX + x }]} />;
        })}
      </Animated.View>

      <Animated.View style={[styles.bolt, boltStyle]}>
        {/* Yellow bolt */}
        <Ionicons name="flash" size={64} color="#facc15" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#dc2626', // red backdrop
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  bolt: { position: 'absolute', zIndex: 2 },
  orbitContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
