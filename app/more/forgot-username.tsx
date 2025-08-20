import React, { useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Link } from 'expo-router';

export default function ForgotUsername() {
  const [email, setEmail] = useState('');
  const valid = /\S+@\S+\.\S+/.test(email);

  const onSubmit = async () => {
    if (!valid) return;
    try {
      // TODO: backend should email the username or hint
      await new Promise(r => setTimeout(r, 700));
      Alert.alert('Check your email', 'If an account exists, we sent your username.');
    } catch {
      Alert.alert('Error', 'Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Recover your username</Text>
            <Text style={styles.help}>Enter the email you used when creating your account.</Text>

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

            <TouchableOpacity
              style={[styles.button, { opacity: valid ? 1 : 0.6 }]}
              disabled={!valid}
              onPress={onSubmit}
            >
              <Text style={styles.buttonText}>Send username</Text>
            </TouchableOpacity>

            <View style={styles.linksRow}>
              <Link href="../sign-in"><Text style={styles.link}>Back to sign in</Text></Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  help: { color: '#6b7280', marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: '#6b7280', marginBottom: 6 },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
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
