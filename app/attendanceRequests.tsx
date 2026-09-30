
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { ScrollView, StatusBar, RefreshControl, Alert } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Location from "expo-location";

// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";

// import {
//   LastFiveDaysTracker,
//   AttendanceRequest,
// } from "@/components/attendance/LastFiveDaysTracker";
// import { TodayShiftsCard } from "@/components/attendance/TodayShiftsCard";
// import { AttendanceForm } from "@/components/attendance/AttendanceForm";

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   const [requests, setRequests] = useState<AttendanceRequest[]>([]);
//   const [selectedShift, setSelectedShift] = useState<"day" | "night">("day");
//   const [actionLoading, setActionLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

//   // Fetch Requests
//   const fetchRequests = useCallback(async () => {
//     try {
//       const response = await api.get(
//         "https://egypt.mahmoudalbatran.com/api/requests",
//         { headers: { Accept: "application/json" } }
//       );

//       let fetchedData: AttendanceRequest[] = [];
//       if (Array.isArray(response.data)) {
//         fetchedData = response.data;
//       } else if (response.data?.data && Array.isArray(response.data.data)) {
//         fetchedData = response.data.data;
//       }

//       fetchedData.sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       );

//       setRequests(fetchedData);
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//     } finally {
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

//   // Today shift computations
//   const todayDayShiftRequest = useMemo(
//     () => requests.find((r) => r.date === todayStr && r.shift === "day") || null,
//     [requests, todayStr]
//   );

//   const todayNightShiftRequest = useMemo(
//     () => requests.find((r) => r.date === todayStr && r.shift === "night") || null,
//     [requests, todayStr]
//   );

//   const activeShiftRequest =
//     selectedShift === "day" ? todayDayShiftRequest : todayNightShiftRequest;
//   const isSelectedShiftSubmitted = Boolean(activeShiftRequest);

//   // 5-day computed list
//   const lastFiveDays = useMemo(() => {
//     const daysMap = new Map<string, AttendanceRequest[]>();
//     requests.forEach((req) => {
//       const existing = daysMap.get(req.date) || [];
//       daysMap.set(req.date, [...existing, req]);
//     });

//     const datesList: { date: string; items: AttendanceRequest[] }[] = [];
//     for (let i = 0; i < 5; i++) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       const dateKey = d.toISOString().split("T")[0];
//       datesList.push({ date: dateKey, items: daysMap.get(dateKey) || [] });
//     }
//     return datesList;
//   }, [requests]);

//   // Submit Handler
//   const handleSendLocation = async () => {
//     if (isSelectedShiftSubmitted) return;

//     Alert.alert(
//       "تأكيد الإرسال",
//       "سيتم إرسال موقعك الجغرافي الحالي واعتماده لهذا الشفت.",
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
//                 Alert.alert("تنبيه", "يرجى السماح بالوصول للموقع الجغرافي.");
//                 return;
//               }

//               const location = await Location.getCurrentPositionAsync({
//                 accuracy: Location.Accuracy.High,
//               });

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
//                 { headers: { "Content-Type": "multipart/form-data" } }
//               );

//               Alert.alert("تم الإرسال", response.data?.message || "تم التسجيل.");
//               fetchRequests();
//             } catch (err: any) {
//               Alert.alert("خطأ", "تعذر إرسال طلب الحضور.");
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "approved":
//         return {
//           bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
//           border: "border-emerald-500/30",
//           text: "text-emerald-600 dark:text-emerald-400",
//           label: "مقبول",
//           color: "#10B981",
//         };
//       case "rejected":
//         return {
//           bg: "bg-rose-500/10 dark:bg-rose-500/20",
//           border: "border-rose-500/30",
//           text: "text-rose-600 dark:text-rose-400",
//           label: "مرفوض",
//           color: "#F43F5E",
//         };
//       default:
//         return {
//           bg: "bg-amber-500/10 dark:bg-amber-500/20",
//           border: "border-amber-500/30",
//           text: "text-amber-600 dark:text-amber-400",
//           label: "قيد الانتظار",
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
//         <TodayShiftsCard
//           todayStr={todayStr}
//           todayDayShiftRequest={todayDayShiftRequest}
//           todayNightShiftRequest={todayNightShiftRequest}
//           getStatusBadge={getStatusBadge}
//         />
        
//         <LastFiveDaysTracker
//           lastFiveDays={lastFiveDays}
//           todayStr={todayStr}
//           getStatusBadge={getStatusBadge}
//         />

        

//         <AttendanceForm
//           selectedShift={selectedShift}
//           setSelectedShift={setSelectedShift}
//           todayDayShiftRequest={todayDayShiftRequest}
//           todayNightShiftRequest={todayNightShiftRequest}
//           isSelectedShiftSubmitted={isSelectedShiftSubmitted}
//           actionLoading={actionLoading}
//           handleSendLocation={handleSendLocation}
//           isDark={isDark}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }















// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { ScrollView, StatusBar, RefreshControl, Alert, View, Text, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Location from "expo-location";

// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";

// import {
//   LastFiveDaysTracker,
//   AttendanceRequest,
// } from "@/components/attendance/LastFiveDaysTracker";
// import { TodayShiftsCard } from "@/components/attendance/TodayShiftsCard";
// import { AttendanceForm } from "@/components/attendance/AttendanceForm";

// /**
//  * دالة لحساب التاريخ التشغيلي بناءً على قاعدة "اليوم الجديد يبدأ بعد الساعة 6:00 مساءً"
//  */
// const getLogicalDate = (dateObj: Date = new Date()): string => {
//   const d = new Date(dateObj);
//   // إذا تجاوزت الساعة 18:00 (6 مساءً)، ننتقل لتاريخ اليوم التالي
//   if (d.getHours() >= 18) {
//     d.setDate(d.getDate() + 1);
//   }
//   return d.toISOString().split("T")[0];
// };

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  
//   // اليوم التشغيلي الحالي
//   const todayStr = useMemo(() => getLogicalDate(new Date()), []);

//   // تحديد اليوم والشفت المختارين للتقديم
//   const [targetDate, setTargetDate] = useState<string>(todayStr);
//   const [selectedShift, setSelectedShift] = useState<"night" | "day">("night"); // الليل هو الشفت الأول دائماً
  
//   const [actionLoading, setActionLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // جلب الطلبات من الـ API
//   const fetchRequests = useCallback(async () => {
//     try {
//       const response = await api.get(
//         "https://egypt.mahmoudalbatran.com/api/requests",
//         { headers: { Accept: "application/json" } }
//       );

//       let fetchedData: AttendanceRequest[] = [];
//       if (Array.isArray(response.data)) {
//         fetchedData = response.data;
//       } else if (response.data?.data && Array.isArray(response.data.data)) {
//         fetchedData = response.data.data;
//       }

//       fetchedData.sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       );

//       setRequests(fetchedData);
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//     } finally {
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

//   // شفتات اليوم التشغيلي الحالي (الليلي أولاً ثم الصباحي)
//   const todayNightShiftRequest = useMemo(
//     () => requests.find((r) => r.date === todayStr && r.shift === "night") || null,
//     [requests, todayStr]
//   );

//   const todayDayShiftRequest = useMemo(
//     () => requests.find((r) => r.date === todayStr && r.shift === "day") || null,
//     [requests, todayStr]
//   );

//   // حساب الطلب المختار بناءً على اليوم والشفت المحددين حالياً
//   const activeShiftRequest = useMemo(
//     () => requests.find((r) => r.date === targetDate && r.shift === selectedShift) || null,
//     [requests, targetDate, selectedShift]
//   );

//   const isSelectedShiftSubmitted = Boolean(activeShiftRequest);

//   // حساب كشف آخر 7 أيام تشغيلية مع مراعاة قاعدة الـ 6 مساءً
//   const lastSevenDays = useMemo(() => {
//     const daysMap = new Map<string, AttendanceRequest[]>();
//     requests.forEach((req) => {
//       const existing = daysMap.get(req.date) || [];
//       daysMap.set(req.date, [...existing, req]);
//     });

//     const datesList: { date: string; items: AttendanceRequest[] }[] = [];
//     const baseDate = new Date();
//     if (baseDate.getHours() >= 18) {
//       baseDate.setDate(baseDate.getDate() + 1);
//     }

//     for (let i = 0; i < 7; i++) {
//       const d = new Date(baseDate);
//       d.setDate(d.getDate() - i);
//       const dateKey = d.toISOString().split("T")[0];
//       datesList.push({ date: dateKey, items: daysMap.get(dateKey) || [] });
//     }
//     return datesList;
//   }, [requests]);

//   // إرسال الحضور للطلب المختار
//   const handleSendLocation = async () => {
//     if (isSelectedShiftSubmitted) return;

//     const shiftText = selectedShift === "night" ? "الليل (المسائي)" : "الصباحي";

//     Alert.alert(
//       "تأكيد إرسال الحضور",
//       `سيتم إرسال موقعك الجغرافي واعتماده لشفت ${shiftText} بتاريخ ${targetDate}.`,
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
//                 Alert.alert("تنبيه", "يرجى السماح بالوصول للموقع الجغرافي.");
//                 return;
//               }

//               const location = await Location.getCurrentPositionAsync({
//                 accuracy: Location.Accuracy.High,
//               });

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
//               formData.append("date", targetDate); // إرسال التاريخ المختار
//               formData.append("latitude", String(location.coords.latitude));
//               formData.append("longitude", String(location.coords.longitude));
//               if (locationAddress) {
//                 formData.append("location_address", locationAddress);
//               }

//               const response = await api.post(
//                 "https://egypt.mahmoudalbatran.com/api/v1/employee/attendance/submit",
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//               );

//               Alert.alert("تم الإرسال", response.data?.message || "تم تسجيل الحضور بنجاح.");
//               fetchRequests();
//             } catch (err: any) {
//               Alert.alert("خطأ", "تعذر إرسال طلب الحضور.");
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "approved":
//         return {
//           bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
//           border: "border-emerald-500/30",
//           text: "text-emerald-600 dark:text-emerald-400",
//           label: "مقبول",
//           color: "#10B981",
//         };
//       case "rejected":
//         return {
//           bg: "bg-rose-500/10 dark:bg-rose-500/20",
//           border: "border-rose-500/30",
//           text: "text-rose-600 dark:text-rose-400",
//           label: "مرفوض",
//           color: "#F43F5E",
//         };
//       default:
//         return {
//           bg: "bg-amber-500/10 dark:bg-amber-500/20",
//           border: "border-amber-500/30",
//           text: "text-amber-600 dark:text-amber-400",
//           label: "قيد الانتظار",
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
//         {/* كارت شفتات اليوم (الشفت الليلي يظهر أولاً ثم الصباحي) */}
//         <TodayShiftsCard
//           todayStr={todayStr}
//           todayNightShiftRequest={todayNightShiftRequest}
//           todayDayShiftRequest={todayDayShiftRequest}
//           getStatusBadge={getStatusBadge}
//         />
        
//         {/* سجل الـ 7 أيام مع إمكانية الضغط واختيار اليوم/الشفت */}
//         <LastFiveDaysTracker
//           lastFiveDays={lastSevenDays}
//           todayStr={todayStr}
//           getStatusBadge={getStatusBadge}
//           targetDate={targetDate}
//           setTargetDate={setTargetDate}
//           selectedShift={selectedShift}
//           setSelectedShift={setSelectedShift}
//         />

//         {/* نموذج تسجيل الحضور للشفت واليوم المختار */}
//         <AttendanceForm
//           targetDate={targetDate}
//           selectedShift={selectedShift}
//           setSelectedShift={setSelectedShift}
//           isSelectedShiftSubmitted={isSelectedShiftSubmitted}
//           actionLoading={actionLoading}
//           handleSendLocation={handleSendLocation}
//           isDark={isDark}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }










// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   ScrollView,
//   StatusBar,
//   RefreshControl,
//   Alert,
//   View,
//   Text,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Location from "expo-location";

// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";

// import {
//   LastFiveDaysTracker,
//   AttendanceRequest,
// } from "@/components/attendance/LastFiveDaysTracker";
// import { TodayShiftsCard } from "@/components/attendance/TodayShiftsCard";
// import { AttendanceForm } from "@/components/attendance/AttendanceForm";

// /**
//  * Calculates the operational/logical date based on the rule:
//  * After 6:00 PM (18:00), the next operational day starts (Night Shift of tomorrow).
//  */
// const getLogicalDate = (dateObj: Date = new Date()): string => {
//   const d = new Date(dateObj);
//   if (d.getHours() >= 18) {
//     d.setDate(d.getDate() + 1);
//   }
//   return d.toISOString().split("T")[0];
// };

// export default function AttendanceScreen() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   const [requests, setRequests] = useState<AttendanceRequest[]>([]);

//   // Operational today date
//   const todayStr = useMemo(() => getLogicalDate(new Date()), []);

//   // Currently selected date & shift for submission
//   const [targetDate, setTargetDate] = useState<string>(todayStr);
//   const [selectedShift, setSelectedShift] = useState<"night" | "day">("night");

//   const [actionLoading, setActionLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch Attendance Requests
//   const fetchRequests = useCallback(async () => {
//     try {
//       const response = await api.get(
//         "https://egypt.mahmoudalbatran.com/api/requests",
//         { headers: { Accept: "application/json" } }
//       );

//       let fetchedData: AttendanceRequest[] = [];
//       if (Array.isArray(response.data)) {
//         fetchedData = response.data;

//       } else if (response.data?.data && Array.isArray(response.data.data)) {
//         fetchedData = response.data.data;
//       }
//       console.log("Fetched Requests:", fetchedData);
//       fetchedData.sort(
//         (a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       );

//       setRequests(fetchedData);
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//     } finally {
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

//   // Current operational day shifts (Night first, then Day)
//   const todayNightShiftRequest = useMemo(
//     () => requests.find((r) => r.date === todayStr && r.shift === "night") || null,
//     [requests, todayStr]
//   );

//   const todayDayShiftRequest = useMemo(
//     () => requests.find((r) => r.date === todayStr && r.shift === "day") || null,
//     [requests, todayStr]
//   );

//   // Check if active target shift is already submitted
//   // const activeShiftRequest = useMemo(
//   //   () =>
//   //     requests.find(
//   //       (r) => r.date === targetDate && r.shift === selectedShift
//   //     ) || null,
//   //   [requests, targetDate, selectedShift]
//   // );

//   // const isSelectedShiftSubmitted = Boolean(activeShiftRequest);




//   // التحقق الدقيق مما إذا كان الشفت والتاريخ المحددان تم تسجيلهما سابقاً
// // const activeShiftRequest = useMemo(() => {
// //   return (
// //     requests.find((r) => {
// //       const reqDateStr = r.date ? r.date.split("T")[0] : "";
// //       return reqDateStr === targetDate && r.shift === selectedShift;
// //     }) || null
// //   );
// // }, [requests, targetDate, selectedShift]);

// // const isSelectedShiftSubmitted = Boolean(activeShiftRequest);




// const cleanDateStr = (d?: string) => d?.trim().split("T")[0].split(" ")[0] || "";

// // التحقق المباشر من وجود الطلب للشفت واليوم المحددين
// const activeShiftRequest = useMemo(() => {
//   const targetClean = cleanDateStr(targetDate);
//   return (
//     requests.find((r) => {
//       const reqDateClean = cleanDateStr(r.date);
//       return reqDateClean === targetClean && r.shift?.toLowerCase() === selectedShift;
//     }) || null
//   );
// }, [requests, targetDate, selectedShift]);

// const isSelectedShiftSubmitted = Boolean(activeShiftRequest);

//   // Compute last 7 operational days list (considering 6:00 PM cutoff)
//   const lastSevenDays = useMemo(() => {
//     const daysMap = new Map<string, AttendanceRequest[]>();
//     requests.forEach((req) => {
//       const existing = daysMap.get(req.date) || [];
//       daysMap.set(req.date, [...existing, req]);
//     });

//     const datesList: { date: string; items: AttendanceRequest[] }[] = [];
//     const baseDate = new Date();
//     if (baseDate.getHours() >= 18) {
//       baseDate.setDate(baseDate.getDate() + 1);
//     }

//     for (let i = 0; i < 7; i++) {
//       const d = new Date(baseDate);
//       d.setDate(d.getDate() - i);
//       const dateKey = d.toISOString().split("T")[0];
//       datesList.push({ date: dateKey, items: daysMap.get(dateKey) || [] });
//     }
//     return datesList;
//   }, [requests]);

//   // Handle direct click on any day/shift box from the 7-day tracker
//   const handleSelectSlot = (date: string, shift: "night" | "day") => {
//     setTargetDate(date);
//     setSelectedShift(shift);
//   };

//   // Submit Attendance Request
//   const handleSendLocation = async () => {
//     if (isSelectedShiftSubmitted) {
//       Alert.alert("تنبيه", "تم تقديم طلب لهذا الشفت والتاريخ سابقاً.");
//       return;
//     }

//     const shiftText = selectedShift === "night" ? "الليل (المسائي)" : "الصباحي";

//     Alert.alert(
//       "تأكيد إرسال الحضور",
//       `سيتم إرسال موقعك الجغرافي واعتماده لشفت ${shiftText} بتاريخ ${targetDate}.`,
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
//                 Alert.alert("تنبيه", "يرجى السماح بالوصول للموقع الجغرافي.");
//                 return;
//               }

//               const location = await Location.getCurrentPositionAsync({
//                 accuracy: Location.Accuracy.High,
//               });

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
//               formData.append("date", targetDate);
//               formData.append("latitude", String(location.coords.latitude));
//               formData.append("longitude", String(location.coords.longitude));
//               if (locationAddress) {
//                 formData.append("location_address", locationAddress);
//               }

//               const response = await api.post(
//                 "https://egypt.mahmoudalbatran.com/api/v1/employee/attendance/submit",
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//               );

//               Alert.alert("تم الإرسال", response.data?.message || "تم تسجيل الحضور بنجاح.");
//               fetchRequests();
//             } catch (err: any) {
//               Alert.alert("خطأ", "تعذر إرسال طلب الحضور.");
//             } finally {
//               setActionLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "approved":
//         return {
//           bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
//           border: "border-emerald-500/30",
//           text: "text-emerald-600 dark:text-emerald-400",
//           label: "مقبول",
//           color: "#10B981",
//         };
//       case "rejected":
//         return {
//           bg: "bg-rose-500/10 dark:bg-rose-500/20",
//           border: "border-rose-500/30",
//           text: "text-rose-600 dark:text-rose-400",
//           label: "مرفوض",
//           color: "#F43F5E",
//         };
//       default:
//         return {
//           bg: "bg-amber-500/10 dark:bg-amber-500/20",
//           border: "border-amber-500/30",
//           text: "text-amber-600 dark:text-amber-400",
//           label: "قيد الانتظار",
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
//         {/* Today's Operational Shifts Card */}
//         <TodayShiftsCard
//           todayStr={todayStr}
//           todayNightShiftRequest={todayNightShiftRequest}
//           todayDayShiftRequest={todayDayShiftRequest}
//           getStatusBadge={getStatusBadge}
//         />

//         {/* 7-Day Tracker with Clickable Slots */}
//         <LastFiveDaysTracker
//           lastFiveDays={lastSevenDays}
//           todayStr={todayStr}
//           getStatusBadge={getStatusBadge}
//           targetDate={targetDate}
//           selectedShift={selectedShift}
//           onSelectSlot={handleSelectSlot}
//         />

//         {/* Attendance Submission Form */}
//         <AttendanceForm
//           targetDate={targetDate}
//           selectedShift={selectedShift}
//           setSelectedShift={setSelectedShift}
//           isSelectedShiftSubmitted={isSelectedShiftSubmitted}
//           actionLoading={actionLoading}
//           handleSendLocation={handleSendLocation}
//           isDark={isDark}
//         />
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

/**
 * حساب التاريخ التشغيلي الحالي:
 * بعد الساعة 6:00 مساءً (18:00) ينقل النظام تلقائياً لليوم التالي
 */
const getLogicalDate = (dateObj: Date = new Date()): string => {
  const d = new Date(dateObj);
  if (d.getHours() >= 18) {
    d.setDate(d.getDate() + 1);
  }
  return d.toISOString().split("T")[0];
};

export default function AttendanceScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  
  // اليوم التشغيلي الحالي بناءً على قاعدة 6:00 مساءً
  const todayStr = useMemo(() => getLogicalDate(new Date()), []);

  // التقديم متاح فقط لليوم التشغيلي الحالي والشفت المختار (الليل أولاً)
  const [selectedShift, setSelectedShift] = useState<"night" | "day">("night");
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // جلب الطلبات
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

  // طلبات اليوم التشغيلي الحالي
  const todayNightShiftRequest = useMemo(
    () => requests.find((r) => r.date === todayStr && r.shift === "night") || null,
    [requests, todayStr]
  );

  const todayDayShiftRequest = useMemo(
    () => requests.find((r) => r.date === todayStr && r.shift === "day") || null,
    [requests, todayStr]
  );

  // التأكد من حالة الشفت المختار لليوم الحالي
  const activeShiftRequest =
    selectedShift === "night" ? todayNightShiftRequest : todayDayShiftRequest;
  const isSelectedShiftSubmitted = Boolean(activeShiftRequest);

  // عرض آخر 7 أيام للعرض فقط
  const lastSevenDays = useMemo(() => {
    const daysMap = new Map<string, AttendanceRequest[]>();
    requests.forEach((req) => {
      const existing = daysMap.get(req.date) || [];
      daysMap.set(req.date, [...existing, req]);
    });

    const datesList: { date: string; items: AttendanceRequest[] }[] = [];
    const baseDate = new Date();
    if (baseDate.getHours() >= 18) {
      baseDate.setDate(baseDate.getDate() + 1);
    }

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      datesList.push({ date: dateKey, items: daysMap.get(dateKey) || [] });
    }
    return datesList;
  }, [requests]);

  // إرسال الحضور (متاح لليوم الحالي فقط)
  const handleSendLocation = async () => {
    if (isSelectedShiftSubmitted) return;

    const shiftText = selectedShift === "night" ? "الليل" : "النهار";

    Alert.alert(
      "تأكيد إرسال الحضور",
      `سيتم إرسال موقعك الجغرافي واعتماده لشفت ${shiftText} بتاريخ اليوم التشغيلي (${todayStr}).`,
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
              formData.append("date", todayStr);
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

              Alert.alert("تم الإرسال", response.data?.message || "تم تسجيل الحضور بنجاح.");
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
        {/* كارت اليوم مع الشفت الليلي أولاً */}
        <TodayShiftsCard
          todayStr={todayStr}
          todayNightShiftRequest={todayNightShiftRequest}
          todayDayShiftRequest={todayDayShiftRequest}
          getStatusBadge={getStatusBadge}
        />
        
        {/* سجل الـ 7 أيام للعرض فقط دون التعديل على الماضي */}
        <LastFiveDaysTracker
          lastFiveDays={lastSevenDays}
          todayStr={todayStr}
          getStatusBadge={getStatusBadge}
        />

        {/* نموذج الإرسال لليوم التشغيلي الحالي فقط */}
        <AttendanceForm
          todayStr={todayStr}
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
          todayNightShiftRequest={todayNightShiftRequest}
          todayDayShiftRequest={todayDayShiftRequest}
          isSelectedShiftSubmitted={isSelectedShiftSubmitted}
          actionLoading={actionLoading}
          handleSendLocation={handleSendLocation}
          isDark={isDark}
        />
      </ScrollView>
    </SafeAreaView>
  );
}