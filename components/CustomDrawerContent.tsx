import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear tokens / state logic here
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0F0F0F]">
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Modern Header Banner */}
        <View className="bg-[#1A1A1A] pt-14 pb-6 px-6 border-b border-[#C09A3E]/30 relative overflow-hidden">
          {/* Subtle Red Top Accent Bar */}
          <View className="absolute top-0 left-0 right-0 h-1.5 bg-[#C8102E]" />

          <View className="flex-row items-center justify-between">
            <View className="w-16 h-16 rounded-2xl bg-[#C09A3E]/10 border border-[#C09A3E]/40 items-center justify-center">
              <Image
                source={require("@/assets/images/micon.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </View>

            <View className="px-3 py-1 rounded-full bg-[#C09A3E]/20 border border-[#C09A3E]/40">
              <Text className="text-[#C09A3E] text-xs font-bold">مصر 🇪🇬</Text>
            </View>
          </View>

          <Text className="text-white text-xl font-extrabold mt-4">
            اللجنة المصرية
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            لإغاثة أهلنا في غزة
          </Text>
        </View>

        {/* Navigation Items Group */}
        <View className="px-3 pt-6">
          <Text className="text-[#C09A3E] text-xs font-bold px-3 mb-2 tracking-wider">
            القائمة الرئيسية
          </Text>

          <DrawerItemList {...props} />
        </View>

        {/* Custom Navigation Links Example */}
        <View className="px-3 pt-2">
          <TouchableOpacity 
            onPress={() => router.push("/home")}
            className="flex-row items-center px-4 py-3.5 rounded-xl mb-1 bg-[#1A1A1A]/50 border border-white/5"
          >
            <Ionicons name="stats-chart-outline" size={20} color="#C09A3E" />
            <Text className="text-gray-200 font-semibold text-base mr-3">
              الإحصائيات
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Footer Section: Logout */}
      <View className="p-4 border-t border-white/10 bg-[#141414]">
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          className="flex-row items-center justify-center p-3.5 bg-[#C8102E] rounded-xl shadow-lg"
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text className="text-white font-extrabold mr-2 text-base">
            تسجيل الخروج
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}