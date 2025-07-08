// app/order.tsx
import { SafeAreaView, Text, View } from 'react-native';
import Header from '../components/Header';

export default function OrderScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-start px-6 pt-36">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Your Order
        </Text>

        <Text className="text-base text-gray-600">
          This is a longer sentence that should automatically wrap to a new line
          if it reaches the edge of the screen, ensuring everything remains visible.
        </Text>
      </View>
    </SafeAreaView>
  );
}
