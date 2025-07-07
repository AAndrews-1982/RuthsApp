import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1ed2af',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="Menu" options={{ title: 'Menu' }} />
      <Tabs.Screen name="Order" options={{ title: 'Order' }} />
      <Tabs.Screen name="Account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
