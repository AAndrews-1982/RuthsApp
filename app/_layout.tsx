import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Loading from '../components/loading'; // ✅ path to your loading file
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
  Entypo,
} from '@expo/vector-icons';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 3 seconds
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (showSplash) {
    return <Loading onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#facc15',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingBottom: 20,
            paddingTop: 5,
            height: 100,
          },
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case 'index':
                return <Ionicons name="flash" size={size} color="#facc15" />;
              case 'order':
                return <FontAwesome5 name="hamburger" size={size} color={color} />;
              case 'rewards':
                return <FontAwesome5 name="gift" size={size} color={color} />;
              case 'scan':
                return (
                  <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />
                );
              case 'foryou':
                return <Feather name="star" size={size} color={color} />;
              case 'more':
                return (
                  <Entypo name="dots-three-horizontal" size={size} color="#dc2626" />
                );
              default:
                return null;
            }
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="order" options={{ title: 'Order' }} />
        <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
        <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
        <Tabs.Screen name="more" options={{ title: 'More' }} />
      </Tabs>
    </View>
  );
}
