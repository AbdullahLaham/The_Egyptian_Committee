// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";

// export default function DisbursementsScreen() {
//   const { colorScheme } = useTheme();
// const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);



//   const fetchAttendanceHistory = async () => {
//       try {
//         setError(null);
//         const response = await api.get("https://egypt.mahmoudalbatran.com/api/payroll/summary")
//         const data = await response.data;
//         console.log("dis.........:", response.data);
  
//         if (data && data.history) {
//           setHistory(data.history);
//         }
//       } catch (err) {
//         console.error("Error fetching attendance history:", err);
//         setError("حدث خطأ أثناء تحميل سجل الحضور");
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     };
  
//     useEffect(() => {
//       fetchAttendanceHistory();
//     }, []);
//   return (
//     <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

//       <ScreenHeader title="المستحقات والصرف" iconName="wallet-outline" />

//       <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
//         {/* Balance Cards */}
//         <View className="flex-row gap-3 mb-6">
//           <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C09A3E]/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
//             <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">غير مصروف (معلق)</Text>
//             <Text className="text-[#C09A3E] text-2xl font-black">450 شيكل</Text>
//           </View>
//           <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-emerald-500/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
//             <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">المبلغ المستلم</Text>
//             <Text className="text-emerald-600 dark:text-emerald-400 text-2xl font-black">3,000 شيكل</Text>
//           </View>
//         </View>

//         <Text className="text-gray-900 dark:text-white font-extrabold text-base mb-3">كشوفات الصرف</Text>

//         {[
//           { id: "PAY-1092", amount: "150 شيكل", status: "تم الصرف", date: "22 أغسطس 2026", paid: true },
//           { id: "PAY-1093", amount: "300 شيكل", status: "قيد المراجعة", date: "23 أغسطس 2026", paid: false },
//         ].map((pay) => (
//           <View key={pay.id} className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/5 p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm dark:shadow-none">
//             <View>
//               <Text className="text-gray-900 dark:text-white font-bold text-sm">{pay.amount}</Text>
//               <Text className="text-gray-500 dark:text-gray-400 text-xs">{pay.date} • {pay.id}</Text>
//             </View>
//             <View className={`px-3 py-1 rounded-full ${pay.paid ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-amber-500/10 border border-amber-500/30"}`}>
//               <Text className={`text-xs font-bold ${pay.paid ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{pay.status}</Text>
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
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface DisbursementItem {
//   id: number;
//   code: string;
//   amount: number;
//   date: string;
//   day_shifts_count: number;
//   night_shifts_count: number;
//   status: string;
//   status_key: string;
// }

// interface ApiResponse {
//   disbursements: DisbursementItem[];
//   pending_amount: number;
//   total_received: number;
// }

// export default function DisbursementsScreen() {
//   const { colorScheme } = useTheme();
//   const [pendingAmount, setPendingAmount] = useState<number>(0);
//   const [totalReceived, setTotalReceived] = useState<number>(0);
//   const [disbursements, setDisbursements] = useState<DisbursementItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchDisbursements = async () => {
//     try {
//       setError(null);
//       const response = await api.get(
//         "https://egypt.mahmoudalbatran.com/api/payroll/summary"
//       );
//       const data: any = await response.data;

//       if (data) {
//         setPendingAmount(data.pending_amount ?? 0);
//         setTotalReceived(data.total_received ?? 0);
//         setDisbursements(data.disbursements || []);
//       }
//     } catch (err) {
//       console.error("Error fetching disbursements:", err);
//       setError("حدث خطأ أثناء تحميل بيانات المستحقات");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchDisbursements();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchDisbursements();
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar
//         barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
//       />

//       <ScreenHeader title="المستحقات والصرف" iconName="wallet-outline" />

//       <ScrollView
//         className="px-5 pt-4"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Balance Cards */}
//         <View className="flex-row gap-3 mb-6">
//           <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C09A3E]/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
//             <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">
//               غير مصروف (معلق)
//             </Text>
//             <Text className="text-[#C09A3E] text-2xl font-black">
//               {pendingAmount} شيكل
//             </Text>
//           </View>
//           <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-emerald-500/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
//             <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">
//               المبلغ المستلم
//             </Text>
//             <Text className="text-emerald-600 dark:text-emerald-400 text-2xl font-black">
//               {totalReceived} شيكل
//             </Text>
//           </View>
//         </View>

//         <Text className="text-gray-900 dark:text-white font-extrabold text-base mb-3">
//           كشوفات الصرف
//         </Text>

//         {/* Dynamic List / States */}
//         {loading ? (
//           <View className="py-20 items-center justify-center">
//             <ActivityIndicator size="large" color="#C09A3E" />
//             <Text className="text-gray-500 dark:text-gray-400 mt-3 text-xs">
//               جاري تحميل كشوفات الصرف...
//             </Text>
//           </View>
//         ) : error ? (
//           <View className="py-10 items-center justify-center">
//             <Text className="text-red-500 text-sm font-bold">{error}</Text>
//           </View>
//         ) : disbursements.length === 0 ? (
//           <View className="py-10 items-center justify-center">
//             <Text className="text-gray-500 dark:text-gray-400 text-sm">
//               لا توجد كشوفات صرف متاحة حالياً.
//             </Text>
//           </View>
//         ) : (
//           disbursements.map((item) => {
//             const isApproved = item.status_key === "approved";

//             return (
//               <View
//                 key={item.id}
//                 className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/5 p-4 rounded-2xl mb-3 shadow-sm dark:shadow-none"
//               >
//                 <View className="flex-row justify-between items-center mb-2">
//                   <View>
//                     <Text className="text-gray-900 dark:text-white font-black text-base">
//                       {item.amount} شيكل
//                     </Text>
//                     <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
//                       {item.date} • {item.code}
//                     </Text>
//                   </View>

//                   <View
//                     className={`px-3 py-1 rounded-full ${
//                       isApproved
//                         ? "bg-emerald-500/10 border border-emerald-500/30"
//                         : "bg-amber-500/10 border border-amber-500/30"
//                     }`}
//                   >
//                     <Text
//                       className={`text-xs font-bold ${
//                         isApproved
//                           ? "text-emerald-600 dark:text-emerald-400"
//                           : "text-amber-600 dark:text-amber-400"
//                       }`}
//                     >
//                       {item.status}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* تفاصيل الشفتات المصروفة إن وجدت */}
//                 {(item.day_shifts_count > 0 || item.night_shifts_count > 0) && (
//                   <View className="flex-row gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
//                     {item.day_shifts_count > 0 && (
//                       <Text className="text-gray-500 dark:text-gray-400 text-xs">
//                         ☀️ شفت نهار:{" "}
//                         <Text className="font-bold text-gray-800 dark:text-gray-200">
//                           {item.day_shifts_count}
//                         </Text>
//                       </Text>
//                     )}
//                     {item.night_shifts_count > 0 && (
//                       <Text className="text-gray-500 dark:text-gray-400 text-xs">
//                         🌙 شفت ليل:{" "}
//                         <Text className="font-bold text-gray-800 dark:text-gray-200">
//                           {item.night_shifts_count}
//                         </Text>
//                       </Text>
//                     )}
//                   </View>
//                 )}
//               </View>
//             );
//           })
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }












import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface DisbursementItem {
  id: number;
  code: string;
  amount: number;
  date: string;
  from_date: any;
  to_date: any;
  day_shifts_count: number;
  night_shifts_count: number;
  status: string;
  status_key: string;
}

export default function DisbursementsScreen() {
  const { colorScheme } = useTheme();

  // Date States (YYYY-MM-DD)
  const [fromDate, setFromDate] = useState<string>("2026-08-01");
  const [toDate, setToDate] = useState<string>("2026-08-31");

  // Modal Control
  const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);
  const [yearInput, setYearInput] = useState<string>("2026");
  const [monthInput, setMonthInput] = useState<string>("08");
  const [dayInput, setDayInput] = useState<string>("01");

  // Data States
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const [totalReceived, setTotalReceived] = useState<number>(0);
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisbursements = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.get(
        "https://egypt.mahmoudalbatran.com/api/payroll/summary",
        {
          params: {
            from_date: fromDate,
            to_date: toDate,
          },
        }
      );

      const data = response.data;
      if (data) {
        console.log("djjjjjjjjjjjjjjjjjjjjjjjjjjjjj", data)
        setPendingAmount(data.pending_amount ?? 0);
        setTotalReceived(data.total_received ?? 0);
        setDisbursements(data.disbursements || []);
      }
    } catch (err) {
      console.error("Error fetching disbursements:", err);
      setError("حدث خطأ أثناء تحميل بيانات المستحقات");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchDisbursements();
  }, []);

  const openPicker = (type: "from" | "to") => {
    const currentDateStr = type === "from" ? fromDate : toDate;
    const [y, m, d] = currentDateStr.split("-");
    setYearInput(y || "2026");
    setMonthInput(m || "08");
    setDayInput(d || "01");
    setActivePicker(type);
  };

  // Adjust values with buttons
  const adjustYear = (delta: number) => {
    const current = parseInt(yearInput, 10) || 2026;
    setYearInput(Math.max(2000, current + delta).toString());
  };

  const adjustMonth = (delta: number) => {
    let current = parseInt(monthInput, 10) || 1;
    current += delta;
    if (current > 12) current = 1;
    if (current < 1) current = 12;
    setMonthInput(String(current).padStart(2, "0"));
  };

  const adjustDay = (delta: number) => {
    let current = parseInt(dayInput, 10) || 1;
    current += delta;
    if (current > 31) current = 1;
    if (current < 1) current = 31;
    setDayInput(String(current).padStart(2, "0"));
  };

  const confirmDate = () => {
    let parsedYear = parseInt(yearInput, 10) || 2026;
    let parsedMonth = parseInt(monthInput, 10) || 1;
    let parsedDay = parseInt(dayInput, 10) || 1;

    // Bounds validation
    if (parsedMonth < 1) parsedMonth = 1;
    if (parsedMonth > 12) parsedMonth = 12;
    if (parsedDay < 1) parsedDay = 1;
    if (parsedDay > 31) parsedDay = 31;

    const formattedMonth = String(parsedMonth).padStart(2, "0");
    const formattedDay = String(parsedDay).padStart(2, "0");
    const formattedDate = `${parsedYear}-${formattedMonth}-${formattedDay}`;

    if (activePicker === "from") {
      setFromDate(formattedDate);
    } else if (activePicker === "to") {
      setToDate(formattedDate);
    }

    setActivePicker(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      <ScreenHeader title="المستحقات والصرف" iconName="wallet-outline" />

      <ScrollView
        className="px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDisbursements(); }} />
        }
      >
        {/* Date Filter Section */}
        <View className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl border border-gray-200 dark:border-white/10 mb-5 shadow-sm dark:shadow-none">
          <Text className="text-gray-900 dark:text-white font-bold text-sm mb-3">
            تصفية الفترة الزمنية
          </Text>

          <View className="flex-row gap-3 mb-3">
            {/* From Date Trigger */}
            <TouchableOpacity
              onPress={() => openPicker("from")}
              className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-3 items-center"
            >
              <Text className="text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">من تاريخ</Text>
              <Text className="text-gray-900 dark:text-white text-xs font-bold">{fromDate}</Text>
            </TouchableOpacity>

            {/* To Date Trigger */}
            <TouchableOpacity
              onPress={() => openPicker("to")}
              className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-3 items-center"
            >
              <Text className="text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">إلى تاريخ</Text>
              <Text className="text-gray-900 dark:text-white text-xs font-bold">{toDate}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={fetchDisbursements}
            className="bg-[#C09A3E] p-3 rounded-xl items-center active:opacity-80"
          >
            <Text className="text-black font-bold text-xs">تطبيق الفلتر</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C09A3E]/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">غير مصروف (معلق)</Text>
            <Text className="text-[#C09A3E] text-2xl font-black">{pendingAmount} شيكل</Text>
          </View>

          <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-emerald-500/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">المبلغ المستلم</Text>
            <Text className="text-emerald-600 dark:text-emerald-400 text-2xl font-black">{totalReceived} شيكل</Text>
          </View>
        </View>

        <Text className="text-gray-900 dark:text-white font-extrabold text-base mb-3">كشوفات الصرف</Text>

        {/* List / Loader States */}
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#C09A3E" />
            <Text className="text-gray-500 dark:text-gray-400 mt-3 text-xs">جاري تحميل كشوفات الصرف...</Text>
          </View>
        ) : error ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-red-500 text-sm font-bold">{error}</Text>
          </View>
        ) : disbursements.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">لا توجد كشوفات صرف متاحة حالياً.</Text>
          </View>
        ) : (
          disbursements.map((item) => (
            <View key={item.id} className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/5 p-4 rounded-2xl mb-3 shadow-sm dark:shadow-none">
              <View className="flex-row justify-between items-center mb-2">
                <View>
                  <Text className="text-gray-900 dark:text-white font-black text-base">{item.amount} شيكل</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{item.date} • {item.code}</Text>
                </View>

                <View className={`px-3 py-1 rounded-full ${item.status_key === "approved" ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-amber-500/10 border border-amber-500/30"}`}>
                  <Text className={`text-xs font-bold ${item.status_key === "approved" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {item.status}
                  </Text>
                </View>
              </View>
              {/* Enhanced Date Range Display */}
              <View className="bg-gray-50 dark:bg-white/[0.04] p-2.5 rounded-xl border border-gray-100 dark:border-white/5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="calendar-outline" size={14} color="#C09A3E" />
                  <Text className="text-gray-600 dark:text-gray-300 text-xs font-bold">
                    {item.from_date || item.date}
                  </Text>
                </View>

                <View className="flex-row items-center gap-1 px-2">
                  <View className="h-[1px] w-3 bg-gray-300 dark:bg-gray-600" />
                  <Ionicons name="arrow-back-outline" size={12} color="#9CA3AF" />
                </View>

                <View className="flex-row items-center gap-1.5">
                  <Text className="text-gray-600 dark:text-gray-300 text-xs font-bold">
                    {item.to_date || item.date}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Hybrid Stepper & Direct Editable Input Modal */}
      <Modal visible={activePicker !== null} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white dark:bg-[#1A1A1A] w-full p-5 rounded-3xl border border-gray-200 dark:border-white/10">
            <Text className="text-gray-900 dark:text-white font-black text-base mb-4 text-center">
              تعديل {activePicker === "from" ? "تاريخ البداية" : "تاريخ النهاية"}
            </Text>

            {/* Steppers with Editable Numeric Center Input */}
            <View className="flex-row justify-around mb-6 gap-2">
              {/* Year Column */}
              <View className="flex-1 items-center">
                <Text className="text-gray-400 text-xs mb-1 font-semibold">السنة</Text>
                <TouchableOpacity
                  onPress={() => adjustYear(1)}
                  className="w-full py-2 bg-gray-100 dark:bg-white/5 rounded-t-xl items-center border-b border-gray-200 dark:border-white/10"
                >
                  <Text className="text-gray-900 dark:text-white font-bold text-xs">▲</Text>
                </TouchableOpacity>

                <TextInput
                  value={yearInput}
                  onChangeText={setYearInput}
                  keyboardType="number-pad"
                  maxLength={4}
                  className="w-full text-center bg-gray-50 dark:bg-white/10 py-2 text-gray-900 dark:text-white font-black text-base"
                />

                <TouchableOpacity
                  onPress={() => adjustYear(-1)}
                  className="w-full py-2 bg-gray-100 dark:bg-white/5 rounded-b-xl items-center border-t border-gray-200 dark:border-white/10"
                >
                  <Text className="text-gray-900 dark:text-white font-bold text-xs">▼</Text>
                </TouchableOpacity>
              </View>

              {/* Month Column */}
              <View className="flex-1 items-center">
                <Text className="text-gray-400 text-xs mb-1 font-semibold">الشهر</Text>
                <TouchableOpacity
                  onPress={() => adjustMonth(1)}
                  className="w-full py-2 bg-gray-100 dark:bg-white/5 rounded-t-xl items-center border-b border-gray-200 dark:border-white/10"
                >
                  <Text className="text-gray-900 dark:text-white font-bold text-xs">▲</Text>
                </TouchableOpacity>

                <TextInput
                  value={monthInput}
                  onChangeText={setMonthInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  className="w-full text-center bg-gray-50 dark:bg-white/10 py-2 text-gray-900 dark:text-white font-black text-base"
                />

                <TouchableOpacity
                  onPress={() => adjustMonth(-1)}
                  className="w-full py-2 bg-gray-100 dark:bg-white/5 rounded-b-xl items-center border-t border-gray-200 dark:border-white/10"
                >
                  <Text className="text-gray-900 dark:text-white font-bold text-xs">▼</Text>
                </TouchableOpacity>
              </View>

              {/* Day Column */}
              <View className="flex-1 items-center">
                <Text className="text-gray-400 text-xs mb-1 font-semibold">اليوم</Text>
                <TouchableOpacity
                  onPress={() => adjustDay(1)}
                  className="w-full py-2 bg-gray-100 dark:bg-white/5 rounded-t-xl items-center border-b border-gray-200 dark:border-white/10"
                >
                  <Text className="text-gray-900 dark:text-white font-bold text-xs">▲</Text>
                </TouchableOpacity>

                <TextInput
                  value={dayInput}
                  onChangeText={setDayInput}
                  keyboardType="number-pad"
                  maxLength={2}
                  className="w-full text-center bg-gray-50 dark:bg-white/10 py-2 text-gray-900 dark:text-white font-black text-base"
                />

                <TouchableOpacity
                  onPress={() => adjustDay(-1)}
                  className="w-full py-2 bg-gray-100 dark:bg-white/5 rounded-b-xl items-center border-t border-gray-200 dark:border-white/10"
                >
                  <Text className="text-gray-900 dark:text-white font-bold text-xs">▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setActivePicker(null)} className="flex-1 bg-gray-200 dark:bg-white/10 p-3 rounded-xl items-center">
                <Text className="text-gray-800 dark:text-gray-200 font-bold text-xs">إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmDate} className="flex-1 bg-[#C09A3E] p-3 rounded-xl items-center">
                <Text className="text-black font-bold text-xs">حفظ التعديل</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}