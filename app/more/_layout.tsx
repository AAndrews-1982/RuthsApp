// app/more/_layout.tsx
import { Stack } from 'expo-router';

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index"            options={{ title: 'More' }} />
      <Stack.Screen name="careers"          options={{ title: 'Careers' }} />
      <Stack.Screen name="contact"          options={{ title: 'Contact' }} />
      <Stack.Screen name="recent-orders"    options={{ title: 'Recent Orders' }} />
      <Stack.Screen name="add-missing-points" options={{ title: 'Add Missing Points' }} />
      <Stack.Screen name="nutrition-info"   options={{ title: 'Nutrition Info' }} />
      {/* Optional: <Stack.Screen name="faqs" options={{ title: "FAQ's" }} /> */}
      {/* Optional: <Stack.Screen name="sign-in" options={{ headerShown:false }} /> */}
    </Stack>
  );
}
