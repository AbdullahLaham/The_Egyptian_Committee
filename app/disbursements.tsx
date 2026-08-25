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











import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";

interface DisbursementItem {
  id: number;
  code: string;
  amount: number;
  date: string;
  day_shifts_count: number;
  night_shifts_count: number;
  status: string;
  status_key: string;
}

interface ApiResponse {
  disbursements: DisbursementItem[];
  pending_amount: number;
  total_received: number;
}

export default function DisbursementsScreen() {
  const { colorScheme } = useTheme();
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const [totalReceived, setTotalReceived] = useState<number>(0);
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisbursements = async () => {
    try {
      setError(null);
      const response = await api.get(
        "https://egypt.mahmoudalbatran.com/api/payroll/summary"
      );
      const data: any = await response.data;

      if (data) {
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
  };

  useEffect(() => {
    fetchDisbursements();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDisbursements();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScreenHeader title="المستحقات والصرف" iconName="wallet-outline" />

      <ScrollView
        className="px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Balance Cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#C09A3E]/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">
              غير مصروف (معلق)
            </Text>
            <Text className="text-[#C09A3E] text-2xl font-black">
              {pendingAmount} شيكل
            </Text>
          </View>
          <View className="flex-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-emerald-500/40 p-4 rounded-2xl shadow-sm dark:shadow-none">
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-1">
              المبلغ المستلم
            </Text>
            <Text className="text-emerald-600 dark:text-emerald-400 text-2xl font-black">
              {totalReceived} شيكل
            </Text>
          </View>
        </View>

        <Text className="text-gray-900 dark:text-white font-extrabold text-base mb-3">
          كشوفات الصرف
        </Text>

        {/* Dynamic List / States */}
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#C09A3E" />
            <Text className="text-gray-500 dark:text-gray-400 mt-3 text-xs">
              جاري تحميل كشوفات الصرف...
            </Text>
          </View>
        ) : error ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-red-500 text-sm font-bold">{error}</Text>
          </View>
        ) : disbursements.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              لا توجد كشوفات صرف متاحة حالياً.
            </Text>
          </View>
        ) : (
          disbursements.map((item) => {
            const isApproved = item.status_key === "approved";

            return (
              <View
                key={item.id}
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/5 p-4 rounded-2xl mb-3 shadow-sm dark:shadow-none"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <View>
                    <Text className="text-gray-900 dark:text-white font-black text-base">
                      {item.amount} شيكل
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                      {item.date} • {item.code}
                    </Text>
                  </View>

                  <View
                    className={`px-3 py-1 rounded-full ${
                      isApproved
                        ? "bg-emerald-500/10 border border-emerald-500/30"
                        : "bg-amber-500/10 border border-amber-500/30"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isApproved
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* تفاصيل الشفتات المصروفة إن وجدت */}
                {(item.day_shifts_count > 0 || item.night_shifts_count > 0) && (
                  <View className="flex-row gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
                    {item.day_shifts_count > 0 && (
                      <Text className="text-gray-500 dark:text-gray-400 text-xs">
                        ☀️ شفت نهار:{" "}
                        <Text className="font-bold text-gray-800 dark:text-gray-200">
                          {item.day_shifts_count}
                        </Text>
                      </Text>
                    )}
                    {item.night_shifts_count > 0 && (
                      <Text className="text-gray-500 dark:text-gray-400 text-xs">
                        🌙 شفت ليل:{" "}
                        <Text className="font-bold text-gray-800 dark:text-gray-200">
                          {item.night_shifts_count}
                        </Text>
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}