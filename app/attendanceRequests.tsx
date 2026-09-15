
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Location from "expo-location";

// // Interface matching your /api/requests response structure
// interface AttendanceRequest {
//   id: number;
//   employee_id: number;
//   date: string; // "YYYY-MM-DD"
//   shift: "day" | "night";
//   status: "approved" | "pending" | "rejected" | string;
//   latitude: number;
//   longitude: number;
//   location_address?: string | null;
//   notes?: string | null;
//   action_by?: number | null;
//   action_at?: string | null;
//   created_at: string;
//   updated_at: string;
// }

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   // Data States
//   const [requests, setRequests] = useState<AttendanceRequest[]>([]);
//   const [selectedShift, setSelectedShift] = useState<"day" | "night">("day");

//   // Loading & Refresh States
//   const [loadingRequests, setLoadingRequests] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // Today ISO Date string (YYYY-MM-DD)
//   const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

//   // 1. Fetch Requests Data
//   const fetchRequests = useCallback(async () => {
//     try {
//       const response = await api.get(
//         "https://egypt.mahmoudalbatran.com/api/requests",
//         {
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       let fetchedData: AttendanceRequest[] = [];
//       if (Array.isArray(response.data)) {
//         fetchedData = response.data;
//       } else if (response.data?.data && Array.isArray(response.data.data)) {
//         fetchedData = response.data.data;
//       }

//       // Sort requests descending by date/time
//       fetchedData.sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       );

//       setRequests(fetchedData);
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//     } finally {
//       setLoadingRequests(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchRequests();
//   };

//   // 2. Compute Today's Shift Statuses
//   const todayDayShiftRequest = useMemo(
//     () =>
//       requests.find((r) => r.date === todayStr && r.shift === "day") || null,
//     [requests, todayStr]
//   );

//   const todayNightShiftRequest = useMemo(
//     () =>
//       requests.find((r) => r.date === todayStr && r.shift === "night") || null,
//     [requests, todayStr]
//   );

//   // Selected shift request state
//   const activeShiftRequest =
//     selectedShift === "day" ? todayDayShiftRequest : todayNightShiftRequest;
//   const isSelectedShiftSubmitted = Boolean(activeShiftRequest);

//   // 3. Last 5 Days Aggregated List for Horizontal View
//   const lastFiveDays = useMemo(() => {
//     const daysMap = new Map<string, AttendanceRequest[]>();

//     // Group requests by date
//     requests.forEach((req) => {
//       const existing = daysMap.get(req.date) || [];
//       daysMap.set(req.date, [...existing, req]);
//     });

//     // Generate last 5 dates list
//     const datesList: { date: string; items: AttendanceRequest[] }[] = [];
//     for (let i = 0; i < 5; i++) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       const dateKey = d.toISOString().split("T")[0];
//       datesList.push({
//         date: dateKey,
//         items: daysMap.get(dateKey) || [],
//       });
//     }

//     return datesList;
//   }, [requests]);

//   // 4. Submit Attendance Execution
//   const handleSendLocation = async () => {
//     if (isSelectedShiftSubmitted) {
//       Alert.alert(
//         "تنبيه",
//         `لقد قمت بتسجيل حضور ${
//           selectedShift === "day" ? "شفت النهار" : "شفت الليل"
//         } اليوم بالفعل.`
//       );
//       return;
//     }

//     Alert.alert(
//       "تأكيد الإرسال",
//       "سيتم إرسال موقعك الجغرافي الحالي واعتماده لهذا الشفت. لن تتمكن من تعديل الطلب بعد ذلك.",
//       [
//         { text: "إلغاء", style: "cancel" },
//         {
//           text: "تأكيد وإرسال",
//           onPress: async () => {
//             try {
//               setActionLoading(true);

//               const { status } =
//                 await Location.requestForegroundPermissionsAsync();
//               if (status !== "granted") {
//                 Alert.alert(
//                   "تنبيه",
//                   "يرجى السماح بالوصول للموقع الجغرافي لتسجيل الحضور."
//                 );
//                 return;
//               }

//               const location = await Location.getCurrentPositionAsync({
//                 accuracy: Location.Accuracy.High,
//               });

//               // Safe Reverse Geocoding
//               let locationAddress = "";
//               try {
//                 const geocodePromise = Location.reverseGeocodeAsync({
//                   latitude: location.coords.latitude,
//                   longitude: location.coords.longitude,
//                 });
//                 const timeoutPromise = new Promise((_, reject) =>
//                   setTimeout(() => reject(new Error("Timeout")), 2500)
//                 );

//                 const geocodeResult = (await Promise.race([
//                   geocodePromise,
//                   timeoutPromise,
//                 ])) as Location.LocationGeocodedAddress[];

//                 if (geocodeResult && geocodeResult.length > 0) {
//                   const g = geocodeResult[0];
//                   locationAddress =
//                     g.district || g.city || g.subregion || g.street || "";
//                 }
//               } catch (e) {
//                 console.warn("Geocode skipped/timed out");
//               }

//               const formData = new FormData();
//               formData.append("shift", selectedShift);
//               formData.append("latitude", String(location.coords.latitude));
//               formData.append("longitude", String(location.coords.longitude));
//               if (locationAddress) {
//                 formData.append("location_address", locationAddress);
//               }

//               const response = await api.post(
//                 "https://egypt.mahmoudalbatran.com/api/v1/employee/attendance/submit",
//                 formData,
//                 {
//                   headers: { "Content-Type": "multipart/form-data" },
//                 }
//               );

//               Alert.alert(
//                 "تم الإرسال بنجاح",
//                 response.data?.message || "تم تسجيل طلب الحضور بنجاح."
//               );

//               fetchRequests();
//             } catch (err: any) {
//               console.error("Submission error:", err);
//               Alert.alert(
//                 "خطأ",
//                 err.response?.data?.message ||
//                   "تعذر إرسال طلب الحضور، يرجى المحاولة لاحقاً."
//               );
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   // Status Color Helper
//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "approved":
//         return {
//           bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
//           border: "border-emerald-500/30",
//           text: "text-emerald-600 dark:text-emerald-400",
//           label: "مقبول",
//           icon: "checkmark-circle-sharp",
//           color: "#10B981",
//         };
//       case "rejected":
//         return {
//           bg: "bg-rose-500/10 dark:bg-rose-500/20",
//           border: "border-rose-500/30",
//           text: "text-rose-600 dark:text-rose-400",
//           label: "مرفوض",
//           icon: "close-circle-sharp",
//           color: "#F43F5E",
//         };
//       default:
//         return {
//           bg: "bg-amber-500/10 dark:bg-amber-500/20",
//           border: "border-amber-500/30",
//           text: "text-amber-600 dark:text-amber-400",
//           label: "قيد الانتظار",
//           icon: "time-sharp",
//           color: "#F59E0B",
//         };
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0C0C0E]">
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

//       <ScreenHeader title="نظام الحضور الذكي" iconName="location-outline" />

//       <ScrollView
//         className="flex-1 px-4 pt-3"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#C09A3E"
//           />
//         }
//       >




//         {/* ========================================================= */}
//         {/* SECTION 2: TODAY'S SHIFTS OVERVIEW (BIG RECTANGLES)       */}
//         {/* ========================================================= */}
//         <Text className="text-gray-900 dark:text-gray-100 font-black text-sm mb-3 px-1">
//           شفتات اليوم ({todayStr})
//         </Text>

//         <View className="flex-row gap-3 mb-6">
//           {/* Day Shift Card */}
//           <View
//             className={`flex-1 p-4 rounded-3xl border ${
//               todayDayShiftRequest
//                 ? "bg-white dark:bg-[#161619] border-emerald-500/40"
//                 : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
//             } shadow-sm justify-between min-h-[140px]`}
//           >
//             <View className="flex-row items-center justify-between mb-2">
//               <View className="w-9 h-9 rounded-2xl bg-amber-500/10 items-center justify-center border border-amber-500/20">
//                 <Ionicons name="sunny" size={20} color="#F59E0B" />
//               </View>
//               {todayDayShiftRequest ? (
//                 <View className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
//                   <Text className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
//                     تم الإرسال
//                   </Text>
//                 </View>
//               ) : (
//                 <View className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
//                   <Text className="text-[10px] font-bold text-gray-400">متاح</Text>
//                 </View>
//               )}
//             </View>

//             <View>
//               <Text className="text-gray-900 dark:text-white font-black text-sm">
//                 شفت النهار
//               </Text>
//               {todayDayShiftRequest ? (
//                 <View className="mt-1">
//                   <Text className="text-gray-400 text-[11px] font-bold">
//                     الوقت:{" "}
//                     {new Date(todayDayShiftRequest.created_at).toLocaleTimeString(
//                       "ar-EG",
//                       { hour: "2-digit", minute: "2-digit", hour12: true }
//                     )}
//                   </Text>
//                   <Text
//                     className={`text-[11px] font-black mt-0.5 ${
//                       getStatusBadge(todayDayShiftRequest.status).text
//                     }`}
//                   >
//                     الحالة: {getStatusBadge(todayDayShiftRequest.status).label}
//                   </Text>
//                 </View>
//               ) : (
//                 <Text className="text-gray-400 text-[11px] font-bold mt-1">
//                   لم يتم الإرسال بعد
//                 </Text>
//               )}
//             </View>
//           </View>

//           {/* Night Shift Card */}
//           <View
//             className={`flex-1 p-4 rounded-3xl border ${
//               todayNightShiftRequest
//                 ? "bg-white dark:bg-[#161619] border-indigo-500/40"
//                 : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
//             } shadow-sm justify-between min-h-[140px]`}
//           >
//             <View className="flex-row items-center justify-between mb-2">
//               <View className="w-9 h-9 rounded-2xl bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
//                 <Ionicons name="moon" size={18} color="#6366F1" />
//               </View>
//               {todayNightShiftRequest ? (
//                 <View className="bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
//                   <Text className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
//                     تم الإرسال
//                   </Text>
//                 </View>
//               ) : (
//                 <View className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
//                   <Text className="text-[10px] font-bold text-gray-400">متاح</Text>
//                 </View>
//               )}
//             </View>

//             <View>
//               <Text className="text-gray-900 dark:text-white font-black text-sm">
//                 شفت الليل
//               </Text>
//               {todayNightShiftRequest ? (
//                 <View className="mt-1">
//                   <Text className="text-gray-400 text-[11px] font-bold">
//                     الوقت:{" "}
//                     {new Date(todayNightShiftRequest.created_at).toLocaleTimeString(
//                       "ar-EG",
//                       { hour: "2-digit", minute: "2-digit", hour12: true }
//                     )}
//                   </Text>
//                   <Text
//                     className={`text-[11px] font-black mt-0.5 ${
//                       getStatusBadge(todayNightShiftRequest.status).text
//                     }`}
//                   >
//                     الحالة: {getStatusBadge(todayNightShiftRequest.status).label}
//                   </Text>
//                 </View>
//               ) : (
//                 <Text className="text-gray-400 text-[11px] font-bold mt-1">
//                   لم يتم الإرسال بعد
//                 </Text>
//               )}
//             </View>
//           </View>
//         </View>



        
//         {/* ========================================================= */}
//         {/* SECTION 1: 5-DAY HORIZONTAL TRACKER                        */}
//         {/* ========================================================= */}
//         <View className="mb-6">
//           <View className="flex-row items-center justify-between mb-3 px-1">
//             <Text className="text-gray-900 dark:text-gray-100 font-black text-sm tracking-wide">
//               سجل الـ 5 أيام الأخيرة
//             </Text>
//             <View className="flex-row items-center gap-1">
//               <View className="w-1.5 h-1.5 rounded-full bg-[#C09A3E]" />
//               <Text className="text-gray-400 text-[11px] font-bold">تحديث مباشر</Text>
//             </View>
//           </View>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             className="flex-row gap-3 py-1"
//           >
//             {lastFiveDays.map((dayData) => {
//               const dayDateObj = new Date(dayData.date);
//               const isToday = dayData.date === todayStr;
//               const dayName = dayDateObj.toLocaleDateString("ar-EG", {
//                 weekday: "short",
//               });
//               const dateFormatted = dayDateObj.toLocaleDateString("ar-EG", {
//                 day: "numeric",
//                 month: "short",
//               });

//               return (
//                 <View
//                   key={dayData.date}
//                   className={`w-36 p-5 mx-1 rounded-2xl border ${
//                     isToday
//                       ? "bg-[#C09A3E]/5 border-[#C09A3E]/40"
//                       : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/5"
//                   } justify-between shadow-sm`}
//                 >
//                   {/* Header Date */}
//                   <View className="flex-row justify-between items-center mb-2 pb-2 border-b border-gray-100 dark:border-white/5">
//                     <Text
//                       className={`text-xs font-black ${
//                         isToday ? "text-[#C09A3E]" : "text-gray-800 dark:text-gray-200"
//                       }`}
//                     >
//                       {isToday ? "اليوم" : dayName}
//                     </Text>
//                     <Text className="text-[10px] font-bold text-gray-400">
//                       {dateFormatted}
//                     </Text>
//                   </View>

//                   {/* Day Shifts Statuses */}
//                   {dayData.items.length === 0 ? (
//                     <View className="py-2 items-center">
//                       <Text className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
//                         بدون تسجيل
//                       </Text>
//                     </View>
//                   ) : (
//                     <View className="gap-1.5">
//                       {dayData.items.map((req) => {
//                         const badge = getStatusBadge(req.status);
//                         const timeStr = new Date(req.created_at).toLocaleTimeString(
//                           "ar-EG",
//                           { hour: "2-digit", minute: "2-digit", hour12: true }
//                         );

//                         return (
//                           <View
//                             key={req.id}
//                             className={`p-1.5 rounded-xl border flex-row items-center justify-between ${badge.bg} ${badge.border}`}
//                           >
//                             <View className="flex-row items-center gap-1">
//                               <Ionicons
//                                 name={req.shift === "day" ? "sunny" : "moon"}
//                                 size={12}
//                                 color={badge.color}
//                               />
//                               <Text className="text-[10px] font-black text-gray-800 dark:text-gray-200">
//                                 {req.shift === "day" ? "نهار" : "ليل"}
//                               </Text>
//                             </View>

//                             <Text className={`text-[9px] font-extrabold ${badge.text}`}>
//                               {timeStr}
//                             </Text>
//                           </View>
//                         );
//                       })}
//                     </View>
//                   )}
//                 </View>
//               );
//             })}
//           </ScrollView>
//         </View>

        

//         {/* ========================================================= */}
//         {/* SECTION 3: SUBMISSION FORM                                */}
//         {/* ========================================================= */}
//         <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-5 mb-8 shadow-sm relative overflow-hidden">
//           {/* Top Decorative accent line */}
//           <View className="absolute top-0 left-0 right-0 h-1 bg-[#C09A3E]" />

//           <View className="flex-row items-center gap-3 mb-4">
//             <View className="w-10 h-10 rounded-2xl bg-[#C09A3E]/10 items-center justify-center border border-[#C09A3E]/30">
//               <Ionicons name="navigate-sharp" size={20} color="#C09A3E" />
//             </View>
//             <View>
//               <Text className="text-gray-900 dark:text-white font-black text-base">
//                 إرسال الحضور الميداني
//               </Text>
//               <Text className="text-gray-400 text-[11px] font-bold mt-0.5">
//                 حدد الشفت المراد تسجيله حالياً
//               </Text>
//             </View>
//           </View>

//           {/* Shift Selector Pills */}
//           <View className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl flex-row gap-2 mb-5 border border-gray-200/50 dark:border-white/5">
//             {/* Day Shift Button */}
//             <TouchableOpacity
//               onPress={() => setSelectedShift("day")}
//               activeOpacity={0.8}
//               style={{
//                 backgroundColor:
//                   selectedShift === "day" ? "#C09A3E" : "transparent",
//               }}
//               className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
//             >
//               <Ionicons
//                 name="sunny"
//                 size={16}
//                 color={
//                   selectedShift === "day"
//                     ? "#000"
//                     : isDark
//                     ? "#A1A1AA"
//                     : "#71717A"
//                 }
//               />
//               <Text
//                 style={{
//                   color:
//                     selectedShift === "day"
//                       ? "#000"
//                       : isDark
//                       ? "#A1A1AA"
//                       : "#4B5563",
//                 }}
//                 className="text-xs font-black"
//               >
//                 شفت نهار {todayDayShiftRequest && "(مُسجّل)"}
//               </Text>
//             </TouchableOpacity>

//             {/* Night Shift Button */}
//             <TouchableOpacity
//               onPress={() => setSelectedShift("night")}
//               activeOpacity={0.8}
//               style={{
//                 backgroundColor:
//                   selectedShift === "night" ? "#C09A3E" : "transparent",
//               }}
//               className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
//             >
//               <Ionicons
//                 name="moon"
//                 size={15}
//                 color={
//                   selectedShift === "night"
//                     ? "#000"
//                     : isDark
//                     ? "#A1A1AA"
//                     : "#71717A"
//                 }
//               />
//               <Text
//                 style={{
//                   color:
//                     selectedShift === "night"
//                       ? "#000"
//                       : isDark
//                       ? "#A1A1AA"
//                       : "#4B5563",
//                 }}
//                 className="text-xs font-black"
//               >
//                 شفت ليل {todayNightShiftRequest && "(مُسجّل)"}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Action Button */}
//           {actionLoading ? (
//             <View className="py-3.5 bg-[#C09A3E]/20 rounded-2xl items-center justify-center flex-row gap-2">
//               <ActivityIndicator size="small" color="#C09A3E" />
//               <Text className="text-[#C09A3E] font-extrabold text-xs">
//                 جاري إرسال الإحداثيات...
//               </Text>
//             </View>
//           ) : isSelectedShiftSubmitted ? (
//             <View className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 h-13 rounded-2xl flex-row items-center justify-center gap-2">
//               <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
//               <Text className="text-gray-400 font-bold text-xs">
//                 تم تسجيل حضور هذا الشفت لهذا اليوم
//               </Text>
//             </View>
//           ) : (
//             <TouchableOpacity
//               onPress={handleSendLocation}
//               activeOpacity={0.85}
//               className="bg-[#C09A3E] h-13 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
//             >
//               <Ionicons name="location-sharp" size={20} color="#000" />
//               <Text className="text-black font-black text-xs">
//                 إرسال الحضور الآن
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }


















import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ScrollView, StatusBar, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";

import {
  LastFiveDaysTracker,
  AttendanceRequest,
} from "@/components/attendance/LastFiveDaysTracker";
import { TodayShiftsCard } from "@/components/attendance/TodayShiftsCard";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";

export default function AttendanceScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  const [selectedShift, setSelectedShift] = useState<"day" | "night">("day");
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Fetch Requests
  const fetchRequests = useCallback(async () => {
    try {
      const response = await api.get(
        "https://egypt.mahmoudalbatran.com/api/requests",
        { headers: { Accept: "application/json" } }
      );

      let fetchedData: AttendanceRequest[] = [];
      if (Array.isArray(response.data)) {
        fetchedData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        fetchedData = response.data.data;
      }

      fetchedData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setRequests(fetchedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  // Today shift computations
  const todayDayShiftRequest = useMemo(
    () => requests.find((r) => r.date === todayStr && r.shift === "day") || null,
    [requests, todayStr]
  );

  const todayNightShiftRequest = useMemo(
    () => requests.find((r) => r.date === todayStr && r.shift === "night") || null,
    [requests, todayStr]
  );

  const activeShiftRequest =
    selectedShift === "day" ? todayDayShiftRequest : todayNightShiftRequest;
  const isSelectedShiftSubmitted = Boolean(activeShiftRequest);

  // 5-day computed list
  const lastFiveDays = useMemo(() => {
    const daysMap = new Map<string, AttendanceRequest[]>();
    requests.forEach((req) => {
      const existing = daysMap.get(req.date) || [];
      daysMap.set(req.date, [...existing, req]);
    });

    const datesList: { date: string; items: AttendanceRequest[] }[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      datesList.push({ date: dateKey, items: daysMap.get(dateKey) || [] });
    }
    return datesList;
  }, [requests]);

  // Submit Handler
  const handleSendLocation = async () => {
    if (isSelectedShiftSubmitted) return;

    Alert.alert(
      "تأكيد الإرسال",
      "سيتم إرسال موقعك الجغرافي الحالي واعتماده لهذا الشفت.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تأكيد وإرسال",
          onPress: async () => {
            try {
              setActionLoading(true);

              const { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                Alert.alert("تنبيه", "يرجى السماح بالوصول للموقع الجغرافي.");
                return;
              }

              const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
              });

              let locationAddress = "";
              try {
                const geocodePromise = Location.reverseGeocodeAsync({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Timeout")), 2500)
                );

                const geocodeResult = (await Promise.race([
                  geocodePromise,
                  timeoutPromise,
                ])) as Location.LocationGeocodedAddress[];

                if (geocodeResult && geocodeResult.length > 0) {
                  const g = geocodeResult[0];
                  locationAddress =
                    g.district || g.city || g.subregion || g.street || "";
                }
              } catch (e) {
                console.warn("Geocode skipped/timed out");
              }

              const formData = new FormData();
              formData.append("shift", selectedShift);
              formData.append("latitude", String(location.coords.latitude));
              formData.append("longitude", String(location.coords.longitude));
              if (locationAddress) {
                formData.append("location_address", locationAddress);
              }

              const response = await api.post(
                "https://egypt.mahmoudalbatran.com/api/v1/employee/attendance/submit",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );

              Alert.alert("تم الإرسال", response.data?.message || "تم التسجيل.");
              fetchRequests();
            } catch (err: any) {
              Alert.alert("خطأ", "تعذر إرسال طلب الحضور.");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
          border: "border-emerald-500/30",
          text: "text-emerald-600 dark:text-emerald-400",
          label: "مقبول",
          color: "#10B981",
        };
      case "rejected":
        return {
          bg: "bg-rose-500/10 dark:bg-rose-500/20",
          border: "border-rose-500/30",
          text: "text-rose-600 dark:text-rose-400",
          label: "مرفوض",
          color: "#F43F5E",
        };
      default:
        return {
          bg: "bg-amber-500/10 dark:bg-amber-500/20",
          border: "border-amber-500/30",
          text: "text-amber-600 dark:text-amber-400",
          label: "قيد الانتظار",
          color: "#F59E0B",
        };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0C0C0E]">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="نظام الحضور الذكي" iconName="location-outline" />

      <ScrollView
        className="flex-1 px-4 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C09A3E"
          />
        }
      >
        <TodayShiftsCard
          todayStr={todayStr}
          todayDayShiftRequest={todayDayShiftRequest}
          todayNightShiftRequest={todayNightShiftRequest}
          getStatusBadge={getStatusBadge}
        />
        
        <LastFiveDaysTracker
          lastFiveDays={lastFiveDays}
          todayStr={todayStr}
          getStatusBadge={getStatusBadge}
        />

        

        <AttendanceForm
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
          todayDayShiftRequest={todayDayShiftRequest}
          todayNightShiftRequest={todayNightShiftRequest}
          isSelectedShiftSubmitted={isSelectedShiftSubmitted}
          actionLoading={actionLoading}
          handleSendLocation={handleSendLocation}
          isDark={isDark}
        />
      </ScrollView>
    </SafeAreaView>
  );
}