import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { getToken } from "@/lib/auth-storage";
import { checkAuth } from "@/lib/check-auth";

export default function AuthLayout() {
  const [checking, setChecking] = useState(false);
useEffect(() => {
    const verify = async () => {
      try {
        setChecking(true);
        await checkAuth();
        router.replace("/home");
      } catch (error) {
        // مش مسجّل → عادي
        console.log(error);
        setChecking(false);

      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);
  
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       setChecking(true);
  //     const token = await getToken();
  //     console.log(token, 'oooooooooooooooooooooooooooooooooooooooooooo')

  //     if (token) {
  //       router.replace("/(tabs)/home"); // 🚫 امنع الدخول
  //     }

  //     } catch (error) {
  //       setChecking(false);
  //     } finally {
  //       setChecking(false);

  //     }
  //   };

  //   checkAuth();
  // }, []);

  if (checking) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={"#7CC7A4"} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
