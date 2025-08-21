// app/more/index.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

const baseItems = [
  { key: 'Recent Orders', icon: <MaterialIcons name="history" size={24} color="#374151" /> },
  { key: 'Add Missing Points', icon: <Feather name="plus-circle" size={24} color="#374151" /> },
  { key: 'Nutrition Info', icon: <Feather name="info" size={24} color="#374151" /> },
  { key: 'Help', icon: <Feather name="help-circle" size={24} color="#374151" /> },
  { key: 'Careers', icon: <Ionicons name="briefcase-outline" size={24} color="#374151" /> },
  { key: 'Contact', icon: <FontAwesome5 name="phone-alt" size={20} color="#374151" /> },
];

export default function MoreScreen() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();

  const menuItems = isAuthenticated
    ? [{ key: 'Sign Out', icon: <Ionicons name="log-out-outline" size={24} color="#374151" /> }, ...baseItems]
    : [{ key: 'Sign In', icon: <Ionicons name="person-circle-outline" size={24} color="#374151" /> }, ...baseItems];

  const onPressItem = (title: string) => {
    switch (title) {
      case 'Sign In':
        router.push('./sign-in'); // relative to /more
        break;
      case 'Sign Out':
        signOut();
        Alert.alert('Signed out', 'You have been signed out.');
        break;
      case 'Contact':
        router.push('/more/contact'); // relative path avoids typed-route mismatch
        break;
      case 'Recent Orders':
        router.push('/more/recent-orders'); // ← change to relative
        break;
        case 'Add Missing Points':
        router.push('/more/add-missing-points');
        break;
        case 'Nutrition Info':
        router.push('/more/nutrition-info');
        break;


      default:
        Alert.alert(title, 'Coming soon.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onPressItem(item.key)}>
            <View style={styles.icon}>{item.icon}</View>
            <Text style={styles.title}>{item.key}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" style={styles.arrow} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingVertical: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  icon: { marginRight: 16, width: 30, alignItems: 'center' },
  title: { flex: 1, fontSize: 16, color: '#1f2937' },
  arrow: { marginLeft: 12 },
  separator: { height: 1, backgroundColor: '#e5e7eb', marginLeft: 66 },
});
