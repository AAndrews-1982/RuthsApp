import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function RewardsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Title */}
        <Text style={styles.mainTitle}>Everyone likes to be Rewarded</Text>

        {/* Main Image */}
        <Image
          source={require('../assets/images/placeholder.png')}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* Redeem Button */}
        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemText}>Redeem</Text>
        </TouchableOpacity>

        {/* Other Rewards Title */}
        <Text style={styles.otherTitle}>Other Rewards</Text>

        {/* Reward Cards */}
        <View style={styles.cardContainer}>
          {[1, 2].map((_, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={require('../assets/images/placeholder.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Freebies</Text>
                <Text style={styles.cardDesc}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit.
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  redeemButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  redeemText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  otherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  cardContainer: {
    width: '100%',
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111827',
  },
  cardDesc: {
    fontSize: 14,
    color: '#4b5563',
  },
});
