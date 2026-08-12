// components/home/QuickActionCard.tsx

import { Pressable, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface QuickActionCardProps {
  title: string;
  icon: React.ReactNode;
  bgClassName?: string;
  onPress?: () => void;
}

export default function QuickActionCard({
  title,
  icon,
  bgClassName = "bg-brand-white/10",
  onPress,
}: QuickActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] rounded-[30px] border border-brand-white/10 bg-brand-white/5 p-5 active:opacity-80"
    >
      {/* Icon */}
      <View
        className={`w-16 h-16 rounded-2xl items-center justify-center ${bgClassName}`}
      >
        {icon}
      </View>

      {/* Title */}
      <Text className="text-brand-white text-lg font-bold mt-5 leading-7">
        {title}
      </Text>

      {/* Arrow */}
      <View className="items-end mt-4">
        <Entypo
          name="chevron-left"
          size={22}
          color="#9CA3AF"
        />
      </View>
    </Pressable>
  );
}