// app/more/nutrition-info.tsx
import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { ALL_MENU_ITEMS } from '../../src/data/menuData';

const placeholderImage = require('../../assets/images/placeholder.png');

type Nutrition = {
  calories?: number;  // kcal
  protein?: number;   // g
  fat?: number;       // g
  carbs?: number;     // g
  sodium?: number;    // mg
};

/**
 * Fill in real nutrition facts per item here.
 * Key by item.slug from your menu data.
 */
const NUTRITION_BY_SLUG: Record<string, Nutrition> = {
  // example:
  // 'slider-w-fries': { calories: 640, protein: 28, fat: 28, carbs: 62, sodium: 980 },
};

export default function NutritionInfoScreen() {
  const data = useMemo(() => ALL_MENU_ITEMS, []);

  const numColumns = 2;
  const gap = 12;
  const screenW = Dimensions.get('window').width;
  const horizontalPadding = 16 * 2;
  const tileW = Math.floor((screenW - horizontalPadding - gap * (numColumns - 1)) / numColumns);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Nutrition Info</Text>
        <Text style={styles.subtitle}>Per item overview (tap an item in the menu for details)</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => it.slug}
        numColumns={numColumns}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap }}
        renderItem={({ item }) => {
          const n = NUTRITION_BY_SLUG[item.slug] || {};
          const cal = isFiniteNumber(n.calories) ? `${n.calories} cal` : 'Cal: N/A';
          const macroLine = [
            isFiniteNumber(n.protein) ? `P ${n.protein}g` : null,
            isFiniteNumber(n.fat) ? `F ${n.fat}g` : null,
            isFiniteNumber(n.carbs) ? `C ${n.carbs}g` : null,
          ]
            .filter(Boolean)
            .join(' • ');

          return (
            <View style={[styles.card, { width: tileW }]}>
              <View style={styles.imageWrap}>
                <Image source={placeholderImage} style={styles.image} />
                {/* Bottom overlay: white @ 50% opacity, does NOT cover entire image */}
                <View style={styles.overlay}>
                  <Text numberOfLines={1} style={styles.itemName}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.itemNutri}>
                    {macroLine || cal}
                  </Text>
                </View>
              </View>
              {/* Optional: show a tiny caption below for calories if macros shown above */}
              {macroLine ? <Text style={styles.caption}>{cal}</Text> : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function isFiniteNumber(v: any): v is number {
  return typeof v === 'number' && Number.isFinite(v);
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
  imageWrap: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f3f4f6',
  },
  image: { width: '100%', height: '100%' },

  // Bottom strip overlay (white @ 50% opacity)
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.5)', // 50% white
  },
  itemName: { fontSize: 13, fontWeight: '800', color: '#111827' },
  itemNutri: { marginTop: 2, fontSize: 12, color: '#111827' },

  caption: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#6b7280',
  },
});
