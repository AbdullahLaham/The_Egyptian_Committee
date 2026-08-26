import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";

export default function HomeHeader() {
  const navigation = useNavigation();

  return (
    <View className="px-5 pt-14 pb-2">
      <View className="bg-[#141414]/90 border border-[#C09A3E]/30 rounded-[32px] p-5 relative overflow-hidden shadow-2xl">
        {/* Egyptian Flag Tricolor Bar Accent */}
        <View className="absolute top-0 left-0 right-0 h-[4px] flex-row">
          <View className="flex-1 bg-[#C8102E]" />
          <View className="flex-1 bg-[#FFFFFF]" />
          <View className="flex-1 bg-[#C09A3E]" />
        </View>

        {/* Ambient Gold Glow Behind Card */}
        <View className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#C09A3E]/10 blur-xl" />

        {/* TOP BAR: Menu Button + Live Pill & Date */}
        <View className="flex-row items-center justify-between mb-5 mt-1">
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-[#C09A3E]/40 items-center justify-center active:scale-95"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="menu-outline" size={26} color="#C09A3E" />
          </Pressable>

          <View className="flex-row items-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            <Text className="text-gray-300 text-xs font-semibold">
              {new Date().toLocaleDateString("ar-EG", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
        </View>

        {/* MIDDLE SECTION: Title & Emblem Badge */}
        <View className="flex-row items-center justify-between">
          {/* Title Area */}
          <View className="flex-1 pl-2">
            {/* <View className="flex-row items-center mb-1">
              <Text className="text-gray-400 text-sm font-semibold">👋 مرحباً بك</Text>
              <View className="mx-2 w-1 h-1 rounded-full bg-[#C09A3E]" />
              <Text className="text-[#C09A3E] text-xs font-bold">مصر 🇪🇬</Text>
            </View> */}

            <Text className="text-white text-3xl font-black tracking-wide leading-tight">
              اللجنة المصرية
            </Text>

            <Text className="text-[#C09A3E] text-base font-bold mt-0.5">
              لإغاثة أهلنا في غزة
            </Text>
          </View>

          {/* Egyptian Crest / Logo Box with Double Border */}
          <View className="relative">
            <View className="w-20 h-20 rounded-[24px] bg-[#1A1A1A] border-2 border-[#C09A3E]/50 items-center justify-center overflow-hidden shadow-lg">
              <Image
                source={require("@/assets/images/micon.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>

            <View className="absolute -bottom-1 -right-1 bg-[#C8102E] px-2 py-0.5 rounded-md border border-white/20">
              <Ionicons name="shield-checkmark" size={10} color="#FFF" />
            </View>
          </View>
        </View>

        {/* BOTTOM METRIC ROW (Quick Stats Bar) */}
        <View className="flex-row items-center justify-between mt-5 pt-4 border-t border-white/10 bg-black/20 -mx-5 -mb-5 px-5 py-3">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={14} color="#C09A3E" />
            <Text className="text-gray-300 text-xs font-bold mr-1.5">الحالة الميدانية:</Text>
            <Text className="text-emerald-400 text-xs font-bold">نشطة الآن</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="pulse" size={14} color="#C8102E" />
            <Text className="text-gray-400 text-xs mr-1 font-semibold">تحديث مستمر</Text>
          </View>
        </View>
      </View>
    </View>
  );
}















// <View className="px-5 pt-16">
//           <View className="flex-row items-center justify-between">
//             {/* Sidebar Toggle Button */}
//             <Pressable
//               onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//               className="p-3 bg-[#1A1A1A] border border-[#C09A3E]/40 rounded-2xl mr-3 shadow-md"
//             >
//               <Ionicons name="menu-outline" size={26} color="#C09A3E" />
//             </Pressable>

//             <View className="flex-1">
//               <Text className="text-gray-300 text-lg">👋 مرحباً بك</Text>
//               <Text className="text-brand-white text-3xl font-extrabold mt-1">
//                 اللجنة المصرية
//               </Text>
//               <Text className="text-gray-400 text-base mt-0.5">
//                 لإغاثة أهلنا في غزة
//               </Text>
//             </View>

//             <View className="w-20 h-20 rounded-[22px] bg-brand-white/10 border border-brand-white/10 items-center justify-center overflow-hidden">
//               <Image
//                 source={require("@/assets/images/micon.png")}
//                 className="w-16 h-16"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           <View className="flex-row items-center mt-4">
//             <Ionicons name="calendar-outline" size={18} color="#D1D5DB" />
//             <Text className="text-gray-300 mr-2 text-sm">
//               {new Date().toLocaleDateString("ar-EG", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </Text>
//           </View>
//         </View>