import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect, usePathname } from 'expo-router';

export default function NotFound() {
  const pathname = usePathname();

  // Catch old/root paths and reroute under /more/*
  if (pathname === '/sign-in') return <Redirect href="/more/sign-in" />;
  if (pathname === '/forgot-password') return <Redirect href="/more/forgot-password" />;
  if (pathname === '/forgot-username') return <Redirect href="/more/forgot-username" />;
  if (pathname === '/careers') return <Redirect href="/more/careers" />;
  if (pathname === '/recent-orders') return <Redirect href="/more/recent-orders" />;
  if (pathname === '/add-missing-points') return <Redirect href="/more/add-missing-points" />;
  if (pathname === '/nutrition-info') return <Redirect href="/more/nutrition-info" />;
  if (pathname === '/contact') return <Redirect href="/more/contact" />;
  if (pathname === '/faqs') return <Redirect href="/more/faqs" />;

  // Default 404 UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.text}>The page you’re looking for doesn’t exist.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  text: { fontSize: 16, color: '#6b7280' },
});
