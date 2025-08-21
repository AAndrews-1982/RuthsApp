// app/item/[slug].tsx
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ALL_MENU_ITEMS } from '../../src/data/menuData';
import Chip from '../../components/Chip';
import { useCart } from '../context/CartContext';

const placeholderImage = require('../../assets/images/placeholder.png');

export default function ItemDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const item = useMemo(() => ALL_MENU_ITEMS.find((i) => i.slug === slug), [slug]);

  // State
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [glutenFree, setGlutenFree] = useState<boolean>(false);
  const [celiacProtocol, setCeliacProtocol] = useState<boolean>(false);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.replace('/order')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>
        <View style={styles.empty}>
          <Text style={styles.notFound}>Item not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxFlavors = item.flavorCount ?? 0;

  const onToggleFlavor = (f: string) => {
    const exists = selectedFlavors.includes(f);
    if (exists) {
      setSelectedFlavors((prev) => prev.filter((x) => x !== f));
      return;
    }
    if (maxFlavors === 0) return;
    if (selectedFlavors.length >= maxFlavors) return; // silently ignore at limit
    setSelectedFlavors((prev) => [...prev, f]);
  };

  const onToggleModifier = (m: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const readyToAdd =
    (maxFlavors === 0 || selectedFlavors.length === maxFlavors) &&
    (!celiacProtocol || glutenFree);

  const handleAddToOrder = () => {
    if (!readyToAdd) return;

    const modsForCart = [
      ...selectedModifiers,
      ...(item.glutenFreeNote && glutenFree ? [item.glutenFreeNote] : []),
      ...(item.celiacNote && celiacProtocol ? ['Celiac Protocol'] : []),
    ];

    addItem({
      name: item.name,
      price: item.price,
      qty: 1,
      flavors: selectedFlavors,
      modifiers: modsForCart,
    });

    // No popup by request
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Back (TOP) */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.replace('/order')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <Image source={placeholderImage} style={styles.hero} />

        {/* Title + Price */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.pricePill}>
            <Text
              style={styles.priceText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              ${item.price.toFixed(2)}
            </Text>
          </View>
        </View>

        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}

        {/* Flavors */}
        {maxFlavors > 0 && item.flavors && item.flavors.length > 0 && (
          <View style={styles.block}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTitle}>
                {maxFlavors} {maxFlavors === 1 ? 'Flavor selection' : 'Flavor selections'}
              </Text>
              <Text style={styles.countText}>
                {selectedFlavors.length}/{maxFlavors} selected
              </Text>
            </View>
            <View style={styles.chipWrap}>
              {item.flavors.map((f) => {
                const selected = selectedFlavors.includes(f);
                const reachedLimit = !selected && selectedFlavors.length >= maxFlavors;
                return (
                  <Chip
                    key={f}
                    label={f}
                    selected={selected}
                    disabled={reachedLimit}
                    onPress={() => onToggleFlavor(f)}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Modifiers */}
        {item.modifiers && item.modifiers.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Modifiers</Text>
            <View style={styles.chipWrap}>
              {item.modifiers.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  selected={selectedModifiers.includes(m)}
                  onPress={() => onToggleModifier(m)}
                />
              ))}
            </View>
            <Text style={styles.note}>
              Base price shown above. Modifiers with “+$0.50” add to total.
            </Text>
          </View>
        )}

        {/* Gluten Free toggle */}
        {item.glutenFreeNote && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>{item.glutenFreeNote}</Text>
            <View style={styles.chipWrap}>
              <Chip
                label="Make it Gluten Free"
                selected={glutenFree}
                onPress={() => setGlutenFree((v) => !v)}
              />
            </View>
            <Text style={styles.note}>
              We offer regular buns/bread too — turn this on if you need Gluten Free.
            </Text>
          </View>
        )}

        {/* Celiac callout */}
        {item.celiacNote && (
          <View style={[styles.block, styles.celiacWrap]}>
            <Text style={styles.celiac}>CELIAC</Text>
            <Text style={styles.celiacSub}>
              We are Celiac-friendly. Please tell us if you have an allergy.
              If you select <Text style={{ fontWeight: '700' }}>Celiac Protocol</Text>, we’ll prepare with strict
              allergy handling. (Requires Gluten Free.)
            </Text>

            <View style={[styles.chipWrap, { marginTop: 8 }]}>
              <Chip
                label="Celiac Protocol (strict allergy handling)"
                selected={celiacProtocol}
                onPress={() => setCeliacProtocol((v) => !v)}
                style={{ paddingHorizontal: 14, paddingVertical: 10 }}
              />
            </View>

            {celiacProtocol && !glutenFree && (
              <Text style={[styles.note, { color: '#b91c1c', marginTop: 8 }]}>
                Turn on “Make it Gluten Free” above to continue with Celiac Protocol.
              </Text>
            )}
          </View>
        )}

        {/* Summary + CTA */}
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryTitle}>Your selection</Text>
          <Text style={styles.summaryText}>
            {maxFlavors > 0
              ? `Flavors (${selectedFlavors.length}/${maxFlavors}): ${selectedFlavors.join(', ') || '-'}`
              : 'No flavor selections required'}
          </Text>
          <Text style={styles.summaryText}>
            Modifiers: {selectedModifiers.length ? selectedModifiers.join(', ') : '-'}
          </Text>
          {item.glutenFreeNote ? (
            <Text style={styles.summaryText}>Gluten Free: {glutenFree ? 'Yes' : 'No'}</Text>
          ) : null}
          {item.celiacNote ? (
            <Text style={styles.summaryText}>Celiac Protocol: {celiacProtocol ? 'Yes' : 'No'}</Text>
          ) : null}

          <Pressable
            onPress={handleAddToOrder}
            disabled={!readyToAdd}
            style={({ pressed }) => [
              styles.addBtn,
              !readyToAdd && { opacity: 0.5 },
              pressed && readyToAdd && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.addBtnText}>Add to Order</Text>
          </Pressable>

          {/* Back (BOTTOM) */}
          <Pressable onPress={() => router.replace('/order')} style={styles.backBottom}>
            <Text style={styles.backBottomText}>← Back to Order</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { paddingBottom: 32 },

  headerRow: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 8 },
  backBtn: { paddingVertical: 6, paddingHorizontal: 4 },
  backText: { fontSize: 16, color: '#2563eb', fontWeight: '600' },

  hero: { width: '100%', height: 200, backgroundColor: '#f3f4f6' },

  // Title + Price
  titleRow: {
    paddingHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexShrink: 1,
    marginRight: 12,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  pricePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
    minWidth: 100, // ensures single-line
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0, // don't let the pill shrink
  },
  priceText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    includeFontPadding: false,
  },

  desc: { fontSize: 14, color: '#374151', paddingHorizontal: 16, marginTop: 8, lineHeight: 20 },

  block: { paddingHorizontal: 16, paddingTop: 16 },
  blockHeader: { flexDirection: 'row', alignItems: 'center' },
  blockTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginRight: 8 },
  countText: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },

  note: { marginTop: 6, fontSize: 12, color: '#6b7280' },

  celiacWrap: { marginTop: 8, paddingBottom: 8 },
  celiac: { fontSize: 24, fontWeight: '900', color: '#b91c1c', letterSpacing: 0.5 },
  celiacSub: { marginTop: 6, fontSize: 13, color: '#111827', lineHeight: 19 },

  summaryBlock: {
    marginTop: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8 },
  summaryText: { fontSize: 14, color: '#374151', marginTop: 4 },

  addBtn: {
    marginTop: 14,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },

  // bottom back
  backBottom: { marginTop: 12, alignItems: 'center' },
  backBottomText: { fontSize: 16, color: '#2563eb', fontWeight: '600' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 18, color: '#6b7280' },
});
