// app/more/faqs.tsx
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android for smooth expand/collapse
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type QA = { id: string; q: string; a: string };

const FAQS: QA[] = [
  {
    id: '1',
    q: 'What are your hours?',
    a: 'We’re open daily 11am–10pm. Holiday hours may vary; check the “Order” page for today’s schedule.',
  },
  {
    id: '2',
    q: 'Do you offer delivery?',
    a: 'Yes! Order pickup or delivery from the “Order” tab. Availability depends on your location.',
  },
  {
    id: '3',
    q: 'How do Rewards points work?',
    a: 'Earn points on every eligible purchase. Points unlock free items at set thresholds. See the Rewards tab for details.',
  },
  {
    id: '4',
    q: 'Can I add missing points from a receipt?',
    a: 'Yes—go to More → Add Missing Points and enter your 6‑digit receipt code within 30 days.',
  },
  {
    id: '5',
    q: 'Are there vegetarian or gluten‑friendly options?',
    a: 'We have several sides and salads that can fit different needs. See Nutrition Info in More for details.',
  },
  {
    id: '6',
    q: 'How do I contact support?',
    a: 'Tap More → Contact to call or email us. We typically respond within one business day.',
  },
];

export default function FAQsScreen() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
            <Text style={styles.title}>FAQ’s</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search questions…"
              placeholderTextColor="#9ca3af"
              style={styles.search}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const open = item.id === openId;
          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggle(item.id)} activeOpacity={0.8} style={styles.qRow}>
                <Text style={styles.qText}>{item.q}</Text>
                <Text style={styles.chev}>{open ? '−' : '+'}</Text>
              </TouchableOpacity>
              {open && <Text style={styles.aText}>{item.a}</Text>}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text style={{ color: '#6b7280' }}>No results. Try a different search.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 }, // no horizontal padding here
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
  },
  qRow: { flexDirection: 'row', alignItems: 'center' },
  qText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111827' },
  chev: { marginLeft: 12, fontSize: 22, color: '#9ca3af', width: 22, textAlign: 'center' },
  aText: { marginTop: 8, color: '#374151', lineHeight: 20, fontSize: 14 },
  separator: { height: 10 },
});
