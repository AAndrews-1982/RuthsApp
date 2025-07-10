import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

const menuItems = [
  { title: 'Sign In', icon: <Ionicons name="person-circle-outline" size={24} color="#374151" /> },
  { title: 'Recent Orders', icon: <MaterialIcons name="history" size={24} color="#374151" /> },
  { title: 'Add Missing Points', icon: <Feather name="plus-circle" size={24} color="#374151" /> },
  { title: 'Nutrition Info', icon: <Feather name="info" size={24} color="#374151" /> },
  { title: 'Help', icon: <Feather name="help-circle" size={24} color="#374151" /> },
  { title: 'Careers', icon: <Ionicons name="briefcase-outline" size={24} color="#374151" /> },
  { title: 'Contact', icon: <FontAwesome5 name="phone-alt" size={20} color="#374151" /> },
];

export default function MoreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <View style={styles.icon}>{item.icon}</View>
            <Text style={styles.title}>{item.title}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 16,
    width: 30,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  arrow: {
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 66, // aligns with text (icon + spacing)
  },
});
