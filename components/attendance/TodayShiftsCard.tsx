import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AttendanceRequest } from "./LastFiveDaysTracker";

interface TodayShiftsCardProps {
  todayStr: string;
  todayDayShiftRequest: AttendanceRequest | null;
  todayNightShiftRequest: AttendanceRequest | null;
  getStatusBadge: (status: string) => { text: string; label: string };
}

export const TodayShiftsCard: React.FC<TodayShiftsCardProps> = ({
  todayStr,
  todayDayShiftRequest,
  todayNightShiftRequest,
  getStatusBadge,
}) => {
  return (
    <View className="mb-6">
      <Text className="text-gray-900 dark:text-gray-100 font-black text-sm mb-3 px-1">
        شفتات اليوم ({todayStr})
      </Text>

      <View className="flex-row gap-3">
        {/* Day Shift Card */}
        <View
          className={`flex-1 p-4 rounded-3xl border ${
            todayDayShiftRequest
              ? "bg-white dark:bg-[#161619] border-emerald-500/40"
              : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
          } shadow-sm justify-between min-h-[140px]`}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-9 h-9 rounded-2xl bg-amber-500/10 items-center justify-center border border-amber-500/20">
              <Ionicons name="sunny" size={20} color="#F59E0B" />
            </View>
            {todayDayShiftRequest ? (
              <View className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  تم الإرسال
                </Text>
              </View>
            ) : (
              <View className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-gray-400">متاح</Text>
              </View>
            )}
          </View>

          <View>
            <Text className="text-gray-900 dark:text-white font-black text-sm">
              شفت النهار
            </Text>
            {todayDayShiftRequest ? (
              <View className="mt-1">
                <Text className="text-gray-400 text-[11px] font-bold">
                  الوقت:{" "}
                  {new Date(todayDayShiftRequest.created_at).toLocaleTimeString(
                    "ar-EG",
                    { hour: "2-digit", minute: "2-digit", hour12: true }
                  )}
                </Text>
                <Text
                  className={`text-[11px] font-black mt-0.5 ${
                    getStatusBadge(todayDayShiftRequest.status).text
                  }`}
                >
                  الحالة: {getStatusBadge(todayDayShiftRequest.status).label}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-400 text-[11px] font-bold mt-1">
                لم يتم الإرسال بعد
              </Text>
            )}
          </View>
        </View>

        {/* Night Shift Card */}
        <View
          className={`flex-1 p-4 rounded-3xl border ${
            todayNightShiftRequest
              ? "bg-white dark:bg-[#161619] border-indigo-500/40"
              : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/10"
          } shadow-sm justify-between min-h-[140px]`}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-9 h-9 rounded-2xl bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
              <Ionicons name="moon" size={18} color="#6366F1" />
            </View>
            {todayNightShiftRequest ? (
              <View className="bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                  تم الإرسال
                </Text>
              </View>
            ) : (
              <View className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-gray-400">متاح</Text>
              </View>
            )}
          </View>

          <View>
            <Text className="text-gray-900 dark:text-white font-black text-sm">
              شفت الليل
            </Text>
            {todayNightShiftRequest ? (
              <View className="mt-1">
                <Text className="text-gray-400 text-[11px] font-bold">
                  الوقت:{" "}
                  {new Date(todayNightShiftRequest.created_at).toLocaleTimeString(
                    "ar-EG",
                    { hour: "2-digit", minute: "2-digit", hour12: true }
                  )}
                </Text>
                <Text
                  className={`text-[11px] font-black mt-0.5 ${
                    getStatusBadge(todayNightShiftRequest.status).text
                  }`}
                >
                  الحالة: {getStatusBadge(todayNightShiftRequest.status).label}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-400 text-[11px] font-bold mt-1">
                لم يتم الإرسال بعد
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};