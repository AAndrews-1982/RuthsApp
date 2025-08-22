// app/index.tsx
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

const heroCards = [
  require('../assets/images/img3.png'),
  require('../assets/images/img1.jpg'),
  require('../assets/images/img4.png'),
  require('../assets/images/img3.png'),
  require('../assets/images/img1.jpg'),
];

const popularCards = [
  require('../assets/images/placeholder.png'),
  require('../assets/images/placeholder.png'),
  require('../assets/images/placeholder.png'),
];

export default function HomeScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const nextIndex = (prev + 1) % heroCards.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/img2.png')}
        resizeMode="cover"
        style={styles.background}
      >
        {/* 🔑 Black overlay with adjustable opacity */}
        <View style={styles.blackOverlay} />

        <View style={styles.overlay}>
          {/* Row keeps logo and text side-by-side, each in its own container */}
          <View style={styles.heroRow}>
            {/* Logo container (fixed size so changes here don't affect text) */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
              />
            </View>

            {/* Text container (independent from logo/buttons) */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>WELCOME TO RUTH'S CHICKEN</Text>
              <Text style={styles.subtitle}>
                Your favorite gluten-free fried chicken, now in an app.
              </Text>
            </View>
          </View>

          {/* Buttons container (independent block below the row) */}
          <View style={styles.authContainer}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => router.push('/more/create-account')}
            >
              <Text style={styles.authText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.authButton}
              onPress={() => router.push('/more/sign-in')}
            >
              <Text style={styles.authText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Auto-scrolling hero cards */}
      <FlatList
        ref={flatListRef}
        data={heroCards}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => <Image source={item} style={styles.heroCard} />}
      />

      {/* Popular section */}
      <Text style={styles.popularTitle}>Popular</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.popularList}
      >
        {popularCards.map((img, i) => (
          <Image key={i} source={img} style={styles.popularCard} />
        ))}
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => router.push('/order')}
      >
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 420,
    width: '100%',
    position: 'relative',
    backgroundColor: '#ffffff',
  },

  // 🔑 Adjustable black overlay
  blackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.0, // 0.1 = 10%, 0.5 = 50%, etc.
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  /* --- Hero Row: logo (left) + text (right) --- */
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoContainer: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 10,
    marginTop: 20,
  },
  logo: {
    width: '125%',
    height: '125%',
    resizeMode: 'contain',
  },

  textContainer: {
    flex: 1,
    flexShrink: 1,
    paddingLeft: 5,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 60,
    paddingLeft: 30,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    paddingLeft: 30,
  },

  /* --- Buttons --- */
  authContainer: {
    marginTop: -20,
    width: '100%',
    alignItems: 'flex-start',
  },
  authButton: {
    backgroundColor: '#ffea06ff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 6,
  },
  authText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 14,
  },

  /* --- Below-hero content --- */
  heroCard: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
  },
  popularTitle: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginTop: 30,
  },
  popularList: {
    paddingVertical: 10,
    paddingLeft: 16,
  },
  popularCard: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  orderButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
