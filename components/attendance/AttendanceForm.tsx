// import React from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { AttendanceRequest } from "./LastFiveDaysTracker";

// interface AttendanceFormProps {
//   selectedShift: "day" | "night";
//   setSelectedShift: (shift: "day" | "night") => void;
//   todayDayShiftRequest: AttendanceRequest | null;
//   todayNightShiftRequest: AttendanceRequest | null;
//   isSelectedShiftSubmitted: boolean;
//   actionLoading: boolean;
//   handleSendLocation: () => void;
//   isDark: boolean;
// }

// export const AttendanceForm: React.FC<AttendanceFormProps> = ({
//   selectedShift,
//   setSelectedShift,
//   todayDayShiftRequest,
//   todayNightShiftRequest,
//   isSelectedShiftSubmitted,
//   actionLoading,
//   handleSendLocation,
//   isDark,
// }) => {
//   return (
//     <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-5 mb-8 shadow-sm relative overflow-hidden">
//       <View className="absolute top-0 left-0 right-0 h-1 bg-[#C09A3E]" />

//       <View className="flex-row items-center gap-3 mb-4">
//         <View className="w-10 h-10 rounded-2xl bg-[#C09A3E]/10 items-center justify-center border border-[#C09A3E]/30">
//           <Ionicons name="navigate-sharp" size={20} color="#C09A3E" />
//         </View>
//         <View>
//           <Text className="text-gray-900 dark:text-white font-black text-base">
//             إرسال الحضور الميداني
//           </Text>
//           <Text className="text-gray-400 text-[11px] font-bold mt-0.5">
//             حدد الشفت المراد تسجيله حالياً
//           </Text>
//         </View>
//       </View>

//       {/* Shift Switcher */}
//       <View className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl flex-row gap-2 mb-5 border border-gray-200/50 dark:border-white/5">
//         <TouchableOpacity
//           onPress={() => setSelectedShift("day")}
//           activeOpacity={0.8}
//           style={{
//             backgroundColor: selectedShift === "day" ? "#C09A3E" : "transparent",
//           }}
//           className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
//         >
//           <Ionicons
//             name="sunny"
//             size={16}
//             color={
//               selectedShift === "day" ? "#000" : isDark ? "#A1A1AA" : "#71717A"
//             }
//           />
//           <Text
//             style={{
//               color:
//                 selectedShift === "day"
//                   ? "#000"
//                   : isDark
//                   ? "#A1A1AA"
//                   : "#4B5563",
//             }}
//             className="text-xs font-black"
//           >
//             شفت نهار {todayDayShiftRequest && "(مُسجّل)"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => setSelectedShift("night")}
//           activeOpacity={0.8}
//           style={{
//             backgroundColor: selectedShift === "night" ? "#C09A3E" : "transparent",
//           }}
//           className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
//         >
//           <Ionicons
//             name="moon"
//             size={15}
//             color={
//               selectedShift === "night" ? "#000" : isDark ? "#A1A1AA" : "#71717A"
//             }
//           />
//           <Text
//             style={{
//               color:
//                 selectedShift === "night"
//                   ? "#000"
//                   : isDark
//                   ? "#A1A1AA"
//                   : "#4B5563",
//             }}
//             className="text-xs font-black"
//           >
//             شفت ليل {todayNightShiftRequest && "(مُسجّل)"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Submit Controls */}
//       {actionLoading ? (
//         <View className="py-3.5 bg-[#C09A3E]/20 rounded-2xl items-center justify-center flex-row gap-2">
//           <ActivityIndicator size="small" color="#C09A3E" />
//           <Text className="text-[#C09A3E] font-extrabold text-xs">
//             جاري إرسال الإحداثيات...
//           </Text>
//         </View>
//       ) : isSelectedShiftSubmitted ? (
//         <View className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 h-13 rounded-2xl flex-row items-center justify-center gap-2">
//           <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
//           <Text className="text-gray-400 font-bold text-xs">
//             تم تسجيل حضور هذا الشفت لهذا اليوم
//           </Text>
//         </View>
//       ) : (
//         <TouchableOpacity
//           onPress={handleSendLocation}
//           activeOpacity={0.85}
//           className="bg-[#C09A3E] h-13 p-3 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
//         >
//           <Ionicons name="location-sharp" size={20} color="#ffffffff" />
//           <Text className="text-white font-black text-s">
//             إرسال موقع الحضور الآن
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };












// import React from "react";
// import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { AttendanceRequest } from "./LastFiveDaysTracker";

// interface AttendanceFormProps {
//   todayStr: string;
//   selectedShift: "night" | "day";
//   setSelectedShift: (shift: "night" | "day") => void;
//   todayNightShiftRequest: AttendanceRequest | null;
//   todayDayShiftRequest: AttendanceRequest | null;
//   isSelectedShiftSubmitted: boolean;
//   actionLoading: boolean;
//   handleSendLocation: () => void;
//   isDark: boolean;
// }

// export const AttendanceForm: React.FC<AttendanceFormProps> = ({
//   todayStr,
//   selectedShift,
//   setSelectedShift,
//   todayNightShiftRequest,
//   todayDayShiftRequest,
//   isSelectedShiftSubmitted,
//   actionLoading,
//   handleSendLocation,
//   isDark,
// }) => {
//   return (
//     <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-5 mb-8 shadow-sm relative overflow-hidden">
//       <View className="absolute top-0 left-0 right-0 h-1 bg-[#C09A3E]" />

//       <View className="flex-row items-center gap-3 mb-4">
//         <View className="w-10 h-10 rounded-2xl bg-[#C09A3E]/10 items-center justify-center border border-[#C09A3E]/30">
//           <Ionicons name="navigate-sharp" size={20} color="#C09A3E" />
//         </View>
//         <View>
//           <Text className="text-gray-900 dark:text-white font-black text-base">
//             إرسال الحضور الميداني
//           </Text>
//           <Text className="text-gray-400 text-[11px] font-bold mt-0.5">
//             تاريخ اليوم التشغيلي: {todayStr}
//           </Text>
//         </View>
//       </View>

//       {/* اختيار الشفت (الليل أولاً ثم النهار) */}
//       <View className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl flex-row gap-2 mb-5 border border-gray-200/50 dark:border-white/5">
//         <TouchableOpacity
//           onPress={() => setSelectedShift("night")}
//           activeOpacity={0.8}
//           style={{
//             backgroundColor: selectedShift === "night" ? "#C09A3E" : "transparent",
//           }}
//           className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
//         >
//           <Ionicons
//             name="moon"
//             size={15}
//             color={
//               selectedShift === "night" ? "#000" : isDark ? "#A1A1AA" : "#71717A"
//             }
//           />
//           <Text
//             style={{
//               color:
//                 selectedShift === "night"
//                   ? "#000"
//                   : isDark
//                   ? "#A1A1AA"
//                   : "#4B5563",
//             }}
//             className="text-xs font-black"
//           >
//             شفت الليل {todayNightShiftRequest && "(مُسجّل)"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => setSelectedShift("day")}
//           activeOpacity={0.8}
//           style={{
//             backgroundColor: selectedShift === "day" ? "#C09A3E" : "transparent",
//           }}
//           className="flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2"
//         >
//           <Ionicons
//             name="sunny"
//             size={16}
//             color={
//               selectedShift === "day" ? "#000" : isDark ? "#A1A1AA" : "#71717A"
//             }
//           />
//           <Text
//             style={{
//               color:
//                 selectedShift === "day"
//                   ? "#000"
//                   : isDark
//                   ? "#A1A1AA"
//                   : "#4B5563",
//             }}
//             className="text-xs font-black"
//           >
//             شفت النهار {todayDayShiftRequest && "(مُسجّل)"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* زر الإرسال */}
//       {actionLoading ? (
//         <View className="py-3.5 bg-[#C09A3E]/20 rounded-2xl items-center justify-center flex-row gap-2">
//           <ActivityIndicator size="small" color="#C09A3E" />
//           <Text className="text-[#C09A3E] font-extrabold text-xs">
//             جاري إرسال الإحداثيات...
//           </Text>
//         </View>
//       ) : isSelectedShiftSubmitted ? (
//         <View className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 h-13 rounded-2xl flex-row items-center justify-center gap-2">
//           <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
//           <Text className="text-gray-400 font-bold text-xs">
//             تم تسجيل هذا الشفت لهذا اليوم بالفعل
//           </Text>
//         </View>
//       ) : (
//         <TouchableOpacity
//           onPress={handleSendLocation}
//           activeOpacity={0.85}
//           className="bg-[#C09A3E] h-13 p-3 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
//         >
//           <Ionicons name="location-sharp" size={20} color="#FFFFFF" />
//           <Text className="text-white font-black text-sm">
//            تأكيد الحضور الآن
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };










import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AttendanceFormProps {
  todayStr: string;
  currentActiveShift: "night" | "day";
  isSelectedShiftSubmitted: boolean;
  actionLoading: boolean;
  handleSendLocation: () => void;
  isDark: boolean;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  todayStr,
  currentActiveShift,
  isSelectedShiftSubmitted,
  actionLoading,
  handleSendLocation,
  isDark,
}) => {
  const isNight = currentActiveShift === "night";

  return (
    <View className="bg-white dark:bg-[#161619] border border-gray-200/80 dark:border-white/10 rounded-3xl p-5 mb-8 shadow-sm relative overflow-hidden">
      <View className="absolute top-0 left-0 right-0 h-1 bg-[#C09A3E]" />

      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-10 h-10 rounded-2xl bg-[#C09A3E]/10 items-center justify-center border border-[#C09A3E]/30">
          <Ionicons name="navigate-sharp" size={20} color="#C09A3E" />
        </View>
        <View>
          <Text className="text-gray-900 dark:text-white font-black text-base">
            إرسال الحضور الميداني
          </Text>
          <Text className="text-gray-400 text-[11px] font-bold mt-0.5">
            التاريخ التشغيلي: {todayStr}
          </Text>
        </View>
      </View>

      {/* عرض الشفت المتاح حالياً تلقائياً ومنع التغيير اليدوي */}
      <View className="bg-gray-100 dark:bg-white/5 p-3 rounded-2xl flex-row items-center justify-between mb-5 border border-gray-200/50 dark:border-white/5">
        <View className="flex-row items-center gap-2">
          <Ionicons
            name={isNight ? "moon" : "sunny"}
            size={18}
            color={isNight ? "#6366F1" : "#F59E0B"}
          />
          <Text className="text-xs font-black text-gray-900 dark:text-white">
            الشفت المتاح حالياً: {isNight ? "شفت الليل" : "شفت النهار"}
          </Text>
        </View>
        <View className="bg-[#C09A3E]/20 px-2.5 py-1 rounded-lg border border-[#C09A3E]/30">
          <Text className="text-[10px] font-black text-[#C09A3E]">نشط الآن</Text>
        </View>
      </View>

      {/* زر الإرسال */}
      {actionLoading ? (
        <View className="py-3.5 bg-[#C09A3E]/20 rounded-2xl items-center justify-center flex-row gap-2">
          <ActivityIndicator size="small" color="#C09A3E" />
          <Text className="text-[#C09A3E] font-extrabold text-xs">
            جاري إرسال الإحداثيات...
          </Text>
        </View>
      ) : isSelectedShiftSubmitted ? (
        <View className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 h-13 rounded-2xl flex-row items-center justify-center gap-2">
          <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
          <Text className="text-gray-400 font-bold text-xs">
            تم تسجيل حضور هذا الشفت لهذا اليوم بالفعل
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleSendLocation}
          activeOpacity={0.85}
          className="bg-[#C09A3E] h-13 p-3 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
        >
          <Ionicons name="location-sharp" size={20} color="#FFFFFF" />
          <Text className="text-white font-black text-sm">
            تسجيل حضور ({isNight ? "شفت الليل" : "شفت النهار"})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};