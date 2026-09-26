
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