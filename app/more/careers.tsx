// app/more/careers.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';

const img1 = require('../../assets/images/img1.jpg');
const img2 = require('../../assets/images/img2.png');

export default function CareersScreen() {
  // Form state
  const [position, setPosition] = useState('');
  const [days, setDays] = useState(''); // e.g., Mon–Fri, Weekends, etc.
  const [hours, setHours] = useState(''); // e.g., 10am–4pm, evenings, etc.
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const valid =
    position.trim().length > 1 &&
    days.trim().length > 0 &&
    hours.trim().length > 0 &&
    name.trim().length > 1 &&
    /^\+?[\d\s().-]{7,}$/.test(phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmit = async () => {
    if (!valid) {
      Alert.alert('Please complete the form', 'Double-check your contact info and availability.');
      return;
    }
    try {
      setSubmitting(true);
      // TODO: send to your backend (position, days, hours, name, phone, email)
      await new Promise((r) => setTimeout(r, 700));
      Alert.alert('Application sent!', 'Thanks for your interest in joining Ruth’s Chicken.');
      // reset
      setPosition('');
      setDays('');
      setHours('');
      setName('');
      setPhone('');
      setEmail('');
      router.replace('/more/index');
    } catch (e) {
      Alert.alert('Something went wrong', 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Hero image */}
          <Image source={img1} style={styles.hero} resizeMode="cover" />

          {/* Culture / Why Work Here */}
          <Text style={styles.title}>Careers at Ruth’s Chicken</Text>
          <Text style={styles.paragraph}>
            At Ruth’s Chicken, we’re all about great food, warm hospitality, and taking care of people—
            our guests and our team. We coach for growth, celebrate wins big and small, and keep the kitchen
            fun, fast, and friendly. If you’re a team player who takes pride in your work, we’d love to meet you.
          </Text>

          {/* Application / Contact Form */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Apply Now</Text>
            <Field label="Position" placeholder="e.g., Cashier, Cook, Shift Lead" value={position} onChangeText={setPosition} />
            <Field label="Days Available" placeholder="e.g., Mon–Fri, Weekends only" value={days} onChangeText={setDays} />
            <Field label="Preferred Hours" placeholder="e.g., 10am–4pm, Evenings, Open availability" value={hours} onChangeText={setHours} />
            <Field label="Full Name" placeholder="Jane Doe" value={name} onChangeText={setName} autoCapitalize="words" />
            <Field label="Phone Number" placeholder="(555) 555-5555" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Field label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

            <TouchableOpacity
              style={[styles.btn, !valid && { opacity: 0.5 }]}
              disabled={!valid || submitting}
              onPress={onSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.btnText}>{submitting ? 'Submitting…' : 'Submit Application'}</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Ruth’s Chicken is an equal opportunity employer. All employment is decided on the basis of qualifications, merit, and business need.
            </Text>
          </View>

          {/* Secondary image */}
          <Image source={img2} style={styles.heroSmall} resizeMode="cover" />

          {/* Benefits & Perks */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Benefits & Perks</Text>
            <Text style={styles.paragraph}>
              We take care of our team so they can take care of our guests. Benefits may vary by role and location.
            </Text>

            <View style={styles.benefitsList}>
              {BENEFITS.map((b) => (
                <View key={b.title} style={styles.benefitRow}>
                  <View style={styles.bullet} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.benefitTitle}>{b.title}</Text>
                    <Text style={styles.benefitDesc}>{b.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'none',
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const BENEFITS = [
  { title: 'Competitive Pay', desc: 'Earn industry-competitive wages with opportunities for raises.' },
  { title: 'Flexible Scheduling', desc: 'Balance work with school, family, or a second job.' },
  { title: 'Meal Perks', desc: 'Free shift meals and team discounts on menu items.' },
  { title: 'Growth & Training', desc: 'Real coaching, cross-training, and clear paths to leadership.' },
  { title: 'Team Culture', desc: 'Supportive, fast-paced environment where we win together.' },
  { title: 'Time Off', desc: 'Paid time off for eligible team members.' },
  { title: 'Health Benefits', desc: 'Medical, dental, and vision available for eligible roles.' },
  { title: '401(k) Option', desc: 'Save for the future with employer-supported plans (role dependent).' },
  { title: 'Tips Where Applicable', desc: 'Front-of-house roles may receive tip share depending on location.' },
  { title: 'Uniform Provided', desc: 'Look sharp with provided shirts and gear.' },
  { title: 'Community Giveback', desc: 'Join outreach and local partnerships we’re proud of.' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 32 },

  hero: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
  },
  title: { fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 4 },
  paragraph: { marginTop: 8, color: '#374151', lineHeight: 20, fontSize: 14 },

  card: {
    marginTop: 14,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },

  fieldWrap: { marginTop: 10 },
  fieldLabel: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },

  btn: {
    marginTop: 14,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  disclaimer: { marginTop: 10, fontSize: 12, color: '#6b7280' },

  heroSmall: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    marginTop: 16,
    backgroundColor: '#f3f4f6',
  },

  benefitsList: { marginTop: 12, gap: 10 },
  benefitRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
    marginTop: 6,
  },
  benefitTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  benefitDesc: { fontSize: 13, color: '#4b5563', marginTop: 2 },

  backLink: { marginTop: 16, alignItems: 'center' },
  backText: { color: '#2563eb', fontWeight: '700' },
});
