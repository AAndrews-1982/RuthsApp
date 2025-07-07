import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../app/HomeScreen';
import MenuScreen from '../../app/Menu';
import OrderScreen from '../../app/Order';
import AccountScreen from '../../app/Account';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Menu') iconName = 'restaurant';
          else if (route.name === 'Order') iconName = 'cart';
          else if (route.name === 'Account') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1ed2af',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
