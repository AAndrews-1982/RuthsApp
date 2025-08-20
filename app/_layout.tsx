// app/_layout.tsx
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Loading from '../components/loading';
import { AuthProvider } from '../src/context/AuthContext';
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
    const t = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) return <Loading onFinish={() => setShowSplash(false)} />;

  return (
    <AuthProvider>
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
              const isMore = route.name === 'more' || route.name === 'more/index';
              if (route.name === 'index')
                return <Ionicons name="flash" size={size} color="#facc15" />;
              if (route.name === 'order')
                return <FontAwesome5 name="hamburger" size={size} color={color} />;
              if (route.name === 'rewards')
                return <FontAwesome5 name="gift" size={size} color={color} />;
              if (route.name === 'scan')
                return (
                  <MaterialCommunityIcons name="qrcode-scan" size={size} color={color} />
                );
              if (route.name === 'foryou')
                return <Feather name="star" size={size} color={color} />;
              if (isMore)
                return <Entypo name="dots-three-horizontal" size={size} color="#dc2626" />;
              return null;
            },
          })}
        >
          {/* Top-level tabs */}
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="order" options={{ title: 'Order' }} />
          <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
          <Tabs.Screen name="scan" options={{ title: 'Scan' }} />

          {/* "More" is now a folder; point to its index explicitly */}
          <Tabs.Screen name="more/index" options={{ title: 'More' }} />

          {/* Hide non-tab routes */}
          <Tabs.Screen name="+not-found" options={{ href: null }} />
          <Tabs.Screen name="_sitemap" options={{ href: null }} />


          {/* Hide nested More routes so they don't show as tabs */}
          <Tabs.Screen name="more/sign-in" options={{ href: null }} />
          <Tabs.Screen name="more/forgot-password" options={{ href: null }} />
          <Tabs.Screen name="more/forgot-username" options={{ href: null }} />
        </Tabs>
      </View>
    </AuthProvider>
  );
}
