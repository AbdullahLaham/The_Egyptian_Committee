
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import axios from "axios";
// import { api } from "@/services/api";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface AttendanceRecord {
//   id: string;
//   attendance_id: number;
//   date_formatted: string;
//   raw_date: string;
//   shift_key: string;
//   shift_type: string;
//   status: string;
//   status_class: string;
//   base_hours: number;
//   overtime_hours: number;
// }

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const [selectedShift, setSelectedShift] = useState("all");
//   const [history, setHistory] = useState<AttendanceRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAttendanceHistory = async () => {
//     try {
//       setError(null);
//       const response = await api.get("https://egypt.mahmoudalbatran.com/api/attendance/history")
//       const data = await response.data;

//       if (data && data.history) {
//         setHistory(data.history);
//       }
//     } catch (err) {
//       console.error("Error fetching attendance history:", err);
//       setError("حدث خطأ أثناء تحميل سجل الحضور");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceHistory();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAttendanceHistory();
//   };

//   const filteredHistory = history.filter((item) => {
//     if (selectedShift === "all") return true;
//     return item.shift_key === selectedShift;
//   });

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar
//         barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
//       />

//       <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

//       <ScrollView
//         className="px-5 pt-4"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
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
//               <Text
//                 className={`text-xs font-bold ${
//                   selectedShift === item.id
//                     ? "text-black"
//                     : "text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Loading State */}
//         {loading ? (
//           <View className="py-20 items-center justify-center">
//             <ActivityIndicator size="large" color="#C09A3E" />
//             <Text className="text-gray-500 dark:text-gray-400 mt-3 text-xs">
//               جاري تحميل السجل...
//             </Text>
//           </View>
//         ) : error ? (
//           <View className="py-10 items-center justify-center">
//             <Text className="text-red-500 text-sm font-bold">{error}</Text>
//           </View>
//         ) : filteredHistory.length === 0 ? (
//           <View className="py-10 items-center justify-center">
//             <Text className="text-gray-500 dark:text-gray-400 text-sm">
//               لا يوجد سجلات دوام مطابقة.
//             </Text>
//           </View>
//         ) : (
//           /* List */
//           filteredHistory.map((item) => (
//             <View
//               key={item.id}
//               className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-3 shadow-sm dark:shadow-none"
//             >
//               <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2 mb-3">
//                 <Text className="text-gray-900 dark:text-white font-extrabold text-sm">
//                   {item.date_formatted}
//                 </Text>
//                 <View
//                   className={`px-3 py-1 rounded-full ${
//                     item.status_class === "absent"
//                       ? "bg-red-500/10 border border-red-500/30"
//                       : "bg-emerald-500/10 border border-emerald-500/30"
//                   }`}
//                 >
//                   <Text
//                     className={`text-xs font-bold ${
//                       item.status_class === "absent"
//                         ? "text-red-500 dark:text-red-400"
//                         : "text-emerald-600 dark:text-emerald-400"
//                     }`}
//                   >
//                     {item.status}
//                   </Text>
//                 </View>
//               </View>

//               <View className="flex-row justify-between">
//                 <Text className="text-gray-500 dark:text-gray-400 text-xs">
//                   نوع الدوام:{" "}
//                   <Text className="text-gray-800 dark:text-gray-200 font-bold">
//                     {item.shift_type}
//                   </Text>
//                 </Text>

//                 <Text className="text-gray-500 dark:text-gray-400 text-xs">
//                   ساعات الأساسي:{" "}
//                   <Text className="text-gray-800 dark:text-gray-200 font-bold">
//                     {item.base_hours} ساعة
//                   </Text>
//                 </Text>

//                 <Text className="text-[#C09A3E] text-xs font-bold">
//                   {item.overtime_hours > 0
//                     ? `${item.overtime_hours} ساعة إضافي`
//                     : "بدون إضافي"}
//                 </Text>
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }















// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface AttendanceRecord {
//   id: string;
//   attendance_id: number;
//   date_formatted: string;
//   raw_date: string;
//   shift_key: string;
//   shift_type: string;
//   status: string;
//   status_class: string;
//   base_hours: number;
//   overtime_hours: number;
// }

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const [selectedShift, setSelectedShift] = useState("all");
//   const [history, setHistory] = useState<AttendanceRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAttendanceHistory = async () => {
//     try {
//       setError(null);
//       const response = await api.get("https://egypt.mahmoudalbatran.com/api/attendance/history");
//       const data = await response.data;

//       if (data && data.history) {
//         setHistory(data.history);
//       }
//     } catch (err) {
//       console.error("Error fetching attendance history:", err);
//       setError("حدث خطأ أثناء تحميل سجل الحضور");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceHistory();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAttendanceHistory();
//   };

//   const filteredHistory = history?.filter((item) => {
//     if (selectedShift === "all") return true;
//     return item?.shift_key === selectedShift;
//   });

//   // Calculate Quick Stats for Header Summary
//   const totalBaseHours = history.reduce((acc, curr) => acc + (curr.base_hours || 0), 0);
//   const totalOvertime = history.reduce((acc, curr) => acc + (curr.overtime_hours || 0), 0);
//   const totalDays = history.length;

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F11]">
//       <StatusBar
//         barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
//       />

//       <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

//       <ScrollView
//         className="px-4 pt-4"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#C09A3E"
//             colors={["#C09A3E"]}
//           />
//         }
//       >
//         {/* TOP SUMMARY STATS CARD */}
//         <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-4 mb-5 shadow-sm">
//           <View className="flex-row items-center justify-between divide-x divide-x-reverse divide-gray-100 dark:divide-white/5">
//             {/* Days Count */}
//             <View className="flex-1 items-center">
//               <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
//                 إجمالي الأيام
//               </Text>
//               <Text className="text-gray-900 dark:text-white font-black text-lg">
//                 {totalDays} <Text className="text-xs font-normal">يوم</Text>
//               </Text>
//             </View>

//             {/* Base Hours */}
//             <View className="flex-1 items-center">
//               <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
//                 ساعات أساسية
//               </Text>
//               <Text className="text-amber-500 font-black text-lg">
//                 {totalBaseHours} <Text className="text-xs font-normal">ساعة</Text>
//               </Text>
//             </View>

//             {/* Overtime Hours */}
//             <View className="flex-1 items-center">
//               <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
//                 ساعات إضافية
//               </Text>
//               <Text className="text-indigo-500 font-black text-lg">
//                 {totalOvertime} <Text className="text-xs font-normal">ساعة</Text>
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* SHIFT FILTER BUTTONS */}
//         <View className="flex-row gap-2 mb-5">
//           {[
//             { id: "all", label: "الكل", icon: "options-outline" },
//             { id: "day", label: "شفت نهار", icon: "sunny-outline" },
//             { id: "night", label: "شفت ليل", icon: "moon-outline" },
//           ].map((item) => {
//             const isActive = selectedShift === item.id;
//             return (
//               <TouchableOpacity
//                 key={item.id}
//                 onPress={() => setSelectedShift(item.id)}
//                 activeOpacity={0.7}
//                 className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-2xl border ${
//                   isActive
//                     ? "bg-[#C09A3E] border-[#C09A3E] shadow-sm"
//                     : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
//                 }`}
//               >
//                 <Ionicons
//                   name={item.icon as any}
//                   size={15}
//                   color={isActive ? "#000000" : "#9CA3AF"}
//                 />
//                 <Text
//                   className={`text-xs font-black ${
//                     isActive ? "text-black" : "text-gray-600 dark:text-gray-300"
//                   }`}
//                 >
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* LOADING & ERROR STATES */}
//         {loading ? (
//           <View className="py-20 items-center justify-center">
//             <ActivityIndicator size="large" color="#C09A3E" />
//             <Text className="text-gray-400 mt-3 text-xs font-bold">
//               جاري تحميل سجل الحضور...
//             </Text>
//           </View>
//         ) : error ? (
//           <View className="py-10 items-center justify-center bg-red-500/10 border border-red-500/20 rounded-3xl p-4">
//             <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
//             <Text className="text-red-500 font-bold text-xs mt-2">{error}</Text>
//           </View>
//         ) : filteredHistory.length === 0 ? (
//           <View className="py-16 items-center justify-center bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl">
//             <Ionicons name="calendar-clear-outline" size={40} color="#9CA3AF" />
//             <Text className="text-gray-400 text-xs font-bold mt-2">
//               لا يوجد سجلات دوام مطابقة للفلتر المحدد.
//             </Text>
//           </View>
//         ) : (
//           /* ATTENDANCE HISTORY LIST */
//           <View className="mb-6">
//             {filteredHistory.map((item) => {
//               const isNight = item.shift_key === "night";
//               const isAbsent = item.status_class === "absent";

//               return (
//                 <View
//                   key={item.id}
//                   className={`p-4 rounded-3xl border bg-white dark:bg-[#161619] mb-3 shadow-sm ${
//                     isAbsent
//                       ? "border-red-500/30"
//                       : isNight
//                       ? "border-indigo-500/20"
//                       : "border-amber-500/20"
//                   }`}
//                 >
//                   {/* TOP CARD BAR: Date, Shift Type Icon & Status Badge */}
//                   <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 mb-3">
//                     <View className="flex-row items-center gap-2.5">
//                       {/* Shift Type Icon Container */}
//                       <View
//                         className={`w-9 h-9 rounded-2xl items-center justify-center border ${
//                           isNight
//                             ? "bg-indigo-500/10 border-indigo-500/20"
//                             : "bg-amber-500/10 border-amber-500/20"
//                         }`}
//                       >
//                         <Ionicons
//                           name={isNight ? "moon" : "sunny"}
//                           size={18}
//                           color={isNight ? "#6366F1" : "#F59E0B"}
//                         />
//                       </View>

//                       {/* Date & Shift Name */}
//                       <View>
//                         <Text className="text-gray-900 dark:text-white font-black text-sm">
//                           {item.date_formatted}
//                         </Text>
//                         <Text className="text-gray-400 text-[11px] font-bold">
//                           {item.shift_type}
//                         </Text>
//                       </View>
//                     </View>

//                     {/* Status Badge */}
//                     <View
//                       className={`px-2.5 py-1 rounded-full border ${
//                         isAbsent
//                           ? "bg-red-500/10 border-red-500/30"
//                           : "bg-emerald-500/10 border-emerald-500/30"
//                       }`}
//                     >
//                       <Text
//                         className={`text-[10px] font-black ${
//                           isAbsent
//                             ? "text-red-500 dark:text-red-400"
//                             : "text-emerald-600 dark:text-emerald-400"
//                         }`}
//                       >
//                         {item.status}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* BOTTOM CARD DETAILS: Base Hours & Overtime */}
//                   <View className="flex-row items-center justify-between bg-gray-50/70 dark:bg-white/[0.02] p-3 rounded-2xl">
//                     <View className="flex-row items-center gap-1.5">
//                       <Ionicons name="time-outline" size={14} color="#9CA3AF" />
//                       <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold">
//                         أساسي:{" "}
//                         <Text className="text-gray-900 dark:text-white font-black">
//                           {item.base_hours} س
//                         </Text>
//                       </Text>
//                     </View>

//                     <View className="flex-row items-center gap-1.5">
//                       <Ionicons name="add-circle-outline" size={14} color="#C09A3E" />
//                       <Text className="text-[#C09A3E] text-xs font-bold">
//                         إضافي:{" "}
//                         <Text className="font-black">
//                           {item.overtime_hours > 0
//                             ? `${item.overtime_hours} س`
//                             : "لا يوجد"}
//                         </Text>
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
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
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
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

const SHIFT_FILTERS = [
  { id: "all", label: "الكل", icon: "options-outline" as const },
  { id: "day", label: "شفت نهار", icon: "sunny-outline" as const },
  { id: "night", label: "شفت ليل", icon: "moon-outline" as const },
];

export default function AttendanceScreen() {
  const { colorScheme } = useTheme();
  const [selectedShift, setSelectedShift] = useState<string>("all");
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceHistory = async () => {
    try {
      setError(null);
      const response = await api.get(
        "https://egypt.mahmoudalbatran.com/api/attendance/history"
      );
      const data = response?.data;

      if (data && Array.isArray(data.history)) {
        setHistory(data.history);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Error fetching attendance history:", err);
      setError("تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت");
      setHistory([]);
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

  const safeHistory = Array.isArray(history) ? history : [];

  const filteredHistory = safeHistory.filter((item) => {
    if (!item) return false;
    if (selectedShift === "all") return true;
    return item.shift_key === selectedShift;
  });

  const totalBaseHours = safeHistory.reduce(
    (acc, curr) => acc + (Number(curr?.base_hours) || 0),
    0
  );
  const totalOvertimeHours = safeHistory.reduce(
    (acc, curr) => acc + (Number(curr?.overtime_hours) || 0),
    0
  );
  const totalDays = safeHistory.length;

  const renderStatusBadge = (statusClass?: string, statusText?: string) => {
    let containerStyle = "bg-emerald-500/10 border-emerald-500/30";
    let textStyle = "text-emerald-600 dark:text-emerald-400";

    if (statusClass === "absent") {
      containerStyle = "bg-red-500/10 border-red-500/30";
      textStyle = "text-red-500 dark:text-red-400";
    } else if (statusClass === "late" || statusClass === "warning") {
      containerStyle = "bg-amber-500/10 border-amber-500/30";
      textStyle = "text-amber-600 dark:text-amber-400";
    }

    return (
      <View className={`px-2.5 py-1 rounded-full border ${containerStyle}`}>
        <Text className={`text-[10px] font-black ${textStyle}`}>
          {statusText || "غير محدد"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F11]">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

      <ScrollView
        className="px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C09A3E"
            colors={["#C09A3E"]}
          />
        }
      >
        {/* ملخص الإحصائيات العلوي */}
        <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-4 mb-5 shadow-sm">
          <View className="flex-row items-center justify-between divide-x divide-x-reverse divide-gray-100 dark:divide-white/5">
            <View className="flex-1 items-center">
              <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
                إجمالي الأيام
              </Text>
              <Text className="text-gray-900 dark:text-white font-black text-base">
                {totalDays} <Text className="text-xs font-normal">يوم</Text>
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
                ساعات أساسي
              </Text>
              <Text className="text-[#C09A3E] font-black text-base">
                {totalBaseHours} <Text className="text-xs font-normal">ساعة</Text>
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
                ساعات إضافي
              </Text>
              <Text className="text-indigo-500 font-black text-base">
                {totalOvertimeHours} <Text className="text-xs font-normal">ساعة</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* أزرار الفلترة */}
        <View className="flex-row gap-2 mb-5">
          {SHIFT_FILTERS.map((item) => {
            const isActive = selectedShift === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedShift(item.id)}
                activeOpacity={0.7}
                className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-2xl border ${
                  isActive
                    ? "bg-[#C09A3E] border-[#C09A3E]"
                    : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
                }`}
              >
                <Ionicons
                  name={item.icon}
                  size={15}
                  color={isActive ? "#000000" : "#9CA3AF"}
                />
                <Text
                  className={`text-xs font-black ${
                    isActive ? "text-black" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* عرض الحالات */}
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#C09A3E" />
            <Text className="text-gray-400 mt-3 text-xs font-bold">
              جاري تحميل سجل الحضور...
            </Text>
          </View>
        ) : error ? (
          <View className="py-10 items-center justify-center bg-red-500/10 border border-red-500/20 rounded-3xl p-4">
            <Ionicons name="wifi-outline" size={30} color="#EF4444" />
            <Text className="text-red-500 font-bold text-xs mt-2 text-center">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                fetchAttendanceHistory();
              }}
              className="mt-3 bg-red-500/20 px-4 py-1.5 rounded-xl border border-red-500/30"
            >
              <Text className="text-red-500 text-xs font-bold">إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        ) : filteredHistory.length === 0 ? (
          <View className="py-16 items-center justify-center bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl">
            <Ionicons name="calendar-clear-outline" size={38} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs font-bold mt-2">
              لا يوجد سجلات دوام مطابقة للفلتر المحدد.
            </Text>
          </View>
        ) : (
          <View className="mb-6">
            {filteredHistory.map((item, index) => {
              const isNight = item?.shift_key === "night";
              const isAbsent = item?.status_class === "absent";

              return (
                <View
                  key={item?.id ? `item-${item.id}` : `attendance-${index}`}
                  className={`p-4 rounded-3xl border bg-white dark:bg-[#161619] mb-3 shadow-sm ${
                    isAbsent
                      ? "border-red-500/30"
                      : isNight
                      ? "border-indigo-500/20"
                      : "border-amber-500/20"
                  }`}
                >
                  <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 mb-3">
                    <View className="flex-row items-center gap-2.5">
                      <View
                        className={`w-9 h-9 rounded-2xl items-center justify-center border ${
                          isNight
                            ? "bg-indigo-500/10 border-indigo-500/20"
                            : "bg-amber-500/10 border-amber-500/20"
                        }`}
                      >
                        <Ionicons
                          name={isNight ? "moon" : "sunny"}
                          size={18}
                          color={isNight ? "#6366F1" : "#F59E0B"}
                        />
                      </View>

                      <View>
                        <Text className="text-gray-900 dark:text-white font-black text-sm">
                          {item?.date_formatted || "تاريخ غير معروف"}
                        </Text>
                        <Text className="text-gray-400 text-[11px] font-bold">
                          {item?.shift_type || "غير محدد"}
                        </Text>
                      </View>
                    </View>

                    {renderStatusBadge(item?.status_class, item?.status)}
                  </View>

                  <View className="flex-row items-center justify-between bg-gray-50/80 dark:bg-white/[0.02] p-3 rounded-2xl">
                    <View className="flex-row items-center gap-1.5">
                      <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                      <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold">
                        أساسي:{" "}
                        <Text className="text-gray-900 dark:text-white font-black">
                          {item?.base_hours || 0} س
                        </Text>
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <Ionicons name="add-circle-outline" size={14} color="#C09A3E" />
                      <Text className="text-[#C09A3E] text-xs font-bold">
                        إضافي:{" "}
                        <Text className="font-black">
                          {Number(item?.overtime_hours) > 0
                            ? `${item.overtime_hours} س`
                            : "لا يوجد"}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}