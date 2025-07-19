import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type Props = {
  onFinish: () => void;
};

export default function Loading({ onFinish }: Props) {
  const [shouldRender, setShouldRender] = useState(false);

  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const boltStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    setShouldRender(true);
    startSplashAnimation();
  }, []);

  const startSplashAnimation = () => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1
    );

    scale.value = withRepeat(
      withTiming(1.2, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    setTimeout(() => {
      scale.value = withTiming(0.2, { duration: 400 });
      opacity.value = withTiming(0, { duration: 400 }, () => {
        runOnJS(onFinish)();
      });
    }, 2200);
  };

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.container, fadeStyle]}>
      <Animated.View style={[styles.orbitContainer, orbitStyle]}>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * 2 * Math.PI;
          const radius = 50;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <View
              key={i}
              style={[styles.dot, { top: 60 + y, left: 60 + x }]}
            />
          );
        })}
      </Animated.View>

      <Animated.View style={[styles.bolt, boltStyle]}>
        <Ionicons name="flash" size={64} color="#fff" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  bolt: {
    position: 'absolute',
    zIndex: 2,
  },
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
