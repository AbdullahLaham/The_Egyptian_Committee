import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";

export default function AttendanceScreen() {
  const { colorScheme } = useTheme();
  const [selectedShift, setSelectedShift] = useState("all");

  const attendanceData = [
    { date: "23 أغسطس 2026", shift: "شفت نهار", hours: "8 ساعات", ot: "2 ساعة إضافي", status: "حاضر", type: "day" },
    { date: "22 أغسطس 2026", shift: "شفت ليل", hours: "12 ساعة", ot: "4 ساعات إضافي", status: "حاضر", type: "night" },
    { date: "21 أغسطس 2026", shift: "-", hours: "0 ساعة", ot: "0 ساعة", status: "غياب", type: "absent" },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Shift Filter */}
        <View className="flex-row gap-2 mb-4">
          {[
            { id: "all", label: "الكل" },
            { id: "day", label: "شفت نهار ☀️" },
            { id: "night", label: "شفت ليل 🌙" },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedShift(item.id)}
              className={`px-4 py-2 rounded-xl border ${
                selectedShift === item.id
                  ? "bg-[#C09A3E] border-[#C09A3E]"
                  : "bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10"
              }`}
            >
              <Text className={`text-xs font-bold ${selectedShift === item.id ? "text-black" : "text-gray-700 dark:text-gray-300"}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        {attendanceData.map((item, index) => (
          <View key={index} className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-3 shadow-sm dark:shadow-none">
            <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2 mb-3">
              <Text className="text-gray-900 dark:text-white font-extrabold text-sm">{item.date}</Text>
              <View className={`px-3 py-1 rounded-full ${item.type === "absent" ? "bg-red-500/10 border border-red-500/30" : "bg-emerald-500/10 border border-emerald-500/30"}`}>
                <Text className={`text-xs font-bold ${item.type === "absent" ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>{item.status}</Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 dark:text-gray-400 text-xs">نوع الدوام: <Text className="text-gray-800 dark:text-gray-200 font-bold">{item.shift}</Text></Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">ساعات الأساسي: <Text className="text-gray-800 dark:text-gray-200 font-bold">{item.hours}</Text></Text>
              <Text className="text-[#C09A3E] text-xs font-bold">{item.ot}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}