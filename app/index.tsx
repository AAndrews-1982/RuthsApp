import { View, Text, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-8">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          Welcome to Ruth’s Chicken!
        </Text>
      </View>
    </SafeAreaView>
  );
}
