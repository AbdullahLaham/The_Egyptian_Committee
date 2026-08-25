// import React, { useState } from "react";
// import { View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar } from "react-native";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";

// export default function RequestsScreen() {
//   const { colorScheme } = useTheme();
//   const [requestType, setRequestType] = useState("إثبات دوام");

//   return (
//     <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

//       <ScreenHeader title="تقديم طلب جديد" iconName="document-text-outline" />

//       <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
//         <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">نوع الطلب</Text>
//         <View className="flex-row gap-2 mb-4">
//           {["إثبات دوام", "حضور متأخر", "مراجعة ساعات"].map((type) => (
//             <TouchableOpacity
//               key={type}
//               onPress={() => setRequestType(type)}
//               className={`px-3 py-2 rounded-xl border ${
//                 requestType === type
//                   ? "bg-[#C09A3E] border-[#C09A3E]"
//                   : "bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10"
//               }`}
//             >
//               <Text className={`text-xs font-bold ${requestType === type ? "text-black" : "text-gray-700 dark:text-gray-300"}`}>{type}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">تفاصيل الطلب / السبب</Text>
//         <TextInput
//           multiline
//           numberOfLines={4}
//           placeholder="اكتب تفاصيل الطلب وتبرير الدوام هنا..."
//           placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
//           className="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white mb-6 text-sm shadow-sm dark:shadow-none"
//           style={{ textAlignVertical: "top" }}
//         />

//         <TouchableOpacity className="bg-[#C8102E] p-4 rounded-2xl items-center shadow-lg active:opacity-80">
//           <Text className="text-white font-black text-base">إرسال الطلب للمراجعة</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   StatusBar,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import ScreenHeader from "@/components/ScreenHeader";
// import { useTheme } from "@/context/ThemeContext";
// import { api } from "@/services/api";

// const REQUEST_TYPES = [
//   { id: "attendance_proof", label: "إثبات دوام" },
//   { id: "late_attendance", label: "حضور متأخر" },
//   { id: "hours_review", label: "مراجعة ساعات" },
// ];

// export default function RequestsScreen() {
//   const { colorScheme } = useTheme();

//   // States
//   const [requestType, setRequestType] = useState<string>("attendance_proof");
//   const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]); // YYYY-MM-DD
//   const [details, setDetails] = useState<string>("");
//   const [submitting, setSubmitting] = useState<boolean>(false);

//   // Submit Handler
//   const handleSubmit = async () => {
//     if (!details.trim()) {
//       Alert.alert("تنبيه", "يرجى كتابة تفاصيل الطلب قبل الإرسال.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const response = await api.post("https://egypt.mahmoudalbatran.com/api/requests", 
//         {
//           type: requestType,
//           date: date,
//           details: details,
//         },
//         {headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         }},
        
//       );

//       const result = await response.data;
//       console.log("Response from server:", result);

//       if (response.data && result.data.status) {
//         Alert.alert("تم الإرسال", "تم إرسال طلبك بنجاح للمراجعة.");
//         console.log("Request submitted successfully:", result);
//         setDetails("");
//       } else {
//         Alert.alert("خطأ", result?.message || "حدث خطأ أثناء إرسال الطلب.");
//       }
//     } catch (error) {
//       console.error("Error submitting request:", error);
//       Alert.alert("خطأ", "تعذر الاتصال بالسيرفر، يرجى المحاولة لاحقاً.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <View className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

//       <ScreenHeader title="تقديم طلب جديد" iconName="document-text-outline" />

//       <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
//         {/* نوع الطلب */}
//         <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">نوع الطلب</Text>
//         <View className="flex-row gap-2 mb-4">
//           {REQUEST_TYPES.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               onPress={() => setRequestType(item.id)}
//               className={`px-3 py-2 rounded-xl border ${
//                 requestType === item.id
//                   ? "bg-[#C09A3E] border-[#C09A3E]"
//                   : "bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10"
//               }`}
//             >
//               <Text className={`text-xs font-bold ${requestType === item.id ? "text-black" : "text-gray-700 dark:text-gray-300"}`}>
//                 {item.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* تاريخ الطلب */}
//         <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">تاريخ الطلب</Text>
//         <TextInput
//           value={date}
//           onChangeText={setDate}
//           placeholder="YYYY-MM-DD"
//           placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
//           className="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white mb-4 text-sm shadow-sm dark:shadow-none font-bold"
//         />

//         {/* تفاصيل الطلب */}
//         <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">تفاصيل الطلب / السبب</Text>
//         <TextInput
//           multiline
//           numberOfLines={4}
//           value={details}
//           onChangeText={setDetails}
//           placeholder="اكتب تفاصيل الطلب وتبرير الدوام هنا..."
//           placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
//           className="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white mb-6 text-sm shadow-sm dark:shadow-none"
//           style={{ textAlignVertical: "top" }}
//         />

//         {/* زر الإرسال */}
//         <TouchableOpacity
//           onPress={handleSubmit}
//           disabled={submitting}
//           className={`p-4 rounded-2xl items-center shadow-lg active:opacity-80 ${
//             submitting ? "bg-gray-400" : "bg-[#C8102E]"
//           }`}
//         >
//           {submitting ? (
//             <ActivityIndicator color="#FFF" />
//           ) : (
//             <Text className="text-white font-black text-base">إرسال الطلب للمراجعة</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }















import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";

const REQUEST_TYPES = [
  { id: "attendance_proof", label: "إثبات دوام" },
  { id: "late_attendance", label: "حضور متأخر" },
  { id: "hours_review", label: "مراجعة ساعات" },
];

interface RequestItem {
  id: number;
  employee_id: number;
  type: string;
  date: string;
  details: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export default function RequestsScreen() {
  const { colorScheme } = useTheme();

  // Form States
  const [requestType, setRequestType] = useState<string>("attendance_proof");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [details, setDetails] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // List States
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch Requests (GET)
  const fetchRequests = useCallback(async () => {
    try {
      const response = await api.get(
        "https://egypt.mahmoudalbatran.com/api/requests",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoadingRequests(false);
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

  // Submit Handler (POST)
  // const handleSubmit = async () => {
  //   if (!details.trim()) {
  //     Alert.alert("تنبيه", "يرجى كتابة تفاصيل الطلب قبل الإرسال.");
  //     return;
  //   }

  //   try {
  //     setSubmitting(true);

  //     const response = await api.post(
  //       "https://egypt.mahmoudalbatran.com/api/requests",
  //       {
  //         type: requestType,
  //         date: date,
  //         details: details,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //       }
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       Alert.alert("نجاح", response.data?.message || "تم إرسال الطلب بنجاح.");
  //       setDetails("");
  //       fetchRequests(); // إعادة تحديث القائمة بعد الإرسال
  //     }
  //   } catch (error: any) {
  //     console.error("Error submitting request:", error);
  //     const errorMessage =
  //       error.response?.data?.message ||
  //       "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.";
  //     Alert.alert("خطأ", errorMessage);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };



    const handleSubmit = async () => {
    if (!details.trim()) {
      Alert.alert("تنبيه", "يرجى كتابة تفاصيل الطلب قبل الإرسال.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("https://egypt.mahmoudalbatran.com/api/requests", 
        {
          type: requestType,
          date: date,
          details: details,
        },
        {headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }},
        
      );

      const result = await response.data;
      console.log("Response from server:", result);

      if (response.data && result.data.status) {
        Alert.alert("تم الإرسال", "تم إرسال طلبك بنجاح للمراجعة.");
        console.log("Request submitted successfully:", result);
        setDetails("");
      } else {
        Alert.alert("خطأ", result?.message || "حدث خطأ أثناء إرسال الطلب.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("خطأ", "تعذر الاتصال بالسيرفر، يرجى المحاولة لاحقاً.");
    } finally {
      setSubmitting(false);
    }
  }

  // Helper for Status Badge
  const renderStatusBadge = (status: RequestItem["status"]) => {
    switch (status) {
      case "approved":
        return (
          <View className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              مقبول
            </Text>
          </View>
        );
      case "rejected":
        return (
          <View className="bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full">
            <Text className="text-red-500 dark:text-red-400 text-xs font-bold">
              مرفوض
            </Text>
          </View>
        );
      case "pending":
      default:
        return (
          <View className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Text className="text-amber-600 dark:text-amber-400 text-xs font-bold">
              قيد المراجعة
            </Text>
          </View>
        );
    }
  };

  // Helper for Request Type Label
  const getRequestTypeLabel = (type: string) => {
    const found = REQUEST_TYPES.find((item) => item.id === type);
    return found ? found.label : type;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScreenHeader title="إدارة الطلبات" iconName="document-text-outline" />

      <ScrollView
        className="px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* قسم تقديم طلب جديد */}
        <Text className="text-gray-900 dark:text-white font-black text-base mb-3">
          تقديم طلب جديد
        </Text>

        <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">
          نوع الطلب
        </Text>
        <View className="flex-row gap-2 mb-4">
          {REQUEST_TYPES.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setRequestType(item.id)}
              className={`px-3 py-2 rounded-xl border ${
                requestType === item.id
                  ? "bg-[#C09A3E] border-[#C09A3E]"
                  : "bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  requestType === item.id
                    ? "text-black"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">
          تاريخ الطلب
        </Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
          className="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white mb-4 text-sm font-bold"
        />

        <Text className="text-gray-800 dark:text-gray-300 font-bold text-sm mb-2">
          تفاصيل الطلب / السبب
        </Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={details}
          onChangeText={setDetails}
          placeholder="اكتب تفاصيل الطلب وتبرير الدوام هنا..."
          placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
          className="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white mb-6 text-sm"
          style={{ textAlignVertical: "top" }}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className={`p-4 rounded-2xl items-center shadow-lg active:opacity-80 mb-8 ${
            submitting ? "bg-gray-400" : "bg-[#C8102E]"
          }`}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white font-black text-base">
              إرسال الطلب للمراجعة
            </Text>
          )}
        </TouchableOpacity>

        {/* قسم الطلبات السابقة */}
        <Text className="text-gray-900 dark:text-white font-black text-base mb-3">
          الطلبات السابقة
        </Text>

        {loadingRequests ? (
          <ActivityIndicator color="#C8102E" className="my-6" />
        ) : requests.length === 0 ? (
          <View className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-gray-200 dark:border-white/10 items-center mb-8">
            <Text className="text-gray-500 dark:text-gray-400 text-sm font-bold">
              لا توجد طلبات سابقة حتى الآن.
            </Text>
          </View>
        ) : (
          <View className="gap-3 mb-10">
            {requests.map((item) => (
              <View
                key={item.id}
                className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 p-4 rounded-2xl"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-900 dark:text-white font-bold text-sm">
                    {getRequestTypeLabel(item.type)}
                  </Text>
                  {renderStatusBadge(item.status)}
                </View>

                <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                  تاريخ الدوام: {item.date ? item.date.split("T")[0] : "-"}
                </Text>

                <Text className="text-gray-700 dark:text-gray-300 text-xs mt-1">
                  السبب: {item.details}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}