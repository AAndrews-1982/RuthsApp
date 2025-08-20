import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCart } from './context/CartContext';
import { useRewards } from './context/RewardsContext';
import { router } from 'expo-router';

export default function CheckoutScreen() {
  const { items, subtotal, updateQty, removeItem, clearCart } = useCart();
  const { addSpend, setCardLinked } = useRewards();

  // Card form state (replace with your processor SDK as needed)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [exp, setExp] = useState(''); // MM/YY
  const [cvc, setCvc] = useState('');
  const [saveForRewards, setSaveForRewards] = useState(false);
  const [processing, setProcessing] = useState(false);

  const taxRate = 0; // plug your tax logic here if needed
  const tax = useMemo(() => +(subtotal * taxRate).toFixed(2), [subtotal]);
  const total = useMemo(() => +(subtotal + tax).toFixed(2), [subtotal, tax]);

  const canPay =
    items.length > 0 &&
    cardName.trim().length > 1 &&
    /\d{12,19}/.test(cardNumber.replace(/\s|-/g, '')) &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    /^\d{3,4}$/.test(cvc) &&
    !processing;

  const maskedLast4 = cardNumber.replace(/\s|-/g, '').slice(-4);

  const confirmSaveCard = async () =>
    new Promise<boolean>((resolve) => {
      Alert.alert(
        'Save card for rewards?',
        'This card will be saved to track your reward points, do you wish to continue?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Continue', style: 'default', onPress: () => resolve(true) },
        ]
      );
    });

  const processPayment = async () => {
    setProcessing(true);
    try {
      // 1) (Replace with processor flow) tokenize card & charge
      await new Promise((r) => setTimeout(r, 800)); // simulate payment latency

      // 2) If customer opted to save card, confirm explicitly
      if (saveForRewards) {
        const ok = await confirmSaveCard();
        if (ok) {
          // In real life: call your backend to link the processor token/fingerprint to user
          await setCardLinked(true);
        } else {
          // Respect opt-out
        }
      }

      // 3) Mark spend earned (server should also do this after payment in production)
      await addSpend(subtotal);

      // 4) Clear cart, notify & route
      clearCart();
      Alert.alert('Order placed 🎉', `Payment successful. Total charged: $${total.toFixed(2)}${maskedLast4 ? `\nCard •••• ${maskedLast4}` : ''}`, [
        { text: 'View Rewards', onPress: () => router.replace('/rewards') },
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Payment failed', 'Please check your card details and try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Optional: formatters
  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
  const formatExp = (v: string) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Checkout</Text>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          {items.length === 0 ? (
            <Text style={styles.muted}>Your cart is empty.</Text>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.line}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {item.name} {item.qty > 1 ? `×${item.qty}` : ''}
                  </Text>
                  {item.flavors?.length ? (
                    <Text style={styles.itemMeta}>Flavors: {item.flavors.join(', ')}</Text>
                  ) : null}
                  {item.modifiers?.length ? (
                    <Text style={styles.itemMeta}>Mods: {item.modifiers.join(', ')}</Text>
                  ) : null}
                </View>
                <View style={styles.qtyWrap}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyVal}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.qty + 1)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: 72, alignItems: 'flex-end' }}>
                  <Text style={styles.price}>${(item.price * item.qty).toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subtotal</Text>
            <Text style={styles.rowVal}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tax</Text>
            <Text style={styles.rowVal}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Input label="Name on Card" value={cardName} onChangeText={setCardName} autoCapitalize="words" />
          <Input
            label="Card Number"
            value={cardNumber}
            onChangeText={(t) => setCardNumber(formatCard(t))}
            keyboardType="numeric"
            placeholder="1234 5678 9012 3456"
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Input
              style={{ flex: 1 }}
              label="Exp (MM/YY)"
              value={exp}
              onChangeText={(t) => setExp(formatExp(t))}
              keyboardType="numeric"
              placeholder="MM/YY"
              maxLength={5}
            />
            <Input
              style={{ flex: 1 }}
              label="CVC"
              value={cvc}
              onChangeText={setCvc}
              keyboardType="numeric"
              placeholder="123"
              maxLength={4}
            />
          </View>

          <CheckRow
            label="Save this card to track my reward points"
            checked={saveForRewards}
            onToggle={() => setSaveForRewards((v) => !v)}
          />

          <TouchableOpacity
            style={[styles.payBtn, !canPay && { opacity: 0.5 }]}
            disabled={!canPay}
            onPress={processPayment}
          >
            <Text style={styles.payText}>{processing ? 'Processing…' : `Pay $${total.toFixed(2)}`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'none',
  style,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: any;
  maxLength?: number;
}) {
  return (
    <View style={[styles.inputBlock, style]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
    </View>
  );
}

function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.checkRow}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },

  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 16, textAlign: 'center' },

  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 10 },

  muted: { color: '#6b7280', fontSize: 14 },

  line: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  itemName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  itemMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  qtyWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 16, color: '#111827', fontWeight: '800' },
  qtyVal: { width: 24, textAlign: 'center', fontWeight: '800', color: '#111827' },

  price: { fontWeight: '800', color: '#111827' },
  remove: { color: '#dc2626', fontSize: 12, marginTop: 6 },

  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 10 },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  rowLabel: { color: '#374151' },
  rowVal: { color: '#111827', fontWeight: '700' },
  totalLabel: { fontSize: 16, fontWeight: '900', color: '#111827' },
  totalVal: { fontSize: 16, fontWeight: '900', color: '#111827' },

  inputBlock: { marginBottom: 10 },
  inputLabel: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#111827', backgroundColor: '#fff',
  },

  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#d1d5db',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginRight: 8,
  },
  checkboxChecked: { backgroundColor: '#111827', borderColor: '#111827' },
  checkboxTick: { color: '#fff', fontSize: 14, fontWeight: '900' },
  checkLabel: { color: '#111827', fontSize: 14 },

  payBtn: { backgroundColor: '#dc2626', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  payText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});
