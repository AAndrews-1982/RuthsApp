import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, FlatList, Image, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';

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
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);

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
        <View style={styles.overlay}>
          {/* Company Logo (top-left) */}
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />

          {/* Hero text */}
          <Text style={styles.title}>Welcome to Ruth’s Chicken</Text>
          <Text style={styles.subtitle}>
            Your favorite gluten-free fried chicken, now in an app.
          </Text>

          {/* Auth Buttons */}
          <TouchableOpacity style={styles.authButton}>
            <Text style={styles.authText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.authButton} onPress={() => console.log('Login pressed')}>
            <Text style={styles.authText}>Log In</Text>
          </TouchableOpacity>
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
        renderItem={({ item }) => (
          <Image source={item} style={styles.heroCard} />
        )}
      />

      {/* Popular section */}
      <Text style={styles.popularTitle}>Popular</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularList}>
        {popularCards.map((img, i) => (
          <Image key={i} source={img} style={styles.popularCard} />
        ))}
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 420,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  authButton: {
    backgroundColor: '#facc15',
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
