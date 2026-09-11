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
//   Alert,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Location from "expo-location";
// import * as LocalAuthentication from "expo-local-authentication";

// // إحداثيات موقع الشركة ونصف القطر المسموح (70 متر)
// const COMPANY_LOCATION = {
//   latitude: 31.421452,
//   longitude: 34.372222,
//   radiusMeters: 70,
// };

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

// interface AttendanceRequest {
//   id: string;
//   type: string;
//   date: string;
//   reason: string;
//   status: "pending" | "approved" | "rejected";
//   status_label: string;
// }

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   // حالات البيانات
//   const [selectedShift, setSelectedShift] = useState("all");
//   const [history, setHistory] = useState<AttendanceRecord[]>([]);
//   const [requests, setRequests] = useState<AttendanceRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // حالات الموقع والجغرافيا
//   const [currentDistance, setCurrentDistance] = useState<number | null>(null);
//   const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);

//   /**
//    * حساب المسافة الهندسية بوحدة المتر (Haversine Formula)
//    */
//   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//     const R = 6371000;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return Math.round(R * c);
//   };

//   /**
//    * فحص سريع لبُعد الموظف الحالي عن مقر العمل
//    */
//   const checkLocationRange = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       const distance = calculateDistance(
//         location.coords.latitude,
//         location.coords.longitude,
//         COMPANY_LOCATION.latitude,
//         COMPANY_LOCATION.longitude
//       );

//       setCurrentDistance(distance);
//       setIsWithinRange(distance <= COMPANY_LOCATION.radiusMeters);
//     } catch (err) {
//       console.log("Location verification error:", err);
//     }
//   };

//   /**
//    * جلب سجل الحضور والطلبات من السيرفر
//    */
//   const fetchAttendanceData = async () => {
//     try {
//       setError(null);
      
//       // جلب السجل والطلبات بالتوازي
//       const [historyRes, requestsRes] = await Promise.allSettled([
//         api.get("/attendance/history"),
//         api.get("/attendance/requests"),
//       ]);

//       if (historyRes.status === "fulfilled" && historyRes.value.data?.history) {
//         setHistory(historyRes.value.data.history);
//       }

//       if (requestsRes.status === "fulfilled" && requestsRes.value.data?.requests) {
//         setRequests(requestsRes.value.data.requests);
//       }

//       await checkLocationRange();
//     } catch (err) {
//       console.error("Error fetching attendance data:", err);
//       setError("حدث خطأ أثناء تحميل بيانات الحضور");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAttendanceData();
//   };

//   /**
//    * تسجيل الحضور أو الانصراف الذاتي
//    */
//   const handleAttendanceAction = async (type: "check-in" | "check-out") => {
//     try {
//       setActionLoading(true);

//       // 1. فحص الصلاحيات والموقع
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("تنبيه", "يرجى منح صلاحية تحديد الموقع لتسجيل الحضور");
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//       });

//       // 2. كشف الـ Mock Location على أجهزة الأندرويد
//       if (Platform.OS === "android" && location.mocked) {
//         Alert.alert("تنبيه أمني", "تم رصد استخدام تطبيق لتزييف الموقع الجغرافي");
//         return;
//       }

//       const distance = calculateDistance(
//         location.coords.latitude,
//         location.coords.longitude,
//         COMPANY_LOCATION.latitude,
//         COMPANY_LOCATION.longitude
//       );

//       setCurrentDistance(distance);

//       if (distance > COMPANY_LOCATION.radiusMeters) {
//         setIsWithinRange(false);
//         Alert.alert(
//           "خارج نطاق العمل",
//           `أنت تبعد ${distance} متر عن المقر. يلزم التواجد ضمن مسافة ${COMPANY_LOCATION.radiusMeters} متر.`
//         );
//         return;
//       }

//       setIsWithinRange(true);

//       // 3. التحقق عبر البصمة/الوجه
//       const hasHardware = await LocalAuthentication.hasHardwareAsync();
//       const isEnrolled = await LocalAuthentication.isEnrolledAsync();

//       if (!hasHardware || !isEnrolled) {
//         Alert.alert("تنبيه", "يرجى تفعيل بصمة الأصبع أو قفل الشاشة بالهاتف لاستكمال الإجراء");
//         return;
//       }

//       const authResult = await LocalAuthentication.authenticateAsync({
//         promptMessage: type === "check-in" ? "تأكيد تسجيل الحضور" : "تأكيد تسجيل الانصراف",
//         cancelLabel: "إلغاء",
//       });

//       if (!authResult.success) {
//         Alert.alert("فشل التحقق", "لم يتم التعرف على البصمة");
//         return;
//       }

//       // 4. إرسال الطلب للسيرفر
//       const response = await api.post(`/attendance/${type}`, {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         distance_meters: distance,
//       });

//       Alert.alert(
//         "تم بنجاح",
//         response.data?.message || (type === "check-in" ? "تم تسجيل حضورك بنجاح" : "تم تسجيل انصرافك بنجاح")
//       );

//       fetchAttendanceData(); // تحديث القائمة
//     } catch (err: any) {
//       console.error("Attendance action error:", err);
//       Alert.alert("خطأ", err.response?.data?.message || "حدث خطأ أثناء الاتصال بالسيرفر");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const filteredHistory = history.filter((item) => {
//     if (selectedShift === "all") return true;
//     return item.shift_key === selectedShift;
//   });

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

//       <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

//       <ScrollView
//         className="px-5 pt-4"
//         showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C09A3E" />}
//       >
//         {/* 1. قسم كارت تسجيل الحضور والانصراف السريع */}
//         <View className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-5 shadow-sm">
//           <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 mb-3">
//             <View className="flex-row items-center gap-2">
//               <View className="w-8 h-8 rounded-xl bg-[#C09A3E]/10 items-center justify-center">
//                 <Ionicons name="location-sharp" size={18} color="#C09A3E" />
//               </View>
//               <Text className="text-gray-900 dark:text-white font-extrabold text-sm">
//                 التبصيم الذاتي باللوكيشن
//               </Text>
//             </View>

//             {/* شارة حالة النطاق */}
//             <View
//               className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
//                 isWithinRange === true
//                   ? "bg-emerald-500/10 border border-emerald-500/30"
//                   : isWithinRange === false
//                   ? "bg-red-500/10 border border-red-500/30"
//                   : "bg-amber-500/10 border border-amber-500/30"
//               }`}
//             >
//               <Text
//                 className={`text-[10px] font-bold ${
//                   isWithinRange === true
//                     ? "text-emerald-600 dark:text-emerald-400"
//                     : isWithinRange === false
//                     ? "text-red-500 dark:text-red-400"
//                     : "text-amber-600 dark:text-amber-400"
//                 }`}
//               >
//                 {isWithinRange === true
//                   ? "داخل المقر"
//                   : isWithinRange === false
//                   ? "خارج المقر"
//                   : "جاري الفحص..."}
//               </Text>
//             </View>
//           </View>

//           <Text className="text-gray-500 dark:text-gray-400 text-xs text-right mb-4 leading-5">
//             المسافة الحالية:{" "}
//             <Text className="text-gray-800 dark:text-gray-200 font-bold">
//               {currentDistance !== null ? `${currentDistance} متر` : "جاري التحديد..."}
//             </Text>{" "}
//             (النطاق المسموح: 70 متر)
//           </Text>

//           {actionLoading ? (
//             <ActivityIndicator size="small" color="#C09A3E" className="py-3" />
//           ) : (
//             <View className="flex-row gap-2">
//               <TouchableOpacity
//                 onPress={() => handleAttendanceAction("check-in")}
//                 activeOpacity={0.8}
//                 className="flex-1 bg-[#C09A3E] h-11 rounded-xl flex-row items-center justify-center gap-2"
//               >
//                 <Ionicons name="log-in-outline" size={18} color="#000" />
//                 <Text className="text-black font-extrabold text-xs">تسجيل حضور</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => handleAttendanceAction("check-out")}
//                 activeOpacity={0.8}
//                 className="flex-1 bg-gray-200 dark:bg-white/10 h-11 rounded-xl flex-row items-center justify-center gap-2"
//               >
//                 <Ionicons name="log-out-outline" size={18} color={isDark ? "#FFF" : "#000"} />
//                 <Text className="text-gray-900 dark:text-white font-extrabold text-xs">
//                   تسجيل انصراف
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* 2. قسم متابعة حالة طلبات المراجعة والاستئذان */}
//         {requests.length > 0 && (
//           <View className="mb-5">
//             <Text className="text-xs font-black text-gray-500 dark:text-gray-400 mb-2 text-right">
//               حالة طلبات المراجعة والاستئذان
//             </Text>

//             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
//               {requests.map((req) => (
//                 <View
//                   key={req.id}
//                   className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl p-3 w-56 mr-2"
//                 >
//                   <View className="flex-row items-center justify-between mb-2">
//                     <Text className="text-gray-900 dark:text-white font-bold text-xs">
//                       {req.type}
//                     </Text>
//                     <View
//                       className={`px-2 py-0.5 rounded-md ${
//                         req.status === "approved"
//                           ? "bg-emerald-500/10 border border-emerald-500/30"
//                           : req.status === "rejected"
//                           ? "bg-red-500/10 border border-red-500/30"
//                           : "bg-amber-500/10 border border-amber-500/30"
//                       }`}
//                     >
//                       <Text
//                         className={`text-[10px] font-bold ${
//                           req.status === "approved"
//                             ? "text-emerald-600 dark:text-emerald-400"
//                             : req.status === "rejected"
//                             ? "text-red-500 dark:text-red-400"
//                             : "text-amber-600 dark:text-amber-400"
//                         }`}
//                       >
//                         {req.status_label || req.status}
//                       </Text>
//                     </View>
//                   </View>
//                   <Text className="text-gray-500 dark:text-gray-400 text-[10px] mb-1">
//                     تاريخ الطلب: {req.date}
//                   </Text>
//                   <Text className="text-gray-700 dark:text-gray-300 text-[11px]" numberOfLines={1}>
//                     {req.reason}
//                   </Text>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         {/* 3. فلتر الشفتات */}
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
//                   selectedShift === item.id ? "text-black" : "text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* 4. قائمة السجل التاريخي للحضور */}
//         {loading ? (
//           <View className="py-16 items-center justify-center">
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
//                   {item.overtime_hours > 0 ? `${item.overtime_hours} ساعة إضافي` : "بدون إضافي"}
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
//   Alert,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Location from "expo-location";

// // إحداثيات موقع الشركة ونصف القطر المسموح (70 متر)
// const COMPANY_LOCATION = {
//   latitude: 31.421452,
//   longitude: 34.372222,
//   radiusMeters: 70,
// };

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

// interface AttendanceRequest {
//   id: string;
//   type: string;
//   date: string;
//   reason: string;
//   status: "pending" | "approved" | "rejected";
//   status_label: string;
// }

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   // حالات البيانات
//   const [selectedShift, setSelectedShift] = useState("all");
//   const [history, setHistory] = useState<AttendanceRecord[]>([]);
//   const [requests, setRequests] = useState<AttendanceRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // حالات الموقع والجغرافيا
//   const [currentDistance, setCurrentDistance] = useState<number | null>(null);
//   const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);

//   /**
//    * حساب المسافة الهندسية بوحدة المتر (Haversine Formula)
//    */
//   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//     const R = 6371000;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return Math.round(R * c);
//   };

//   /**
//    * فحص سريع لبُعد الموظف الحالي عن مقر العمل
//    */
//   const checkLocationRange = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       const distance = calculateDistance(
//         location.coords.latitude,
//         location.coords.longitude,
//         COMPANY_LOCATION.latitude,
//         COMPANY_LOCATION.longitude
//       );

//       setCurrentDistance(distance);
//       setIsWithinRange(distance <= COMPANY_LOCATION.radiusMeters);
//     } catch (err) {
//       console.log("Location verification error:", err);
//     }
//   };

//   /**
//    * جلب سجل الحضور والطلبات من السيرفر
//    */
//   const fetchAttendanceData = async () => {
//     try {
//       setError(null);

//       const [historyRes, requestsRes] = await Promise.allSettled([
//         api.get("/attendance/history"),
//         api.get("/attendance/requests"),
//       ]);

//       if (historyRes.status === "fulfilled" && historyRes.value.data?.history) {
//         setHistory(historyRes.value.data.history);
//       }

//       if (requestsRes.status === "fulfilled" && requestsRes.value.data?.requests) {
//         setRequests(requestsRes.value.data.requests);
//       }

//       await checkLocationRange();
//     } catch (err) {
//       console.error("Error fetching attendance data:", err);
//       setError("حدث خطأ أثناء تحميل بيانات الحضور");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchAttendanceData();
//   };

//   /**
//    * تنفيذ طلب الحضور أو الانصراف
//    */
//   const executeAttendanceAction = async (type: "check-in" | "check-out") => {
//     try {
//       setActionLoading(true);

//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("تنبيه", "يرجى منح صلاحية تحديد الموقع لتسجيل الحضور");
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Highest,
//       });

//       // كشف Fake GPS على الأندرويد
//       if (Platform.OS === "android" && location.mocked) {
//         Alert.alert("تنبيه أمني", "تم رصد استخدام تطبيق لتزييف الموقع الجغرافي");
//         return;
//       }

//       const distance = calculateDistance(
//         location.coords.latitude,
//         location.coords.longitude,
//         COMPANY_LOCATION.latitude,
//         COMPANY_LOCATION.longitude
//       );

//       setCurrentDistance(distance);

//       if (distance > COMPANY_LOCATION.radiusMeters) {
//         setIsWithinRange(false);
//         Alert.alert(
//           "خارج نطاق العمل",
//           `أنت تبعد ${distance} متر عن المقر. يلزم التواجد ضمن مسافة ${COMPANY_LOCATION.radiusMeters} متر.`
//         );
//         return;
//       }

//       setIsWithinRange(true);

//       // إرسال الإحداثيات للمطابقة بالسيرفر
//       const response = await api.post(`/attendance/${type}`, {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         distance_meters: distance,
//       });

//       Alert.alert(
//         "تم بنجاح",
//         response.data?.message || (type === "check-in" ? "تم تسجيل حضورك بنجاح" : "تم تسجيل انصرافك بنجاح")
//       );

//       fetchAttendanceData();
//     } catch (err: any) {
//       console.error("Attendance action error:", err);
//       Alert.alert("خطأ", err.response?.data?.message || "حدث خطأ أثناء الاتصال بالسيرفر");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   /**
//    * تأكيد الإجراء مع المستخدم قبل التنفيذ
//    */
//   const handleAttendanceAction = (type: "check-in" | "check-out") => {
//     const title = type === "check-in" ? "تأكيد تسجيل الحضور" : "تأكيد تسجيل الانصراف";
//     const message = type === "check-in" 
//       ? "هل أنت متأكد من تسجيل حضورك الآن من الموقع الحالي؟" 
//       : "هل أنت متأكد من تسجيل انصرافك الآن؟";

//     Alert.alert(title, message, [
//       { text: "إلغاء", style: "cancel" },
//       { text: "تأكيد", onPress: () => executeAttendanceAction(type) },
//     ]);
//   };

//   const filteredHistory = history.filter((item) => {
//     if (selectedShift === "all") return true;
//     return item.shift_key === selectedShift;
//   });

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

//       <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

//       <ScrollView
//         className="px-5 pt-4"
//         showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C09A3E" />}
//       >
//         {/* 1. كارت تسجيل الحضور والانصراف الجغرافي */}
//         <View className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-5 shadow-sm">
//           <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 mb-3">
//             <View className="flex-row items-center gap-2">
//               <View className="w-8 h-8 rounded-xl bg-[#C09A3E]/10 items-center justify-center">
//                 <Ionicons name="location-sharp" size={18} color="#C09A3E" />
//               </View>
//               <Text className="text-gray-900 dark:text-white font-extrabold text-sm">
//                 التبصيم الذاتي باللوكيشن
//               </Text>
//             </View>

//             <View
//               className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
//                 isWithinRange === true
//                   ? "bg-emerald-500/10 border border-emerald-500/30"
//                   : isWithinRange === false
//                   ? "bg-red-500/10 border border-red-500/30"
//                   : "bg-amber-500/10 border border-amber-500/30"
//               }`}
//             >
//               <Text
//                 className={`text-[10px] font-bold ${
//                   isWithinRange === true
//                     ? "text-emerald-600 dark:text-emerald-400"
//                     : isWithinRange === false
//                     ? "text-red-500 dark:text-red-400"
//                     : "text-amber-600 dark:text-amber-400"
//                 }`}
//               >
//                 {isWithinRange === true
//                   ? "داخل المقر"
//                   : isWithinRange === false
//                   ? "خارج المقر"
//                   : "جاري الفحص..."}
//               </Text>
//             </View>
//           </View>

//           <Text className="text-gray-500 dark:text-gray-400 text-xs text-right mb-4 leading-5">
//             المسافة الحالية:{" "}
//             <Text className="text-gray-800 dark:text-gray-200 font-bold">
//               {currentDistance !== null ? `${currentDistance} متر` : "جاري التحديد..."}
//             </Text>{" "}
//             (النطاق المسموح: 70 متر)
//           </Text>

//           {actionLoading ? (
//             <ActivityIndicator size="small" color="#C09A3E" className="py-3" />
//           ) : (
//             <View className="flex-row gap-2">
//               <TouchableOpacity
//                 onPress={() => handleAttendanceAction("check-in")}
//                 activeOpacity={0.8}
//                 className="flex-1 bg-[#C09A3E] h-11 rounded-xl flex-row items-center justify-center gap-2"
//               >
//                 <Ionicons name="log-in-outline" size={18} color="#000" />
//                 <Text className="text-black font-extrabold text-xs">تسجيل حضور</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => handleAttendanceAction("check-out")}
//                 activeOpacity={0.8}
//                 className="flex-1 bg-gray-200 dark:bg-white/10 h-11 rounded-xl flex-row items-center justify-center gap-2"
//               >
//                 <Ionicons name="log-out-outline" size={18} color={isDark ? "#FFF" : "#000"} />
//                 <Text className="text-gray-900 dark:text-white font-extrabold text-xs">
//                   تسجيل انصراف
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* 2. قسم متابعة طلبات المراجعة والاستئذان */}
//         {requests.length > 0 && (
//           <View className="mb-5">
//             <Text className="text-xs font-black text-gray-500 dark:text-gray-400 mb-2 text-right">
//               حالة طلبات المراجعة والاستئذان
//             </Text>

//             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
//               {requests.map((req) => (
//                 <View
//                   key={req.id}
//                   className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl p-3 w-56 mr-2"
//                 >
//                   <View className="flex-row items-center justify-between mb-2">
//                     <Text className="text-gray-900 dark:text-white font-bold text-xs">
//                       {req.type}
//                     </Text>
//                     <View
//                       className={`px-2 py-0.5 rounded-md ${
//                         req.status === "approved"
//                           ? "bg-emerald-500/10 border border-emerald-500/30"
//                           : req.status === "rejected"
//                           ? "bg-red-500/10 border border-red-500/30"
//                           : "bg-amber-500/10 border border-amber-500/30"
//                       }`}
//                     >
//                       <Text
//                         className={`text-[10px] font-bold ${
//                           req.status === "approved"
//                             ? "text-emerald-600 dark:text-emerald-400"
//                             : req.status === "rejected"
//                             ? "text-red-500 dark:text-red-400"
//                             : "text-amber-600 dark:text-amber-400"
//                         }`}
//                       >
//                         {req.status_label || req.status}
//                       </Text>
//                     </View>
//                   </View>
//                   <Text className="text-gray-500 dark:text-gray-400 text-[10px] mb-1">
//                     تاريخ الطلب: {req.date}
//                   </Text>
//                   <Text className="text-gray-700 dark:text-gray-300 text-[11px]" numberOfLines={1}>
//                     {req.reason}
//                   </Text>
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         {/* 3. فلتر الشفتات */}
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
//                   selectedShift === item.id ? "text-black" : "text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* 4. قائمة السجل التاريخي */}
//         {loading ? (
//           <View className="py-16 items-center justify-center">
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
//                   {item.overtime_hours > 0 ? `${item.overtime_hours} ساعة إضافي` : "بدون إضافي"}
//                 </Text>
//               </View>
//             </View>
//           ))
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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

interface AttendanceRecord {
  id: string;
  attendance_id: number;
  date_formatted: string;
  raw_date: string;
  shift_key: string;
  shift_type: string;
  status: string;
  status_class: "approved" | "pending" | "rejected" | "absent" | string;
  base_hours: number;
  overtime_hours: number;
  latitude?: number;
  longitude?: number;
}

export default function AttendanceScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // State Management
  const [selectedShift, setSelectedShift] = useState("all");
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  // Check-in action state
  const [checkInShift, setCheckInShift] = useState<"day" | "night">("day");
  const [actionLoading, setActionLoading] = useState(false);

  // General screen state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceHistory = async () => {
    try {
      setError(null);
      const response = await api.get("/attendance/history");
      const data = response.data;

      if (data && data.history) {
        setHistory(data.history);

        const todayStr = new Date().toISOString().split("T")[0];
        const todayItem = data.history.find(
          (item: AttendanceRecord) => item.raw_date === todayStr
        );
        setTodayRecord(todayItem || null);
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

  const handleSendLocation = async (actionType: "check-in" | "check-out") => {
    try {
      setActionLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "تنبيه",
          "يرجى السماح بالوصول للموقع الجغرافي لتسجيل الحضور."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const todayDate = new Date().toISOString().split("T")[0];

      const payload = {
        action_type: actionType,
        shift_key: checkInShift,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        date: todayDate,
      };

      const response = await api.post("/attendance/submit", payload);

      Alert.alert(
        "تم الإرسال بنجاح",
        response.data?.message ||
          "تم إرسال إحداثيات موقعك ونوع الشفت بنجاح، وطلبك قيد المراجعة اليدوية."
      );

      fetchAttendanceHistory();
    } catch (err: any) {
      console.error("Error submitting attendance:", err);
      Alert.alert(
        "خطأ",
        err.response?.data?.message || "تعذر إرسال موقع الحضور، حاول مرة أخرى."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (selectedShift === "all") return true;
    return item.shift_key === selectedShift;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScreenHeader title="سجل الحضور والدوام" iconName="calendar-outline" />

      <ScrollView
        className="px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C09A3E"
          />
        }
      >
        {/* ========================================================= */}
        {/* CARD CONTAINER                                           */}
        {/* ========================================================= */}
        <View className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-3xl p-5 mb-6 shadow-sm">
          
          {/* Card Header */}
          <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-white/5">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-2xl bg-[#C09A3E]/10 items-center justify-center border border-[#C09A3E]/20">
                <Ionicons name="location-sharp" size={20} color="#C09A3E" />
              </View>
              <View>
                <Text className="text-gray-900 dark:text-white font-black text-base">
                  تسجيل الحضور الميداني
                </Text>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  <View className="w-2 h-2 rounded-full bg-emerald-500" />
                  <Text className="text-gray-400 dark:text-gray-400 text-[11px] font-bold">
                    جاهز لالتقاط الموقع GPS
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-white/10">
              <Text className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {new Date().toLocaleDateString("ar-EG", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          </View>

          {/* Today's Record Status */}
          {todayRecord && (
            <View
              className={`p-3.5 rounded-2xl mb-5 border flex-row items-center justify-between ${
                todayRecord.status_class === "approved"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : todayRecord.status_class === "pending"
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <View className="flex-row items-center gap-2.5">
                <Ionicons
                  name={
                    todayRecord.status_class === "approved"
                      ? "checkmark-circle"
                      : todayRecord.status_class === "pending"
                      ? "time"
                      : "close-circle"
                  }
                  size={20}
                  color={
                    todayRecord.status_class === "approved"
                      ? "#10B981"
                      : todayRecord.status_class === "pending"
                      ? "#F59E0B"
                      : "#EF4444"
                  }
                />
                <Text
                  className={`text-xs font-extrabold ${
                    todayRecord.status_class === "approved"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : todayRecord.status_class === "pending"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  حالة اليوم: {todayRecord.status}
                </Text>
              </View>

              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {todayRecord.shift_type}
              </Text>
            </View>
          )}

          {/* Shift Selector */}
          <Text className="text-gray-500 dark:text-gray-400 text-xs font-extrabold mb-2">
            اختر شفت الدوام الحالي:
          </Text>

          <View className="bg-gray-100 dark:bg-white/5 p-1 rounded-2xl flex-row gap-1 mb-5 border border-gray-200/50 dark:border-white/5">
            {/* Day Shift Button */}
            <TouchableOpacity
              onPress={() => setCheckInShift("day")}
              activeOpacity={0.8}
              style={{
                backgroundColor: checkInShift === "day" ? "#C09A3E" : "transparent",
              }}
              className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Ionicons
                name="sunny"
                size={16}
                color={checkInShift === "day" ? "#000000" : isDark ? "#A1A1AA" : "#71717A"}
              />
              <Text
                style={{
                  color: checkInShift === "day" ? "#000000" : isDark ? "#A1A1AA" : "#4B5563",
                }}
                className="text-xs font-extrabold"
              >
                شفت نهار
              </Text>
            </TouchableOpacity>

            {/* Night Shift Button */}
            <TouchableOpacity
              onPress={() => setCheckInShift("night")}
              activeOpacity={0.8}
              style={{
                backgroundColor: checkInShift === "night" ? "#C09A3E" : "transparent",
              }}
              className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2"
            >
              <Ionicons
                name="moon"
                size={15}
                color={checkInShift === "night" ? "#000000" : isDark ? "#A1A1AA" : "#71717A"}
              />
              <Text
                style={{
                  color: checkInShift === "night" ? "#000000" : isDark ? "#A1A1AA" : "#4B5563",
                }}
                className="text-xs font-extrabold"
              >
                شفت ليل
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          {actionLoading ? (
            <View className="py-3 items-center justify-center">
              <ActivityIndicator size="small" color="#C09A3E" />
            </View>
          ) : (
            <View className="flex-row gap-2.5">
              <TouchableOpacity
                onPress={() => handleSendLocation("check-in")}
                activeOpacity={0.8}
                className="flex-1 bg-[#C09A3E] h-12 rounded-2xl flex-row items-center justify-center gap-2"
              >
                <Ionicons name="navigate" size={18} color="#000" />
                <Text className="text-black font-black text-xs">
                  إرسال موقع الحضور
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => handleSendLocation("check-out")}
                activeOpacity={0.8}
                className="flex-1 bg-gray-200 dark:bg-white/10 h-12 rounded-2xl flex-row items-center justify-center gap-2"
              >
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={isDark ? "#FFF" : "#000"}
                />
                <Text className="text-gray-900 dark:text-white font-black text-xs">
                  إرسال موقع الانصراف
                </Text>
              </TouchableOpacity> */}
            </View>
          )}
        </View>

        {/* ========================================================= */}
        {/* ATTENDANCE HISTORY SECTION                                */}
        {/* ========================================================= */}
        <Text className="text-xs font-black text-gray-500 dark:text-gray-400 mb-3">
          سجل الحضور السابق
        </Text>

        <View className="flex-row gap-2 mb-4">
          {[
            { id: "all", label: "الكل" },
            { id: "day", label: "شفت نهار ☀️" },
            { id: "night", label: "شفت ليل 🌙" },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedShift(item.id)}
              style={{
                backgroundColor: selectedShift === item.id ? "#C09A3E" : undefined,
              }}
              className={`px-4 py-2 rounded-xl border ${
                selectedShift === item.id
                  ? "border-[#C09A3E]"
                  : "bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10"
              }`}
            >
              <Text
                style={{
                  color: selectedShift === item.id ? "#000000" : undefined,
                }}
                className={`text-xs font-bold ${
                  selectedShift === item.id
                    ? ""
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
                    item.status_class === "absent" ||
                    item.status_class === "rejected"
                      ? "bg-red-500/10 border border-red-500/30"
                      : item.status_class === "pending"
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "bg-emerald-500/10 border border-emerald-500/30"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      item.status_class === "absent" ||
                      item.status_class === "rejected"
                        ? "text-red-500 dark:text-red-400"
                        : item.status_class === "pending"
                        ? "text-amber-600 dark:text-amber-400"
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