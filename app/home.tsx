

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HomeHeader from "@/components/home/HomeHeader";
import { useTheme } from "@/context/ThemeContext";
import { useUserStore } from "@/store/useUserStore";
import { api } from "@/services/api";

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

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { user, loading: userLoading, fetchUser } = useUserStore();

  // Date states for the current month (from first to last day)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fromDate = formatDate(new Date(currentYear, currentMonth, 1));
  const toDate = formatDate(new Date(currentYear, currentMonth + 1, 0));

  // Payroll / Disbursements States
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const [totalReceived, setTotalReceived] = useState<number>(0);
  const [disbursements, setDisbursements] = useState<DisbursementItem[]>([]);
  const [loadingDisbursements, setLoadingDisbursements] = useState<boolean>(true);

  const fetchPayrollSummary = useCallback(async () => {
    try {
      setLoadingDisbursements(true);
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
        setPendingAmount(data.pending_amount ?? 0);
        setTotalReceived(data.total_received ?? 0);
        setDisbursements(data.disbursements || []);
      }
    } catch (err) {
      console.error("Error fetching payroll summary on home:", err);
    } finally {
      setLoadingDisbursements(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchUser();
    fetchPayrollSummary();
  }, [fetchPayrollSummary]);

  // Filter disbursements based on search query or status tab if needed
  const filteredDisbursements = disbursements.filter((item) => {
    const matchesSearch =
      item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount?.toString().includes(searchQuery);

    if (activeTab === "pending") return matchesSearch && item.status_key !== "approved";
    if (activeTab === "delivered") return matchesSearch && item.status_key === "approved";
    return matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* خلفيات جمالية مضيئة */}
      <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C09A3E]/10" />
      <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-[#C8102E]/10" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header الرئيسي */}
        
        <HomeHeader />

        {/* 1. تنبيه ميداني هام (Urgent Alert) */}
        {/* <View className="px-5 mt-3">
          <View className="flex-row items-center bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl">
            <Ionicons name="megaphone-outline" size={20} color="#D97706" />
            <Text className="flex-1 mr-2 text-xs font-bold text-amber-700 dark:text-amber-400 leading-5">
              تنويه: تم تحديث قوائم تسليم الطرود الغذائية في نقطة التوزيع المركزية.
            </Text>
          </View>
        </View> */}

        {/* 2. بطاقات الإحصائيات السريعة للشهر الحالي (Quick Metrics) */}
        {/* 2. بطاقة الرصيد الرئيسي الفخمة (Hero Balance Card) */}
        <View className="px-5 mt-5">
          <View className="relative overflow-hidden rounded-[32px] p-6 bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/[0.08] shadow-xl shadow-black/[0.03]">
            {/* تأثير بصري داخلي */}
            <View className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#C09A3E]/10 blur-2xl" />

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-400 dark:text-gray-400 text-xs font-bold tracking-wider">
                مستحقات الشهر الحالي
              </Text>
      
            </View>

            <View className="flex-row justify-between items-end">
              <View className="flex-1">
                <Text className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {pendingAmount} <Text className="text-sm font-bold text-[#C09A3E]">شيكل</Text>
                </Text>
                <Text className="text-[11px] text-gray-400 font-semibold mt-1">غير مصروف (معلق)</Text>
              </View>

              <View className="h-10 w-[1px] bg-gray-200 dark:bg-white/10 mx-4" />

              <View className="flex-1 items-end">
                <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {totalReceived} <Text className="text-xs font-bold">شيكل</Text>
                </Text>
                <Text className="text-[11px] text-gray-400 font-semibold mt-1">المبلغ المستلم</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. اختصارات العمليات السريعة (Quick Actions) */}


        {/* <View className="px-5 mt-5">
          <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">إجراءات سريعة</Text>
          <View className="flex-row justify-between gap-2">
            {[
              { title: "مسح باركود", icon: "qr-code-outline", bg: "bg-blue-500/10", color: "#3B82F6" },
              { title: "إضافة مرشح", icon: "person-add-outline", bg: "bg-emerald-500/10", color: "#10B981" },
              { title: "سجل اليوم", icon: "receipt-outline", bg: "bg-[#C09A3E]/10", color: "#C09A3E" },
              { title: "التقارير", icon: "bar-chart-outline", bg: "bg-purple-500/10", color: "#A855F7" },
            ].map((action, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                className="flex-1 items-center p-3 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm"
              >
                <View className={`w-10 h-10 rounded-xl ${action.bg} items-center justify-center mb-1.5`}>
                  <Ionicons name={action.icon as any} size={20} color={action.color} />
                </View>
                <Text className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* 4. قسم البحث والفلاتر (Search & Filters) */}
        <View className="px-5 mt-6">
          <View className="p-4 rounded-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
            <Text className="text-gray-900 dark:text-white text-base font-extrabold mb-3">
              البحث في مستحقات الشهر
            </Text>

            {/* حقل البحث */}
            <View className="flex-row items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-1.5 mb-3">
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="ابحث بالكود أو المبلغ..."
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-gray-900 dark:text-white text-sm px-3 py-2 text-right font-semibold"
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* فلاتر الحالة */}
            <View className="flex-row gap-2">
              {[
                { id: "all", label: "الكل" },
                { id: "pending", label: "قيد الانتظار" },
                { id: "delivered", label: "تم الصرف" },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full border ${
                    activeTab === tab.id
                      ? "bg-[#C09A3E] border-[#C09A3E]"
                      : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      activeTab === tab.id ? "text-white" : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 5. قائمة كشوفات الصرف للشهر الحالي */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 dark:text-white text-lg font-extrabold">
              كشوفات الشهر الحالي
            </Text>
            <Text className="text-gray-400 text-xs">
              {fromDate} إلى {toDate}
            </Text>
          </View>

          {loadingDisbursements ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator size="small" color="#C09A3E" />
              <Text className="text-gray-400 text-xs mt-2">جاري تحميل الكشوفات...</Text>
            </View>
          ) : filteredDisbursements.length === 0 ? (
            <View className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center">
              <Ionicons name="folder-open-outline" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 text-xs mt-2 font-bold">
                لا توجد كشوفات صرف مطابقة لهذا الشهر.
              </Text>
            </View>
          ) : (
            filteredDisbursements.map((item) => (
              <View
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm mb-3"
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
                      item.status_key === "approved"
                        ? "bg-emerald-500/10 border border-emerald-500/30"
                        : "bg-amber-500/10 border border-amber-500/30"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        item.status_key === "approved"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Date Range Display */}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}