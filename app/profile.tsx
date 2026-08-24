import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";

export default function ProfileScreen() {
  const { colorScheme } = useTheme();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      <ScreenHeader title="الملف الوظيفي" iconName="person-outline" />

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C09A3E]/30 rounded-3xl p-5 mb-6 items-center shadow-sm dark:shadow-none">
          <View className="w-20 h-20 rounded-full bg-[#C09A3E]/10 border-2 border-[#C09A3E] items-center justify-center mb-3">
            <Ionicons name="person" size={40} color="#C09A3E" />
          </View>
          <Text className="text-gray-900 dark:text-white text-xl font-black">أحمد محمود علي</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">EMP-8092 • مشرف توزيع ميداني</Text>
        </View>

        {/* Info List */}
        <View className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          {[
            { label: "المقر / المركز الميداني", val: "مركز إغاثة رفح - القطاع أ" },
            { label: "الدائرة الإدارية", val: "دائرة اللوجستيات والتوزيع" },
            { label: "معدل الأجر اليومي", val: "150 جنيه / يوم" },
            { label: "تاريخ الالتحاق", val: "15 يناير 2024" },
          ].map((item, idx) => (
            <View key={idx} className="flex-row justify-between py-3 border-b border-gray-100 dark:border-white/5 last:border-b-0">
              <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold">{item.label}</Text>
              <Text className="text-gray-900 dark:text-white text-xs font-bold">{item.val}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}