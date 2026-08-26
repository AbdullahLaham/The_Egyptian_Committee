// import React, { useState } from "react";
// import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const [selectedShift, setSelectedShift] = useState("all");

//   const attendanceData = [
//     { date: "23 أغسطس 2026", shift: "شفت نهار", hours: "8 ساعات", ot: "2 ساعة إضافي", status: "حاضر", type: "day" },
//     { date: "22 أغسطس 2026", shift: "شفت ليل", hours: "12 ساعة", ot: "4 ساعات إضافي", status: "حاضر", type: "night" },
//     { date: "21 أغسطس 2026", shift: "-", hours: "0 ساعة", ot: "0 ساعة", status: "غياب", type: "absent" },
//   ];

//   return (
//     <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

//       <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

//       <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
//         {/* Shift Filter */}
//         <View className="flex-row gap-2 mb-4">
//           {[
//             { id: "all", label: "الكل" },
//             { id: "day", label: "شفت نهار ☀️" },
//             { id: "night", label: "شفت ليل 🌙" },
//           ].map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               onPress={() => setSelectedShift(item.id)}
//               className={`px-4 py-2 rounded-xl border ${
//                 selectedShift === item.id
//                   ? "bg-[#C09A3E] border-[#C09A3E]"
//                   : "bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10"
//               }`}
//             >
//               <Text className={`text-xs font-bold ${selectedShift === item.id ? "text-black" : "text-gray-700 dark:text-gray-300"}`}>
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* List */}
//         {attendanceData.map((item, index) => (
//           <View key={index} className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-3 shadow-sm dark:shadow-none">
//             <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2 mb-3">
//               <Text className="text-gray-900 dark:text-white font-extrabold text-sm">{item.date}</Text>
//               <View className={`px-3 py-1 rounded-full ${item.type === "absent" ? "bg-red-500/10 border border-red-500/30" : "bg-emerald-500/10 border border-emerald-500/30"}`}>
//                 <Text className={`text-xs font-bold ${item.type === "absent" ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>{item.status}</Text>
//               </View>
//             </View>
//             <View className="flex-row justify-between">
//               <Text className="text-gray-500 dark:text-gray-400 text-xs">نوع الدوام: <Text className="text-gray-800 dark:text-gray-200 font-bold">{item.shift}</Text></Text>
//               <Text className="text-gray-500 dark:text-gray-400 text-xs">ساعات الأساسي: <Text className="text-gray-800 dark:text-gray-200 font-bold">{item.hours}</Text></Text>
//               <Text className="text-[#C09A3E] text-xs font-bold">{item.ot}</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }











import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { api } from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";

interface AttendanceRecord {
  id: string;
  attendance_id: number;
  date_formatted: string;
  raw_date: string;
  shift_key: string;
  shift_type: string;
  status: string;
  status_class: string;
  base_hours: number;
  overtime_hours: number;
}

export default function AttendanceScreen() {
  const { colorScheme } = useTheme();
  const [selectedShift, setSelectedShift] = useState("all");
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceHistory = async () => {
    try {
      setError(null);
      const response = await api.get("https://egypt.mahmoudalbatran.com/api/attendance/history")
      const data = await response.data;

      if (data && data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Error fetching attendance history:", err);
      setError("حدث خطأ أثناء تحميل سجل الحضور");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendanceHistory();
  };

  const filteredHistory = history.filter((item) => {
    if (selectedShift === "all") return true;
    return item.shift_key === selectedShift;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

      <ScrollView
        className="px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <Text
                className={`text-xs font-bold ${
                  selectedShift === item.id
                    ? "text-black"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Loading State */}
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#C09A3E" />
            <Text className="text-gray-500 dark:text-gray-400 mt-3 text-xs">
              جاري تحميل السجل...
            </Text>
          </View>
        ) : error ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-red-500 text-sm font-bold">{error}</Text>
          </View>
        ) : filteredHistory.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              لا يوجد سجلات دوام مطابقة.
            </Text>
          </View>
        ) : (
          /* List */
          filteredHistory.map((item) => (
            <View
              key={item.id}
              className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-3 shadow-sm dark:shadow-none"
            >
              <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2 mb-3">
                <Text className="text-gray-900 dark:text-white font-extrabold text-sm">
                  {item.date_formatted}
                </Text>
                <View
                  className={`px-3 py-1 rounded-full ${
                    item.status_class === "absent"
                      ? "bg-red-500/10 border border-red-500/30"
                      : "bg-emerald-500/10 border border-emerald-500/30"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      item.status_class === "absent"
                        ? "text-red-500 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  نوع الدوام:{" "}
                  <Text className="text-gray-800 dark:text-gray-200 font-bold">
                    {item.shift_type}
                  </Text>
                </Text>

                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  ساعات الأساسي:{" "}
                  <Text className="text-gray-800 dark:text-gray-200 font-bold">
                    {item.base_hours} ساعة
                  </Text>
                </Text>

                <Text className="text-[#C09A3E] text-xs font-bold">
                  {item.overtime_hours > 0
                    ? `${item.overtime_hours} ساعة إضافي`
                    : "بدون إضافي"}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}