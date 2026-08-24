import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

interface ScreenHeaderProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export default function ScreenHeader({ title, iconName = "apps-outline" }: ScreenHeaderProps) {
  const navigation = useNavigation();
  const { colorScheme, toggleTheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="px-5 pt-14 pb-4 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#141414]">
      <View className="flex-row items-center justify-between">
        
        {/* العنوان والأيقونة الرئيسية */}
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-[#C09A3E]/10 border border-[#C09A3E]/30 items-center justify-center">
            <Ionicons name={iconName} size={20} color="#C09A3E" />
          </View>
          <Text className="text-gray-900 dark:text-white text-xl font-extrabold">
            {title}
          </Text>
        </View>

        {/* أدوات التحكم (أزرار الثيم والقائمة) */}
        <View className="flex-row items-center gap-2">
          {/* زر التبديل بين Dynamic Light & Dark Mode */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 items-center justify-center"
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={20}
              color="#C09A3E"
            />
          </TouchableOpacity>

          {/* زر فتح القائمة الجانبية */}
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 items-center justify-center"
          >
            <Ionicons name="menu-outline" size={24} color="#C09A3E" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}