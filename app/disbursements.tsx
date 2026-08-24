import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";

export default function DisbursementsScreen() {
  const { colorScheme } = useTheme();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      <ScreenHeader title="المستحقات والصرف" iconName="wallet-outline" />

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Balance Cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C09A3E]/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">غير مصروف (معلق)</Text>
            <Text className="text-[#C09A3E] text-2xl font-black">450 شيكل</Text>
          </View>
          <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-emerald-500/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">المبلغ المستلم</Text>
            <Text className="text-emerald-600 dark:text-emerald-400 text-2xl font-black">3,000 شيكل</Text>
          </View>
        </View>

        <Text className="text-gray-900 dark:text-white font-extrabold text-base mb-3">كشوفات الصرف</Text>

        {[
          { id: "PAY-1092", amount: "150 شيكل", status: "تم الصرف", date: "22 أغسطس 2026", paid: true },
          { id: "PAY-1093", amount: "300 شيكل", status: "قيد المراجعة", date: "23 أغسطس 2026", paid: false },
        ].map((pay) => (
          <View key={pay.id} className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/5 p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm dark:shadow-none">
            <View>
              <Text className="text-gray-900 dark:text-white font-bold text-sm">{pay.amount}</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">{pay.date} • {pay.id}</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${pay.paid ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-amber-500/10 border border-amber-500/30"}`}>
              <Text className={`text-xs font-bold ${pay.paid ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{pay.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}