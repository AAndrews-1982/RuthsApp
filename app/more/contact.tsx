// app/more/contact.tsx
import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const BUSINESS_NAME = "Ruth's Chicken";
const PHONE_DISPLAY = '(918)-123-4567';
const PHONE_E164 = '+19181234567'; // used for tel: links
const ADDRESS_DISPLAY = '1606 S Trenton';
const WEBSITE = 'https://www.ruthschicken.com';
const EMAIL = 'information@ruthschicken.com';

// ⚠️ Replace with exact coordinates to restaurant later.
// These are placeholder-ish coordinates; the "Open in Google Maps" button will
// always take customers to the right place by using the address string.
const LAT = 36.1409;
const LNG = -95.9770;

export default function ContactScreen() {
  const region = useMemo(
    () => ({
      latitude: LAT,
      longitude: LNG,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    []
  );

  const onCall = async () => {
    try {
      await Linking.openURL(`tel:${PHONE_E164}`);
    } catch {
      Alert.alert('Unable to place a call on this device.');
    }
  };

  const onEmail = async () => {
    const subject = encodeURIComponent(`${BUSINESS_NAME} Inquiry`);
    const url = `mailto:${EMAIL}?subject=${subject}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open email composer.');
    }
  };

  const onWebsite = async () => {
    try {
      await Linking.openURL(WEBSITE);
    } catch {
      Alert.alert('Unable to open website.');
    }
  };

  const onDirections = async () => {
    // Prefer Google Maps query; on iOS this will open Google Maps if installed, otherwise web
    const gmaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      ADDRESS_DISPLAY
    )}`;
    try {
      await Linking.openURL(gmaps);
    } catch {
      Alert.alert('Unable to open maps.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Contact Us</Text>

        <View style={styles.card}>
          <Row
            icon={<Ionicons name="call-outline" size={20} color="#111827" />}
            label="Phone"
            value={PHONE_DISPLAY}
            onPress={onCall}
          />
          <Divider />
          <Row
            icon={<MaterialCommunityIcons name="map-marker-outline" size={22} color="#111827" />}
            label="Address"
            value={ADDRESS_DISPLAY}
            onPress={onDirections}
          />
          <Divider />
          <Row
            icon={<Feather name="globe" size={20} color="#111827" />}
            label="Website"
            value={WEBSITE.replace(/^https?:\/\//, '')}
            onPress={onWebsite}
          />
          <Divider />
          <Row
            icon={<Feather name="mail" size={20} color="#111827" />}
            label="Email"
            value={EMAIL}
            onPress={onEmail}
          />
        </View>

        {/* Map with pinned marker */}
        <View style={styles.mapCard}>
          <Text style={styles.sectionTitle}>Find Us</Text>
          <MapView style={styles.map} initialRegion={region}>
            <Marker
              coordinate={{ latitude: LAT, longitude: LNG }}
              title={BUSINESS_NAME}
              description={ADDRESS_DISPLAY}
            />
          </MapView>

          <TouchableOpacity onPress={onDirections} style={styles.dirBtn} activeOpacity={0.9}>
            <MaterialCommunityIcons name="google-maps" size={18} color="#fff" />
            <Text style={styles.dirBtnText}>Open in Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Quick action buttons */}
        <View style={styles.actionsRow}>
          <ActionButton icon="call-outline" label="Call" onPress={onCall} />
          <ActionButton icon="map-outline" label="Directions" onPress={onDirections} />
          <ActionButton icon="mail-outline" label="Email" onPress={onEmail} />
          <ActionButton icon="globe-outline" label="Website" onPress={onWebsite} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.75 : 1}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
      </View>
      {onPress ? <Feather name="chevron-right" size={20} color="#6b7280" /> : null}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionBtn} activeOpacity={0.9}>
      <Ionicons name={icon} size={18} color="#111827" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, paddingBottom: 32 },

  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12 },

  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 16,
  },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowLabel: { fontSize: 12, color: '#6b7280' },
  rowValue: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 2 },

  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 4 },

  mapCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 10 },
  map: { width: '100%', height: 220, borderRadius: 10 },
  dirBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dirBtnText: { color: '#fff', fontWeight: '800' },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 6,
  },
  actionText: { fontSize: 12, fontWeight: '700', color: '#111827' },
});
