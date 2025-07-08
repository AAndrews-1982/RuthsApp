import { View, Text } from 'react-native';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <View className="mb-4">
      <Text className="text-2xl font-bold text-white">{title}</Text>
    </View>
  );
}
