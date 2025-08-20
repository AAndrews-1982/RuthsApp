// app/more/sign-in.tsx
import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email) && pw.length >= 6;

  const onSignIn = async () => {
    if (!valid) return;
    try {
      setLoading(true);
      await signIn(email, pw);
      setLoading(false);
      Alert.alert('Signed in', 'Welcome back!');
      router.back();
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Sign in failed', e?.message ?? 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Card wrapper ensures left/right space and a comfy max width */}
          <View style={styles.card}>
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  value={pw}
                  onChangeText={setPw}
                  secureTextEntry={hide}
                  placeholder="••••••••"
                  style={[styles.input, { paddingRight: 44 }]}
                />
                <TouchableOpacity style={styles.eye} onPress={() => setHide(s => !s)}>
                  <Text style={{ fontSize: 14 }}>{hide ? 'Show' : 'Hide'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, { opacity: valid && !loading ? 1 : 0.6 }]}
              disabled={!valid || loading}
              onPress={onSignIn}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
            </TouchableOpacity>

            <View style={styles.linksRow}>
              <Link href="../forgot-password"><Text style={styles.link}>Forgot password?</Text></Link>
              <Text style={{ color: '#9ca3af' }}> • </Text>
              <Link href="../forgot-username"><Text style={styles.link}>Forgot username?</Text></Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Adds global horizontal space + neutral background
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16, // <- ensures the whole screen has gutters
  },
  // Centers content vertically a bit on tall screens
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  // Card gives visible left/right margins + max width
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    // soft shadow (iOS) / elevation (Android)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  title: { fontSize: 24, fontWeight: '800', marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: '#6b7280', marginBottom: 6 },

  // Compact inputs so they don’t feel oversized
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  eye: { position: 'absolute', right: 12, top: 10, padding: 6 },

  button: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  linksRow: { marginTop: 12, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  link: { color: '#2563eb', fontWeight: '600' },
});
