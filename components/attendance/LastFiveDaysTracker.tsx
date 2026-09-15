import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface AttendanceRequest {
  id: number;
  employee_id: number;
  date: string;
  shift: "day" | "night";
  status: "approved" | "pending" | "rejected" | string;
  latitude: number;
  longitude: number;
  location_address?: string | null;
  created_at: string;
}

interface LastFiveDaysTrackerProps {
  lastFiveDays: { date: string; items: AttendanceRequest[] }[];
  todayStr: string;
  getStatusBadge: (status: string) => {
    bg: string;
    border: string;
    text: string;
    label: string;
    color: string;
  };
}

export const LastFiveDaysTracker: React.FC<LastFiveDaysTrackerProps> = ({
  lastFiveDays,
  todayStr,
  getStatusBadge,
}) => {
  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-gray-900 dark:text-gray-100 font-black text-sm tracking-wide">
          سجل الـ 5 أيام الأخيرة
        </Text>
        <View className="flex-row items-center gap-1">
          <View className="w-1.5 h-1.5 rounded-full bg-[#C09A3E]" />
          <Text className="text-gray-400 text-[11px] font-bold">تحديث مباشر</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-3 py-1"
      >
        {lastFiveDays.map((dayData) => {
          const dayDateObj = new Date(dayData.date);
          const isToday = dayData.date === todayStr;
          const dayName = dayDateObj.toLocaleDateString("ar-EG", {
            weekday: "short",
          });
          const dateFormatted = dayDateObj.toLocaleDateString("ar-EG", {
            day: "numeric",
            month: "short",
          });

          return (
            <View
              key={dayData.date}
              className={`w-36 p-5 mx-1 rounded-2xl border ${
                isToday
                  ? "bg-[#C09A3E]/5 border-[#C09A3E]/40"
                  : "bg-white dark:bg-[#161619] border-gray-200/80 dark:border-white/5"
              } justify-between shadow-sm`}
            >
              <View className="flex-row justify-between items-center mb-2 pb-2 border-b border-gray-100 dark:border-white/5">
                <Text
                  className={`text-xs font-black ${
                    isToday ? "text-[#C09A3E]" : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {isToday ? "اليوم" : dayName}
                </Text>
                <Text className="text-[10px] font-bold text-gray-400">
                  {dateFormatted}
                </Text>
              </View>

              {dayData.items.length === 0 ? (
                <View className="py-2 items-center">
                  <Text className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                    بدون تسجيل
                  </Text>
                </View>
              ) : (
                <View className="gap-1.5">
                  {dayData.items.map((req) => {
                    const badge = getStatusBadge(req.status);
                    const timeStr = new Date(req.created_at).toLocaleTimeString(
                      "ar-EG",
                      { hour: "2-digit", minute: "2-digit", hour12: true }
                    );

                    return (
                      <View
                        key={req.id}
                        className={`p-1.5 rounded-xl border flex-row items-center justify-between ${badge.bg} ${badge.border}`}
                      >
                        <View className="flex-row items-center gap-1">
                          <Ionicons
                            name={req.shift === "day" ? "sunny" : "moon"}
                            size={12}
                            color={badge.color}
                          />
                          <Text className="text-[10px] font-black text-gray-800 dark:text-gray-200">
                            {req.shift === "day" ? "نهار" : "ليل"}
                          </Text>
                        </View>

                        <Text className={`text-[9px] font-extrabold ${badge.text}`}>
                          {timeStr}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};