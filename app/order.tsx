import { SafeAreaView, View, Text, Image, FlatList, StyleSheet, ScrollView } from 'react-native';

// Placeholder image
const placeholderImage = require('../assets/images/placeholder.png');

// Data
const menuData = [
  {
    section: 'MENU',
    items: [
      { name: 'Slider w/ Fries', price: 13.99 },
      { name: '2 Tender w/ Fries', price: 12.99 },
      { name: 'Slider + Tender w/ Fries', price: 14.99 },
      { name: '8pc. Chicken Bites w/ Fries', price: 10.99 },
    ],
  },
  {
    section: 'FAMILY PACKS',
    items: [
      { name: '2 Sliders w/ Fries', price: 18.99 },
      { name: '3 Tenders w/ Fries', price: 15.99 },
      { name: 'Slider Flight w/ Fries', price: 39.99 },
      { name: 'Tender Flight w/ Fries', price: 28.99 },
    ],
  },
  {
    section: 'SPECIALTY MENU',
    items: [
      { name: 'Stack Fries', price: 14.99 },
      { name: 'Slider Flight Junior w/ Fries', price: 15.99 },
      { name: 'Chicken & Waffles', price: 16.99 },
    ],
  },
  {
    section: 'SIDES',
    items: [
      { name: 'Slider', price: 10.99 },
      { name: 'Tender', price: 5.99 },
      { name: 'Fries', price: 3.99 },
      { name: 'Apple Slaw', price: 3.99 },
      { name: "Ruth's Sauce", price: 0.99 },
    ],
  },
];

export default function OrderScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {menuData.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item, i) => (
              <View key={i} style={styles.card}>
                <Image source={placeholderImage} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        ))}
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
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
