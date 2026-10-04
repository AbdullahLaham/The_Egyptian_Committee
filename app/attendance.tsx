
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








































// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   View,
//   Text,
//   FlatList,
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

// const SHIFT_FILTERS = [
//   { id: "all", label: "الكل", icon: "options-outline" as const },
//   { id: "day", label: "شفت نهار", icon: "sunny-outline" as const },
//   { id: "night", label: "شفت ليل", icon: "moon-outline" as const },
// ];

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const [selectedShift, setSelectedShift] = useState<string>("all");
//   const [history, setHistory] = useState<AttendanceRecord[]>([]);
  
//   // حالات التصفح والتحميل
//   const [page, setPage] = useState<number>(1);
//   const [lastPage, setLastPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [loadingMore, setLoadingMore] = useState<boolean>(false);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // دالة جلب البيانات مع دعم الترقيم (Pagination)
//   const fetchAttendanceHistory = async (pageNumber: number = 1, isRefresh: boolean = false) => {
//     try {
//       setError(null);

//       if (pageNumber === 1 && !isRefresh) {
//         setLoading(true);
//       } else if (pageNumber > 1) {
//         setLoadingMore(true);
//       }

//       const response = await api.get(
//         `https://egypt.mahmoudalbatran.com/api/attendance/attendances?page=${pageNumber}`
//       );
//       const data = response?.data;

//       console.log(data, 'ttttttttttttttttttttttttttttttttttt')

//       if (data && Array.isArray(data.history)) {
//         setHistory((prevHistory) => {
//           if (pageNumber === 1 || isRefresh) {
//             return data.history;
//           } else {
//             // تدميج البيانات الجديدة مع منع التكرار باستخدام id
//             const existingIds = new Set(prevHistory.map((item) => item.id));
//             const uniqueNewItems = data.history.filter(
//               (item: AttendanceRecord) => !existingIds.has(item.id)
//             );
//             return [...prevHistory, ...uniqueNewItems];
//           }
//         });

//         setPage(data.current_page || pageNumber);
//         setLastPage(data.last_page || 1);
//       } else if (pageNumber === 1) {
//         setHistory([]);
//       }
//     } catch (err) {
//       console.error("Error fetching attendance history:", err);
//       if (pageNumber === 1) {
//         setError("تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت");
//         setHistory([]);
//       }
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//       setRefreshing(false);
//     }
//   };

//   // جلب البيانات عند البداية
//   useEffect(() => {
//     fetchAttendanceHistory(1);
//   }, []);

//   // تحديث الصفحة عند السحب لأسفل
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setPage(1);
//     fetchAttendanceHistory(1, true);
//   }, []);

//   // جلب المزيد عند الوصول لنهاية القائمة
//   const handleLoadMore = () => {
//     if (!loadingMore && !loading && page < lastPage) {
//       const nextPage = page + 1;
//       fetchAttendanceHistory(nextPage);
//     }
//   };

//   // حماية وتصفية السجلات
//   const safeHistory = useMemo(() => (Array.isArray(history) ? history : []), [history]);

//   const filteredHistory = useMemo(() => {
//     return safeHistory.filter((item) => {
//       if (!item) return false;
//       if (selectedShift === "all") return true;
//       return item.shift_key === selectedShift;
//     });
//   }, [safeHistory, selectedShift]);

//   // حساب الإحصائيات
//   const totalBaseHours = useMemo(
//     () => safeHistory.reduce((acc, curr) => acc + (Number(curr?.base_hours) || 0), 0),
//     [safeHistory]
//   );
  
//   const totalOvertimeHours = useMemo(
//     () => safeHistory.reduce((acc, curr) => acc + (Number(curr?.overtime_hours) || 0), 0),
//     [safeHistory]
//   );

//   const totalDays = safeHistory.length;

//   const renderStatusBadge = (statusClass?: string, statusText?: string) => {
//     let containerStyle = "bg-emerald-500/10 border-emerald-500/30";
//     let textStyle = "text-emerald-600 dark:text-emerald-400";

//     if (statusClass === "absent") {
//       containerStyle = "bg-red-500/10 border-red-500/30";
//       textStyle = "text-red-500 dark:text-red-400";
//     } else if (statusClass === "late" || statusClass === "warning") {
//       containerStyle = "bg-amber-500/10 border-amber-500/30";
//       textStyle = "text-amber-600 dark:text-amber-400";
//     }

//     return (
//       <View className={`px-2.5 py-1 rounded-full border ${containerStyle}`}>
//         <Text className={`text-[10px] font-black ${textStyle}`}>
//           {statusText || "غير محدد"}
//         </Text>
//       </View>
//     );
//   };

//   // مكون رأس القائمة (Header) يحتوي على الإحصائيات وأزرار التصفية
//   const ListHeaderComponent = (
//     <View className="mb-4">
//       {/* ملخص الإحصائيات العلوي */}
//       <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-4 mb-5 shadow-sm">
//         <View className="flex-row items-center justify-between divide-x divide-x-reverse divide-gray-100 dark:divide-white/5">
//           <View className="flex-1 items-center">
//             <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
//               إجمالي الأيام
//             </Text>
//             <Text className="text-gray-900 dark:text-white font-black text-base">
//               {totalDays} <Text className="text-xs font-normal">يوم</Text>
//             </Text>
//           </View>

//           <View className="flex-1 items-center">
//             <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
//               ساعات أساسي
//             </Text>
//             <Text className="text-[#C09A3E] font-black text-base">
//               {totalBaseHours} <Text className="text-xs font-normal">ساعة</Text>
//             </Text>
//           </View>

//           <View className="flex-1 items-center">
//             <Text className="text-gray-400 text-[10px] font-bold mb-0.5">
//               ساعات إضافي
//             </Text>
//             <Text className="text-indigo-500 font-black text-base">
//               {totalOvertimeHours} <Text className="text-xs font-normal">ساعة</Text>
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* أزرار الفلترة */}
//       <View className="flex-row gap-2">
//         {SHIFT_FILTERS.map((item) => {
//           const isActive = selectedShift === item.id;
//           return (
//             <TouchableOpacity
//               key={item.id}
//               onPress={() => setSelectedShift(item.id)}
//               activeOpacity={0.7}
//               className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-2xl border ${
//                 isActive
//                   ? "bg-[#C09A3E] border-[#C09A3E]"
//                   : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
//               }`}
//             >
//               <Ionicons
//                 name={item.icon}
//                 size={15}
//                 color={isActive ? "#000000" : "#9CA3AF"}
//               />
//               <Text
//                 className={`text-xs font-black ${
//                   isActive ? "text-black" : "text-gray-600 dark:text-gray-300"
//                 }`}
//               >
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );

//   // مؤشر التحميل عند جلب الصفحة التالية أسفل القائمة
//   const ListFooterComponent = () => {
//     if (!loadingMore) return <View className="h-6" />;
//     return (
//       <View className="py-4 items-center justify-center">
//         <ActivityIndicator size="small" color="#C09A3E" />
//         <Text className="text-gray-400 text-[10px] font-bold mt-1">
//           جاري تحميل المزيد...
//         </Text>
//       </View>
//     );
//   };

//   // عنصر القائمة الفردي (Attendance Card)
//   const renderAttendanceItem = ({ item, index }: { item: AttendanceRecord; index: number }) => {
//     const isNight = item?.shift_key === "night";
//     const isAbsent = item?.status_class === "absent";

//     return (
//       <View
//         className={`p-4 rounded-3xl border bg-white dark:bg-[#161619] mb-3 shadow-sm ${
//           isAbsent
//             ? "border-red-500/30"
//             : isNight
//             ? "border-indigo-500/20"
//             : "border-amber-500/20"
//         }`}
//       >
//         <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 mb-3">
//           <View className="flex-row items-center gap-2.5">
//             <View
//               className={`w-9 h-9 rounded-2xl items-center justify-center border ${
//                 isNight
//                   ? "bg-indigo-500/10 border-indigo-500/20"
//                   : "bg-amber-500/10 border-amber-500/20"
//               }`}
//             >
//               <Ionicons
//                 name={isNight ? "moon" : "sunny"}
//                 size={18}
//                 color={isNight ? "#6366F1" : "#F59E0B"}
//               />
//             </View>

//             <View>
//               <Text className="text-gray-900 dark:text-white font-black text-sm">
//                 {item?.date_formatted || "تاريخ غير معروف"}
//               </Text>
//               <Text className="text-gray-400 text-[11px] font-bold">
//                 {item?.shift_type || "غير محدد"}
//               </Text>
//             </View>
//           </View>

//           {renderStatusBadge(item?.status_class, item?.status)}
//         </View>

//         <View className="flex-row items-center justify-between bg-gray-50/80 dark:bg-white/[0.02] p-3 rounded-2xl">
//           <View className="flex-row items-center gap-1.5">
//             <Ionicons name="time-outline" size={14} color="#9CA3AF" />
//             <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold">
//               أساسي:{" "}
//               <Text className="text-gray-900 dark:text-white font-black">
//                 {item?.base_hours || 0} س
//               </Text>
//             </Text>
//           </View>

//           <View className="flex-row items-center gap-1.5">
//             <Ionicons name="add-circle-outline" size={14} color="#C09A3E" />
//             <Text className="text-[#C09A3E] text-xs font-bold">
//               إضافي:{" "}
//               <Text className="font-black">
//                 {Number(item?.overtime_hours) > 0
//                   ? `${item.overtime_hours} س`
//                   : "لا يوجد"}
//               </Text>
//             </Text>
//           </View>

          
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F11]">
//       <StatusBar
//         barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
//       />

//       <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

//       {loading ? (
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator size="large" color="#C09A3E" />
//           <Text className="text-gray-400 mt-3 text-xs font-bold">
//             جاري تحميل سجل الحضور...
//           </Text>
//         </View>
//       ) : error ? (
//         <View className="flex-1 items-center justify-center px-4">
//           <View className="w-full py-10 items-center justify-center bg-red-500/10 border border-red-500/20 rounded-3xl p-4">
//             <Ionicons name="wifi-outline" size={30} color="#EF4444" />
//             <Text className="text-red-500 font-bold text-xs mt-2 text-center">
//               {error}
//             </Text>
//             <TouchableOpacity
//               onPress={() => fetchAttendanceHistory(1)}
//               className="mt-3 bg-red-500/20 px-4 py-1.5 rounded-xl border border-red-500/30"
//             >
//               <Text className="text-red-500 text-xs font-bold">إعادة المحاولة</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredHistory}
//           keyExtractor={(item, index) =>
//             item?.id ? `item-${item.id}` : `attendance-${index}`
//           }
//           renderItem={renderAttendanceItem}
//           ListHeaderComponent={ListHeaderComponent}
//           ListFooterComponent={ListFooterComponent}
//           ListEmptyComponent={
//             <View className="py-16 items-center justify-center bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl">
//               <Ionicons name="calendar-clear-outline" size={38} color="#9CA3AF" />
//               <Text className="text-gray-400 text-xs font-bold mt-2">
//                 لا يوجد سجلات دوام مطابقة للفلتر المحدد.
//               </Text>
//             </View>
//           }
//           contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
//           showsVerticalScrollIndicator={false}
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.3}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor="#C09A3E"
//               colors={["#C09A3E"]}
//             />
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// }





import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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

const MONTHS = [
  { id: "all", label: "كل الشهور" },
  { id: "1", label: "يناير (1)" },
  { id: "2", label: "فبراير (2)" },
  { id: "3", label: "مارس (3)" },
  { id: "4", label: "أبريل (4)" },
  { id: "5", label: "مايو (5)" },
  { id: "6", label: "يونيو (6)" },
  { id: "7", label: "يوليو (7)" },
  { id: "8", label: "أغسطس (8)" },
  { id: "9", label: "سبتمبر (9)" },
  { id: "10", label: "أكتوبر (10)" },
  { id: "11", label: "نوفمبر (11)" },
  { id: "12", label: "ديسمبر (12)" },
];

export default function AttendanceScreen() {
  const { colorScheme } = useTheme();

  // حالات الفلترة كمتغيرات للـ API
  const [selectedShift, setSelectedShift] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // حالات فتح وإغلاق قائمة الاختيار (Accordion Dropdowns)
  const [isYearPickerOpen, setIsYearPickerOpen] = useState<boolean>(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false);

  const [history, setHistory] = useState<AttendanceRecord[]>([]);

  // حالات التصفح والتحميل
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // توليد قائمة السنوات
  const yearsList = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [{ id: "all", label: "كل السنوات" }];
    for (let i = 0; i < 5; i++) {
      const yr = (currentYear - i).toString();
      years.push({ id: yr, label: yr });
    }
    return years;
  }, []);

  // دالة جلب البيانات
  const fetchAttendanceHistory = useCallback(
    async (
      pageNumber: number = 1,
      isRefresh: boolean = false,
      shift: string = selectedShift,
      month: string = selectedMonth,
      year: string = selectedYear
    ) => {
      try {
        setError(null);

        if (pageNumber === 1 && !isRefresh) {
          setLoading(true);
        } else if (pageNumber > 1) {
          setLoadingMore(true);
        }

        const params = new URLSearchParams();
        params.append("page", pageNumber.toString());

        if (shift !== "all") params.append("shift", shift);
        if (month !== "all") params.append("month", month);
        if (year !== "all") params.append("year", year);

        const endpoint = `https://egypt.mahmoudalbatran.com/api/attendance/attendances?${params.toString()}`;
        const response = await api.get(endpoint);
        const data = response?.data;

        if (data && Array.isArray(data.history)) {
          setHistory((prevHistory) => {
            if (pageNumber === 1 || isRefresh) {
              return data.history;
            } else {
              const existingIds = new Set(prevHistory.map((item) => item.id));
              const uniqueNewItems = data.history.filter(
                (item: AttendanceRecord) => !existingIds.has(item.id)
              );
              return [...prevHistory, ...uniqueNewItems];
            }
          });

          setPage(data.current_page || pageNumber);
          setLastPage(data.last_page || 1);
        } else if (pageNumber === 1) {
          setHistory([]);
        }
      } catch (err) {
        console.error("Error fetching attendance history:", err);
        if (pageNumber === 1) {
          setError("تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت");
          setHistory([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [selectedShift, selectedMonth, selectedYear]
  );

  useEffect(() => {
    setPage(1);
    fetchAttendanceHistory(1, false, selectedShift, selectedMonth, selectedYear);
  }, [selectedShift, selectedMonth, selectedYear]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchAttendanceHistory(1, true);
  }, [fetchAttendanceHistory]);

  const handleLoadMore = () => {
    if (!loadingMore && !loading && page < lastPage) {
      const nextPage = page + 1;
      fetchAttendanceHistory(nextPage);
    }
  };

  const safeHistory = useMemo(() => (Array.isArray(history) ? history : []), [history]);

  const totalBaseHours = useMemo(
    () => safeHistory.reduce((acc, curr) => acc + (Number(curr?.base_hours) || 0), 0),
    [safeHistory]
  );

  const totalOvertimeHours = useMemo(
    () => safeHistory.reduce((acc, curr) => acc + (Number(curr?.overtime_hours) || 0), 0),
    [safeHistory]
  );

  const totalDays = safeHistory.length;

  const getSelectedMonthLabel = useMemo(() => {
    return MONTHS.find((m) => m.id === selectedMonth)?.label || "اختر الشهر";
  }, [selectedMonth]);

  const getSelectedYearLabel = useMemo(() => {
    return yearsList.find((y) => y.id === selectedYear)?.label || "اختر السنة";
  }, [selectedYear, yearsList]);

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

  const ListHeaderComponent = (
    <View className="mb-4">
      {/* ملخص الإحصائيات العلوي */}
      <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-4 mb-4 shadow-sm">
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

      {/* 1. أزرار الفلترة بحسب الشفت */}
      <View className="mb-3">
        <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1.5 px-1">
          نوع وردية الدوام
        </Text>
        <View className="flex-row gap-2">
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
      </View>

      {/* 2. زرّا السنة والشهر في نفس السطر */}
      <View className="mb-2">
        <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1.5 px-1">
          تصفية بالتاريخ
        </Text>
        <View className="flex-row gap-2">
          {/* زر السنة */}
          <TouchableOpacity
            onPress={() => {
              setIsYearPickerOpen((prev) => !prev);
              if (!isYearPickerOpen) setIsMonthPickerOpen(false);
            }}
            activeOpacity={0.7}
            className={`flex-1 flex-row items-center justify-between px-3.5 py-3 rounded-2xl border ${
              selectedYear !== "all" || isYearPickerOpen
                ? "bg-[#C09A3E]/10 border-[#C09A3E]"
                : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
            }`}
          >
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="calendar-outline" size={16} color="#C09A3E" />
              <Text className="text-gray-900 dark:text-white text-xs font-bold">
                {getSelectedYearLabel}
              </Text>
            </View>
            <Ionicons
              name={isYearPickerOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          {/* زر الشهر */}
          <TouchableOpacity
            onPress={() => {
              setIsMonthPickerOpen((prev) => !prev);
              if (!isMonthPickerOpen) setIsYearPickerOpen(false);
            }}
            activeOpacity={0.7}
            className={`flex-1 flex-row items-center justify-between px-3.5 py-3 rounded-2xl border ${
              selectedMonth !== "all" || isMonthPickerOpen
                ? "bg-[#C09A3E]/10 border-[#C09A3E]"
                : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
            }`}
          >
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="filter-outline" size={16} color="#C09A3E" />
              <Text className="text-gray-900 dark:text-white text-xs font-bold">
                {getSelectedMonthLabel}
              </Text>
            </View>
            <Ionicons
              name={isMonthPickerOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* قائمة خيارات السنوات عمودياً تحت بعضها عند فتح القائمة */}
      {isYearPickerOpen && (
        <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-2xl p-2 mb-3 shadow-md">
          {yearsList.map((item) => {
            const isSelected = selectedYear === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedYear(item.id);
                  setIsYearPickerOpen(false);
                }}
                className={`flex-row items-center justify-between p-2.5 rounded-xl mb-1 ${
                  isSelected ? "bg-[#C09A3E]/15" : "active:bg-gray-100 dark:active:bg-white/5"
                }`}
              >
                <Text
                  className={`text-xs ${
                    isSelected
                      ? "text-[#C09A3E] font-black"
                      : "text-gray-700 dark:text-gray-300 font-bold"
                  }`}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color="#C09A3E" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* قائمة خيارات الشهور عمودياً تحت بعضها عند فتح القائمة */}
      {isMonthPickerOpen && (
        <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-2xl p-2 mb-3 shadow-md max-h-60">
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
            {MONTHS.map((item) => {
              const isSelected = selectedMonth === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setSelectedMonth(item.id);
                    setIsMonthPickerOpen(false);
                  }}
                  className={`flex-row items-center justify-between p-2.5 rounded-xl mb-1 ${
                    isSelected ? "bg-[#C09A3E]/15" : "active:bg-gray-100 dark:active:bg-white/5"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      isSelected
                        ? "text-[#C09A3E] font-black"
                        : "text-gray-700 dark:text-gray-300 font-bold"
                    }`}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color="#C09A3E" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const ListFooterComponent = () => {
    if (!loadingMore) return <View className="h-6" />;
    return (
      <View className="py-4 items-center justify-center">
        <ActivityIndicator size="small" color="#C09A3E" />
        <Text className="text-gray-400 text-[10px] font-bold mt-1">
          جاري تحميل المزيد...
        </Text>
      </View>
    );
  };

  const renderAttendanceItem = ({ item }: { item: AttendanceRecord; index: number }) => {
    const isNight = item?.shift_key === "night";
    const isAbsent = item?.status_class === "absent";

    return (
      <View
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
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F11]">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#C09A3E" />
          <Text className="text-gray-400 mt-3 text-xs font-bold">
            جاري تحميل سجل الحضور...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-full py-10 items-center justify-center bg-red-500/10 border border-red-500/20 rounded-3xl p-4">
            <Ionicons name="wifi-outline" size={30} color="#EF4444" />
            <Text className="text-red-500 font-bold text-xs mt-2 text-center">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchAttendanceHistory(1)}
              className="mt-3 bg-red-500/20 px-4 py-1.5 rounded-xl border border-red-500/30"
            >
              <Text className="text-red-500 text-xs font-bold">إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={safeHistory}
          keyExtractor={(item, index) =>
            item?.id ? `item-${item.id}` : `attendance-${index}`
          }
          renderItem={renderAttendanceItem}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={
            <View className="py-16 items-center justify-center bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl">
              <Ionicons name="calendar-clear-outline" size={38} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs font-bold mt-2">
                لا يوجد سجلات دوام مطابقة للفلتر المحدد.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#C09A3E"
              colors={["#C09A3E"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}


