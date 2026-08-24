import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar } from "react-native";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";

export default function RequestsScreen() {
  const { colorScheme } = useTheme();
  const [requestType, setRequestType] = useState("إثبات دوام");

  return (
    <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      <ScreenHeader title="تقديم طلب جديد" iconName="document-text-outline" />

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">نوع الطلب</Text>
        <View className="flex-row gap-2 mb-4">
          {["إثبات دوام", "حضور متأخر", "مراجعة ساعات"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setRequestType(type)}
              className={`px-3 py-2 rounded-xl border ${
                requestType === type
                  ? "bg-[#C09A3E] border-[#C09A3E]"
                  : "bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10"
              }`}
            >
              <Text className={`text-xs font-bold ${requestType === type ? "text-black" : "text-gray-700 dark:text-gray-300"}`}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">تفاصيل الطلب / السبب</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="اكتب تفاصيل الطلب وتبرير الدوام هنا..."
          placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
          className="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white mb-6 text-sm shadow-sm dark:shadow-none"
          style={{ textAlignVertical: "top" }}
        />

        <TouchableOpacity className="bg-[#C8102E] p-4 rounded-2xl items-center shadow-lg active:opacity-80">
          <Text className="text-white font-black text-base">إرسال الطلب للمراجعة</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}