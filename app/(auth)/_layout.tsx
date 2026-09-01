// import { Stack, router } from "expo-router";
// import { useEffect, useState } from "react";
// import { View, ActivityIndicator } from "react-native";
// import { getToken } from "@/lib/auth-storage";
// import { checkAuth } from "@/lib/check-auth";

// export default function AuthLayout() {
//   const [checking, setChecking] = useState(false);
// useEffect(() => {
//     const verify = async () => {
//       try {
//         setChecking(true);
//         await checkAuth();
//         router.replace("/home");
//       } catch (error) {
//         // مش مسجّل → عادي
//         console.log(error);
//         setChecking(false);

//       } finally {
//         setChecking(false);
//       }
//     };

//     verify();
//   }, []);
  
//   // useEffect(() => {
//   //   const checkAuth = async () => {
//   //     try {
//   //       setChecking(true);
//   //     const token = await getToken();
//   //     console.log(token, 'oooooooooooooooooooooooooooooooooooooooooooo')

//   //     if (token) {
//   //       router.replace("/(tabs)/home"); // 🚫 امنع الدخول
//   //     }

//   //     } catch (error) {
//   //       setChecking(false);
//   //     } finally {
//   //       setChecking(false);

//   //     }
//   //   };

//   //   checkAuth();
//   // }, []);

//   if (checking) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color={"#7CC7A4"} />
//       </View>
//     );
//   }

//   return <Stack screenOptions={{ headerShown: false }} />;
// }












import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { checkAuth } from "@/lib/check-auth";

export default function AuthLayout() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        setChecking(true);
        await checkAuth();
        
        // إذا كان التوكن صحيحاً (أو في حالة الأوفلاين والتوكن موجود) -> توجه للهوم
        router.replace("/home"); 
      } catch (error: any) {
        console.log("Auth check error:", error?.message);
        // في حالة وجود خطأ صريح (لا يوجد توكن أو التوكن ملغى) يبقى في صفحة اللوجن
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, []);

  if (checking) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-[#0F0F0F]">
        <ActivityIndicator size="large" color={"#C09A3E"} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}