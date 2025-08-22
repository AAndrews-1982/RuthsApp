// app/more/recent-orders.tsx
import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { useCart } from '../../src/context/CartContext';
import { ALL_MENU_ITEMS } from '../../src/data/menuData';

const placeholderImage = require('../../assets/images/placeholder.png');

export default function RecentOrdersScreen() {
  const { addItem } = useCart();

  // TODO: Replace with real user history (from your backend)
  // For now, show the first 8 menu items as "recent"
  const recent = useMemo(() => {
    return ALL_MENU_ITEMS.slice(0, 8);
  }, []);

  const onReorder = (it: typeof ALL_MENU_ITEMS[number]) => {
    // Minimal re-order: add base item. (You can also store/replay flavors/modifiers)
    addItem({
      name: it.name,
      price: it.price,
      qty: 1,
      flavors: [],
      modifiers: [],
    });
  };

  const numColumns = 2;
  const gap = 12;
  const screenW = Dimensions.get('window').width;
  const horizontalPadding = 16 * 2; // Safe content padding in this screen
  const tileW = Math.floor((screenW - horizontalPadding - gap * (numColumns - 1)) / numColumns);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Recent Orders</Text>
        <Text style={styles.subtitle}>Tap an item to add it to your cart</Text>
      </View>

      <FlatList
        data={recent}
        keyExtractor={(it) => it.slug}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onReorder(item)}
            style={({ pressed }) => [
              styles.card,
              { width: tileW },
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            android_ripple={{ color: '#e5e7eb' }}
          >
            <Image source={placeholderImage} style={styles.image} />
            <View style={styles.infoRow}>
              <Text numberOfLines={2} style={styles.name}>
                {item.name}
              </Text>
              <View style={styles.pricePill}>
                <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerWrap: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { marginTop: 4, color: '#6b7280' },

  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: { width: '100%', height: 120, backgroundColor: '#f3f4f6' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  name: { flex: 1, color: '#111827', fontWeight: '700' },
  pricePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
