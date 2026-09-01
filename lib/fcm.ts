// import messaging from "@react-native-firebase/messaging";
// import { Platform } from "react-native";
// import axios from "axios";
// import { getToken } from "./auth-storage";

// // 1. معالج الخلفية والتطبيق مغلق تماماً (Android & iOS)
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log("Message handled in background/killed state:", remoteMessage);
// });

// // 2. طلب الصلاحيات وجلب الـ FCM Token الفعلي
// export async function requestFCMPermission() {
//   try {
//     // 💡 على iOS: طلب الصلاحية الصريح للتنبيهات والأصوات والشارات
//     const authStatus = await messaging().requestPermission({
//       alert: true,
//       badge: true,
//       sound: true,
//     });

//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log("FCM Authorized status:", authStatus);

//       // التأكد من تسجيل APNs Token على أجهزة iOS قبل طلب FCM Token
//       if (Platform.OS === "ios") {
//         await messaging().registerDeviceForRemoteMessages();
//       }

//       const fcmToken = await messaging().getToken();
//       console.log("FCM Token (Cross-Platform):", fcmToken);

//       // إرسال التوكن للباك إند
//       await syncFcmTokenWithBackend(fcmToken);
//     }
//   } catch (error) {
//     console.log("Error requesting FCM permission:", error);
//   }
// }

// // 3. إرسال التوكن إلى الباك إند
// async function syncFcmTokenWithBackend(fcmToken: string) {
//   try {
//     const userToken = await getToken();
//     if (!userToken) return;

//     await axios.post(
//       "https://egypt.mahmoudalbatran.com/api/user/push-token",
//       { 
//         fcm_token: fcmToken,
//         platform: Platform.OS // إرسال نوع الجهاز لتسهيل استهداف الباك إند
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );
//     console.log("FCM Token synced with backend successfully.");
//   } catch (error) {
//     console.log("Failed to sync FCM token:", error);
//   }
// }









import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import axios from "axios";
import { getToken } from "./auth-storage";

/**
 * 1. معالج الإشعارات في الخلفية وحالة إغلاق التطبيق (Background & Killed State)
 * يتم تعريفه في أصل الملف ليعمل مع الأنظمة بدون React Component lifecycle.
 */
messaging().setBackgroundMessageHandler(
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log("Message handled in background/killed state:", remoteMessage);
  }
);

/**
 * 2. دالة طلب الصلاحيات وجلب الـ FCM Token لنظامي Android و iOS
 */
export async function requestFCMPermission(): Promise<string | null> {
  try {
    // طلب الصلاحية الصريح على iOS و Android 13+
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
    });

    const isEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!isEnabled) {
      console.log("FCM Permission denied by user.");
      return null;
    }

    console.log("FCM Authorized status:", authStatus);

    // التسجيل مع APNs على أجهزة iOS أولاً لمنع الفشل عند طلب FCM Token
    if (Platform.OS === "ios") {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
    }

    // جلب الـ Token الفعلي
    const fcmToken = await messaging().getToken();
    console.log("FCM Token (Cross-Platform):", fcmToken);

    // إرسال الـ Token للباك إند
    if (fcmToken) {
      await syncFcmTokenWithBackend(fcmToken);
    }

    return fcmToken;
  } catch (error) {
    console.log("Error requesting FCM permission:", error);
    return null;
  }
}

/**
 * 3. مستمع لتغيير الـ Token (Refresh Token Listener)
 * يتم استدعاؤه لتحديث التوكن تلقائياً في السيرفر عند التجديد
 */
export function listenToTokenRefresh(): () => void {
  return messaging().onTokenRefresh(async (newToken) => {
    console.log("FCM Token Refreshed:", newToken);
    await syncFcmTokenWithBackend(newToken);
  });
}

/**
 * 4. إرسال الـ Token إلى الباك إند الخاص بالمشروع
 */
export async function syncFcmTokenWithBackend(fcmToken: string): Promise<void> {
  try {
    const userToken = await getToken();
    if (!userToken) {
      console.log("No auth token available, skipping push token sync.");
      return;
    }

    await axios.post(
      "https://egypt.mahmoudalbatran.com/api/user/push-token",
      {
        fcm_token: fcmToken,
        platform: Platform.OS,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    console.log("FCM Token synced with backend successfully.");
  } catch (error) {
    console.log("Failed to sync FCM token with backend:", error);
  }
}