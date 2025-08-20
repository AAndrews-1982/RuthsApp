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
  Pressable,
} from 'react-native';
import { router } from 'expo-router';

type FormState = {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  dob: string; // MM/DD/YYYY (keep simple; you can swap to a date picker later)
  username: string;
  password: string;
  confirmPassword: string;

  acceptTerms: boolean; // required
  optEmail: boolean;
  optPush: boolean;
  optText: boolean;
};

const initialState: FormState = {
  firstName: '',
  lastName: '',
  address: '',
  email: '',
  phone: '',
  dob: '',
  username: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  optEmail: false,
  optPush: false,
  optText: false,
};

export default function CreateAccountScreen() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    [form.email]
  );

  const phoneValid = useMemo(
    () => /^\+?[0-9\-\s().]{7,}$/.test(form.phone.trim()),
    [form.phone]
  );

  const dobValid = useMemo(() => {
    // Very light check: MM/DD/YYYY
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob.trim())) return false;
    const [mm, dd, yyyy] = form.dob.split('/').map(Number);
    if (mm < 1 || mm > 12) return false;
    if (dd < 1 || dd > 31) return false;
    if (yyyy < 1900) return false;
    return true;
  }, [form.dob]);

  const passwordsMatch = form.password.length >= 6 && form.password === form.confirmPassword;

  const requiredFilled =
    form.firstName &&
    form.lastName &&
    form.address &&
    form.email &&
    form.phone &&
    form.dob &&
    form.username &&
    form.password &&
    form.confirmPassword;

  const canSubmit =
    requiredFilled &&
    emailValid &&
    phoneValid &&
    dobValid &&
    passwordsMatch &&
    form.acceptTerms &&
    !submitting;

  const onSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Check your info', 'Please complete all required fields and fix any errors.');
      return;
    }
    setSubmitting(true);

    try {
      // TODO: replace with your API call to create account
      // For demo, just show a success and route to sign-in.
      Alert.alert('Account created 🎉', 'You can now sign in to your account.', [
        {
          text: 'OK',
          onPress: () => router.replace('/more/sign-in'),
        },
      ]);
    } catch (e) {
      Alert.alert('Error', 'There was a problem creating your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const Input = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    placeholder,
    keyboardType,
    autoCapitalize = 'none',
  }: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    secureTextEntry?: boolean;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  }) => (
    <View style={styles.inputBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );

  const Checkbox = ({
    label,
    checked,
    onToggle,
    required = false,
  }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
    required?: boolean;
  }) => (
    <Pressable onPress={onToggle} style={styles.checkRow}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
      </View>
      <Text style={styles.checkLabel}>
        {label} {required ? <Text style={{ color: '#ef4444' }}>*</Text> : null}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Create Account</Text>

        {/* Name */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input
              label="First name *"
              value={form.firstName}
              onChangeText={(t) => set('firstName', t)}
              autoCapitalize="words"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Input
              label="Last name *"
              value={form.lastName}
              onChangeText={(t) => set('lastName', t)}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Address */}
        <Input
          label="Address *"
          value={form.address}
          onChangeText={(t) => set('address', t)}
          placeholder="123 Main St, City, ST 00000"
          autoCapitalize="words"
        />

        {/* Contact */}
        <Input
          label="Email *"
          value={form.email}
          onChangeText={(t) => set('email', t)}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {!emailValid && form.email.length > 0 && (
          <Text style={styles.error}>Enter a valid email address.</Text>
        )}

        <Input
          label="Phone number *"
          value={form.phone}
          onChangeText={(t) => set('phone', t)}
          placeholder="(555) 000-0000"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
        {!phoneValid && form.phone.length > 0 && (
          <Text style={styles.error}>Enter a valid phone number.</Text>
        )}

        {/* DOB */}
        <Input
          label="Date of Birth *"
          value={form.dob}
          onChangeText={(t) => set('dob', t)}
          placeholder="MM/DD/YYYY"
          keyboardType="default"
          autoCapitalize="none"
        />
        {!dobValid && form.dob.length > 0 && (
          <Text style={styles.error}>Use MM/DD/YYYY format.</Text>
        )}

        {/* Auth */}
        <Input
          label="Username *"
          value={form.username}
          onChangeText={(t) => set('username', t)}
          placeholder="Pick a username"
          autoCapitalize="none"
        />
        <Input
          label="Password *"
          value={form.password}
          onChangeText={(t) => set('password', t)}
          placeholder="Minimum 6 characters"
          secureTextEntry
          autoCapitalize="none"
        />
        <Input
          label="Confirm Password *"
          value={form.confirmPassword}
          onChangeText={(t) => set('confirmPassword', t)}
          placeholder="Re-enter password"
          secureTextEntry
          autoCapitalize="none"
        />
        {!passwordsMatch && form.confirmPassword.length > 0 && (
          <Text style={styles.error}>Passwords must match and be at least 6 characters.</Text>
        )}

        {/* Checkboxes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <Checkbox
          label="I accept the Terms & Conditions"
          checked={form.acceptTerms}
          onToggle={() => set('acceptTerms', !form.acceptTerms)}
          required
        />
        <Checkbox
          label="Opt-in to email messages"
          checked={form.optEmail}
          onToggle={() => set('optEmail', !form.optEmail)}
        />
        <Checkbox
          label="Opt-in to push notifications"
          checked={form.optPush}
          onToggle={() => set('optPush', !form.optPush)}
        />
        <Checkbox
          label="Opt-in to text messages"
          checked={form.optText}
          onToggle={() => set('optText', !form.optText)}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && { opacity: 0.5 }]}
          disabled={!canSubmit}
          onPress={onSubmit}
        >
          <Text style={styles.submitText}>{submitting ? 'Creating…' : 'Create Account'}</Text>
        </TouchableOpacity>

        {/* Back to sign-in */}
        <TouchableOpacity style={styles.linkBtn} onPress={() => router.replace('/more/sign-in')}>
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },

  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 16, textAlign: 'center' },

  sectionHeader: { marginTop: 6, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },

  row: { flexDirection: 'row', alignItems: 'center' },

  inputBlock: { marginBottom: 12 },
  label: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#111827',
    backgroundColor: '#fff',
  },

  error: { marginTop: -6, marginBottom: 8, color: '#b91c1c', fontSize: 12 },

  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#d1d5db',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginRight: 8,
  },
  checkboxChecked: { backgroundColor: '#111827', borderColor: '#111827' },
  checkboxTick: { color: '#fff', fontSize: 14, fontWeight: '900' },
  checkLabel: { color: '#111827', fontSize: 14 },

  submitBtn: {
    backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 14, alignItems: 'center',
    marginTop: 18,
  },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  linkBtn: { alignItems: 'center', marginTop: 14 },
  linkText: { color: '#2563eb', fontWeight: '700' },
});
