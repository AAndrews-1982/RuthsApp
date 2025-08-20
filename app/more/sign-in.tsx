import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function SignInScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = usernameOrEmail.length > 0 && password.length > 0 && !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // TODO: replace with your auth call
      Alert.alert('Signed in', 'Welcome back!');
      router.replace('/'); // or wherever you want to land after sign-in
    } catch (e) {
      Alert.alert('Error', 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Sign In</Text>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Username or Email</Text>
          <TextInput
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            placeholder="you@example.com or username"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && { opacity: 0.5 }]}
          disabled={!canSubmit}
          onPress={onSubmit}
        >
          <Text style={styles.submitText}>{submitting ? 'Signing in…' : 'Sign In'}</Text>
        </TouchableOpacity>

        {/* Create Account Link */}
        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/more/create-account')}>
          <Text style={styles.linkText}>New here? Create Account</Text>
        </TouchableOpacity>

        {/* Optional: existing links if you have them */}
        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/more/forgot-password')}>
          <Text style={styles.linkText}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/more/forgot-username')}>
          <Text style={styles.linkText}>Forgot username?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 20 },

  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 16, textAlign: 'center' },

  inputBlock: { marginBottom: 12 },
  label: { fontSize: 13, color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#111827',
    backgroundColor: '#fff',
  },

  submitBtn: {
    backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 14, alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  linkBtn: { alignItems: 'center', marginTop: 10 },
  linkText: { color: '#2563eb', fontWeight: '700' },
});
