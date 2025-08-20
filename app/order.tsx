// app/order.tsx
import { SafeAreaView, View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MENU_SECTIONS } from '../src/data/menuData';

// Placeholder image for all items (swap per-item later if desired)
const placeholderImage = require('../assets/images/placeholder.png');

export default function OrderScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {MENU_SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>

            {section.items.map((item) => (
              <Pressable
                key={item.slug}
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
                onPress={() => router.push(`/item/${encodeURIComponent(item.slug)}`)}
                android_ripple={{ color: '#e5e7eb' }}
              >
                <Image source={placeholderImage} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingVertical: 24, paddingHorizontal: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  image: { width: 50, height: 50, borderRadius: 6, marginRight: 12 },
  name: { flex: 1, fontSize: 16, color: '#374151' },
  price: { fontSize: 16, fontWeight: '600', color: '#111827' },
});
