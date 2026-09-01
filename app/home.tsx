// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   ScrollView,
//   StatusBar,
//   Image,
//   ActivityIndicator,
// } from "react-native";

// import {
//   Ionicons,
// } from "@expo/vector-icons";

// import { useEffect, useState } from "react";

// import { useDebounce } from "use-debounce";

// import {
//   fetchCampaigns,
//   loadSelectedCampaign,
//   selectCampaign,
// } from "@/store/campaign.store";

// import {
//   getCampaignCandidates,
//   updateCandidateStatus,
// } from "@/services/candidates.service";

// import CandidatesSection from "@/components/home/CandidatesSection";

// import CandidateDeliveryModal from "@/components/home/CandidateDeliveryModal";
// import {
//   CANDIDATE_STATUS,
//   toggleStatus,
// } from "@/constants/candidateStatus";
// import { DrawerActions, useNavigation } from "@react-navigation/native";
// import HomeHeader from "@/components/home/HomeHeader";
// import Campaigns from "@/app/campaigns";
// import { SafeAreaView } from "react-native-safe-area-context";
// export default function HomeScreen() {

//   const navigation = useNavigation();


//   const [search, setSearch] =
//     useState("");


//   // const handleDeliverCandidate =
//   //   async () => {
//   //     try {
//   //       if (!selectedCandidate)
//   //         return;

//   //       setUpdatingCandidate(true);

//   //       // const nextStatus =
//   //       //   selectedCandidate.status ===
//   //       //   "مستلم"
//   //       //     ? "مرشح"
//   //       //     : "مستلم";

//   //       const nextStatus = "مستلم";

//   //       await updateCandidateStatus({
//   //         candidateId:
//   //           selectedCandidate.id,

//   //         status: nextStatus,
//   //       });

//   //       /* UPDATE UI */

//   //       setCandidates((prev) =>
//   //         prev.map((item) =>
//   //           item.id ===
//   //           selectedCandidate.id
//   //             ? {
//   //                 ...item,
//   //                 status: nextStatus,
//   //               }
//   //             : item
//   //         )
//   //       );

//   //       setSelectedCandidate(
//   //         (prev: any) => ({
//   //           ...prev,
//   //           status: nextStatus,
//   //         })
//   //       );
//   //     } catch (error) {
//   //       console.log(error);
//   //     } finally {
//   //       setUpdatingCandidate(false);
//   //     }
//   //   };

//   //   const handleDeliverCandidate = async () => {
//   //   try {
//   //     if (!selectedCandidate) return;

//   //     setUpdatingCandidate(true);

//   //     const nextStatus = toggleStatus(
//   //       selectedCandidate.status
//   //     );

//   //     await updateCandidateStatus({
//   //       candidateId: selectedCandidate.id,
//   //       status: nextStatus,
//   //     });

//   //     // Update UI
//   //     setCandidates((prev) =>
//   //       prev.map((item) =>
//   //         item.id === selectedCandidate.id
//   //           ? { ...item, status: nextStatus }
//   //           : item
//   //       )
//   //     );

//   //     setSelectedCandidate((prev: any) => ({
//   //       ...prev,
//   //       status: nextStatus,
//   //     }));
//   //   } catch (error) {
//   //     console.log(error);
//   //   } finally {
//   //     setUpdatingCandidate(false);
//   //   }
//   // };



//   /* ================= LOAD MORE ================= */


//   /* ================= EFFECTS ================= */

//   // useEffect(() => {
//   //   fetchCampaigns(setCampaignState);

//   //   loadSelectedCampaign(
//   //     setCampaignState
//   //   );
//   // }, []);

//   // useEffect(() => {
//   //   if (
//   //     !campaignState.selectedCampaign
//   //   )
//   //     return;

//   //   setCandidates([]);

//   //   setCandidatesPage(1);

//   //   fetchCandidates({
//   //     page: 1,
//   //     reset: true,
//   //     query: debouncedSearch,
//   //   });
//   // }, [
//   //   campaignState.selectedCampaign,
//   //   debouncedSearch,
//   // ]);

//   return (
//     <SafeAreaView className="flex-1 bg-brand-secondary">
//       <StatusBar barStyle="light-content" />

//       {/* BG */}

//       <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-primary/20" />

//       <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-brand-green/10" />

//       <ScrollView
//         showsVerticalScrollIndicator={
//           false
//         }
//         contentContainerStyle={{
//           paddingBottom: 160,
//         }}
//       >
//         {/* HEADER */}

//         <HomeHeader />

//         <View className="px-5 pt-16">
//           {/* <View className="flex-row items-center justify-between">
//             <View className="flex-1">
//               <Text className="text-gray-300 text-lg">
//                 👋 مرحباً بك
//               </Text>

//               <Text className="text-brand-white text-4xl font-extrabold mt-2">
//                 اللجنة المصرية
//               </Text>

//               <Text className="text-gray-400 text-base mt-1">
//                 لإغاثة أهلنا في غزة
//               </Text>

//               <View className="flex-row items-center mt-4">
//                 <Ionicons
//                   name="calendar-outline"
//                   size={18}
//                   color="#D1D5DB"
//                 />

//                 <Text className="text-gray-300 mr-2 text-sm">
//                   {new Date().toLocaleDateString(
//                     "ar-EG",
//                     {
//                       weekday: "long",
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     }
//                   )}
//                 </Text>
//               </View>
//             </View>

//             <View className="w-24 h-24 rounded-[28px] bg-brand-white/10 border border-brand-white/10 items-center justify-center overflow-hidden">
//               <Image
//                 source={require("@/assets/images/micon.png")}
//                 className="w-20 h-20"
//                 resizeMode="contain"
//               />
//             </View>
//           </View> */}
//         </View>

//         {/* SEARCH */}

//         {/* <View className="px-5 mt-8">
//           <View className="rounded-[32px] border border-brand-white/10 bg-brand-white/5 px-5 py-5 shadow-brand">

//             <Text className="text-gray-300 text-base mb-4 font-bold">
//               البحث عن مرشح
//             </Text>

//             <View className="flex-row items-center bg-black/20 border border-brand-white/10 rounded-2xl px-4">

//               <Ionicons
//                 name="search"
//                 size={22}
//                 color="#9CA3AF"
//               />

//               <TextInput
//                 value={search}
//                 onChangeText={setSearch}
//                 placeholder="ابحث بالاسم أو الهوية أو الجوال"
//                 placeholderTextColor="#9CA3AF"
//                 className="flex-1 text-brand-white text-base px-3 py-4 text-right"
//               />

//               {candidatesLoading && (
//                 <ActivityIndicator color="#fff" />
//               )}
//             </View>
//           </View>
//         </View> */}

//         {/* CAMPAIGNS */}

//         {/* <View className="mt-8">
//           <View className="px-5 mb-5">
//             <Text className="text-brand-white text-2xl font-extrabold">
//               الحملات المتوفرة
//             </Text>
//           </View>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={
//               false
//             }
//             contentContainerStyle={{
//               gap: 12,
//               paddingHorizontal: 20,
//             }}
//           >
//             {campaignState.campaigns.map(
//               (campaign: any) => {
//                 const isSelected =
//                   campaignState
//                     .selectedCampaign
//                     ?.id === campaign.id;

//                 return (
//                   <Pressable
//                     key={campaign.id}
//                     onPress={() =>
//                       selectCampaign(
//                         campaign,
//                         setCampaignState
//                       )
//                     }
//                     className={`px-6 py-5 rounded-[26px] border ${isSelected
//                         ? "bg-brand-primary border-brand-primary"
//                         : "bg-brand-white/5 border-brand-white/10"
//                       }`}
//                   >
//                     <Text
//                       className={`font-extrabold text-base ${isSelected
//                           ? "text-white"
//                           : "text-brand-white"
//                         }`}
//                     >
//                       {campaign.name}
//                     </Text>

//                     <Text
//                       className={`mt-2 ${isSelected
//                           ? "text-white/80"
//                           : "text-gray-400"
//                         }`}
//                     >
//                       {campaign.type}
//                     </Text>
//                   </Pressable>
//                 );
//               }
//             )}
//           </ScrollView>
//         </View> */}
//         {/* <Campaigns campaignState={campaignState} selectCampaign={selectCampaign} setCampaignState={setCampaignState} /> */}



//         {/* CANDIDATES */}

//         {/* <CandidatesSection
//           candidates={candidates}
//           loading={candidatesLoading}
//           hasMore={hasMoreCandidates}
//           currentPage={candidatesPage}
//           total={totalCandidates}
//           selectedCampaignName={
//             campaignState
//               .selectedCampaign?.name
//           }
//           onLoadMore={
//             loadMoreCandidates
//           }
//           onPressItem={(
//             candidate: any
//           ) => {
//             setSelectedCandidate(
//               candidate
//             );

//             setDeliveryModalVisible(
//               true
//             );
//           }}
//         /> */}
//       </ScrollView>

//       {/* MODAL */}

//       {/* <CandidateDeliveryModal
//         visible={deliveryModalVisible}
//         candidate={selectedCandidate}
//         loading={updatingCandidate}
//         onClose={() => {
//           setDeliveryModalVisible(
//             false
//           );

//           setSelectedCandidate(
//             null
//           );
//         }}
//         onConfirm={
//           handleDeliverCandidate
//         }
//       /> */}
//     </SafeAreaView>
//   );
// }

















// import React from "react";
// import { View, ScrollView, StatusBar } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import HomeHeader from "@/components/home/HomeHeader";
// import { useTheme } from "@/context/ThemeContext";

// export default function HomeScreen() {
//   const { colorScheme } = useTheme();
//   const isDark = colorScheme === "dark";

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

//       {/* Decorative Background Orbs */}
//       <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C09A3E]/10" />
//       <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-[#C8102E]/10" />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 160 }}
//       >
//         <HomeHeader />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }















import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import HomeHeader from "@/components/home/HomeHeader";
import { useTheme } from "@/context/ThemeContext";

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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
        <View className="px-5 mt-3">
          <View className="flex-row items-center bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl">
            <Ionicons name="mega-phone-outline" size={20} color="#D97706" />
            <Text className="flex-1 mr-2 text-xs font-bold text-amber-700 dark:text-amber-400 leading-5">
              تنويه: تم تحديث قوائم تسليم الطرود الغذائية في نقطة التوزيع المركزية.
            </Text>
          </View>
        </View>

        {/* 2. بطاقات الإحصائيات السريعة (Quick Metrics) */}
        <View className="px-5 mt-5">
          <View className="flex-row gap-3">
            {/* بطاقة المستفيدين */}
            <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
              <View className="w-9 h-9 rounded-xl bg-[#C09A3E]/10 items-center justify-center mb-2">
                <Ionicons name="people-outline" size={20} color="#C09A3E" />
              </View>
              <Text className="text-2xl font-black text-gray-900 dark:text-white">1,420</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-0.5">إجمالي المستفيدين</Text>
            </View>

            {/* بطاقة التسليمات اليوم */}
            <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
              <View className="w-9 h-9 rounded-xl bg-emerald-500/10 items-center justify-center mb-2">
                <Ionicons name="checkmark-done-circle-outline" size={20} color="#10B981" />
              </View>
              <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400">385</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-0.5">تم تسليمهم اليوم</Text>
            </View>
          </View>
        </View>

        {/* 3. اختصارات العمليات السريعة (Quick Actions) */}
        <View className="px-5 mt-5">
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
        </View>

        {/* 4. قسم البحث والفلاتر (Search & Filters) */}
        <View className="px-5 mt-6">
          <View className="p-4 rounded-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
            <Text className="text-gray-900 dark:text-white text-base font-extrabold mb-3">
              البحث عن مستفيد
            </Text>

            {/* حقل البحث */}
            <View className="flex-row items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-1.5 mb-3">
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="ابحث بالاسم، الهوية، أو الرقم..."
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
                { id: "delivered", label: "تم التسليم" },
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

        {/* 5. قائمة المرشحين التجريبية (Candidate Feed Card) */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 dark:text-white text-lg font-extrabold">
              القوائم الحالية
            </Text>
            <TouchableOpacity>
              <Text className="text-[#C09A3E] text-xs font-bold">عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {/* بطاقة مرشح نموذجية */}
          <View className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-white text-base font-bold">
                  أحمد محمود إبراهيم علي
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-medium">
                  الهوية: 401234567 • أفراد الأسرة: 6
                </Text>
              </View>
              <View className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                <Text className="text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                  لم يستلم
                </Text>
              </View>
            </View>

            <View className="pt-3 mt-1 border-t border-gray-100 dark:border-white/5 flex-row justify-between items-center">
              <Text className="text-gray-400 text-xs font-semibold">حملة الطرود الغذائية</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-row items-center bg-[#C8102E] px-4 py-2 rounded-xl"
              >
                <Ionicons name="archive-outline" size={16} color="#FFF" />
                <Text className="text-white text-xs font-bold mr-1.5">تسليم الطرد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}