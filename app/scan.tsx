import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function ScanScreen() {
  const customerId = 'ruths-guest-001'; // This could be dynamic later

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan to Earn</Text>
      <Text style={styles.subtitle}>Show this QR code to earn rewards for every order.</Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={customerId}
          size={220}
        />
      </View>

      <Text style={styles.note}>Each scan links your order to your customer profile.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 32,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginBottom: 32,
  },
  note: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
