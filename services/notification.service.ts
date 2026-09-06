// import messaging, {
//   FirebaseMessagingTypes,
// } from "@react-native-firebase/messaging";
// import DeviceInfo from "react-native-device-info";
// import { Platform } from "react-native";
// import axios from "axios";
// import { getToken } from "@/lib/auth-storage";

// class NotificationService {
//   /**
//    * تسجيل الجهاز وجلب FCM Token مع التوافق الكامل مع Android 13+ و iOS
//    */
//   async registerForPushNotifications(): Promise<string | null> {
//     try {
//       // 1️⃣ طلب الصلاحيات (iOS + Android 13+)
//       const authStatus = await messaging().requestPermission({
//         alert: true,
//         badge: true,
//         sound: true,
//       });

//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (!enabled) {
//         console.log("❌ Notification permission denied");
//         return null;
//       }

//       // 2️⃣ تسجيل جهاز iOS مع خدمات APNs قبل جلب FCM Token
//       if (Platform.OS === "ios") {
//         if (!messaging().isDeviceRegisteredForRemoteMessages) {
//           await messaging().registerDeviceForRemoteMessages();
//         }
//       }

//       // 3️⃣ جلب FCM Token الفعلي
//       const fcmToken = await messaging().getToken();

//       if (!fcmToken) {
//         console.warn("⚠️ FCM token is null");
//         return null;
//       }

//       console.log("🔥 FCM TOKEN:", fcmToken);

//       // 4️⃣ جلب اسم الجهاز برفق
//       let deviceName = "Unknown Device";
//       try {
//         deviceName = await DeviceInfo.getDeviceName();
//       } catch (e) {
//         deviceName = `${Platform.OS} Device`;
//       }

//       // 5️⃣ إرسال التوكن للباك إند
//       this.sendTokenToBackend(fcmToken, deviceName).catch((err) => {
//         console.warn("⚠️ Failed to send FCM token to backend:", err?.message || err);
//       });

//       // 6️⃣ الاستماع لتجديد التوكن تلقائياً
//       messaging().onTokenRefresh(async (newToken) => {
//         console.log("🔄 FCM token refreshed:", newToken);
//         this.sendTokenToBackend(newToken, deviceName).catch((err) => {
//           console.warn("⚠️ Failed to refresh FCM token:", err?.message || err);
//         });
//       });

//       return fcmToken;
//     } catch (error) {
//       console.error("❌ Failed to register FCM:", error);
//       return null;
//     }
//   }

//   /**
//    * إرسال التوكن لباك إند المشروع الحالي
//    */
//   private async sendTokenToBackend(token: string, deviceName: string) {
//     const authToken = await getToken();

//     if (!authToken) {
//       console.log("⚠️ No auth token found, skipping device token sync.");
//       return;
//     }

//     await axios.post(
//       "https://egypt.mahmoudalbatran.com/api/device-tokens",
//       {
//         token,
//         device_name: deviceName,
//         platform: Platform.OS,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );

//     console.log("✅ FCM token successfully synced with backend");
//   }

//   // الاستماع للإشعارات في الواجهة (Foreground)
//   onReceive(
//     callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
//   ) {
//     return messaging().onMessage(callback);
//   }

//   // النقر على الإشعار والتطبيق في الخلفية (Background)
//   onNotificationOpened(
//     callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
//   ) {
//     return messaging().onNotificationOpenedApp(callback);
//   }

//   // النقر على الإشعار والتطبيق مغلق تماماً (Killed State)
//   async getInitialNotification() {
//     return messaging().getInitialNotification();
//   }
// }

// export const notificationService = new NotificationService();



// import messaging, {
//   FirebaseMessagingTypes,
// } from "@react-native-firebase/messaging";
// import DeviceInfo from "react-native-device-info";
// import { Platform } from "react-native";
// import axios from "axios";
// import { getToken } from "@/lib/auth-storage";

// // دالة جلب آمنة تضمن الوصول إلى messaging() بدون أخطاء TypeError
// const getMessaging = () => {
//   return typeof messaging === "function" ? messaging : (messaging as any).default;
// };

// class NotificationService {
//   /**
//    * تسجيل الجهاز وجلب FCM Token مع التوافق الكامل مع Android 13+ و iOS
//    */
//   async registerForPushNotifications(): Promise<string | null> {
//     try {
//       const msg = getMessaging();
//       if (!msg || typeof msg !== "function") {
//         console.warn("⚠️ Firebase Messaging native module is not available.");
//         return null;
//       }

//       // 1️⃣ طلب الصلاحيات (iOS + Android 13+)
//       const authStatus = await msg().requestPermission({
//         alert: true,
//         badge: true,
//         sound: true,
//       });

//       const enabled =
//         authStatus === msg.AuthorizationStatus.AUTHORIZED ||
//         authStatus === msg.AuthorizationStatus.PROVISIONAL;

//       if (!enabled) {
//         console.log("❌ Notification permission denied");
//         return null;
//       }

//       // 2️⃣ تسجيل جهاز iOS مع خدمات APNs قبل جلب FCM Token
//       if (Platform.OS === "ios") {
//         if (!msg().isDeviceRegisteredForRemoteMessages) {
//           await msg().registerDeviceForRemoteMessages();
//         }
//       }

//       // 3️⃣ جلب FCM Token الفعلي
//       const fcmToken = await msg().getToken();

//       if (!fcmToken) {
//         console.warn("⚠️ FCM token is null");
//         return null;
//       }

//       console.log("🔥 FCM TOKEN:", fcmToken);

//       // 4️⃣ جلب اسم الجهاز برفق
//       let deviceName = "Unknown Device";
//       try {
//         deviceName = await DeviceInfo.getDeviceName();
//       } catch (e) {
//         deviceName = `${Platform.OS} Device`;
//       }

//       // 5️⃣ إرسال التوكن للباك إند
//       this.sendTokenToBackend(fcmToken, deviceName).catch((err) => {
//         console.warn("⚠️ Failed to send FCM token to backend:", err?.message || err);
//       });

//       // 6️⃣ الاستماع لتجديد التوكن تلقائياً
//       msg().onTokenRefresh(async (newToken: string) => {
//         console.log("🔄 FCM token refreshed:", newToken);
//         this.sendTokenToBackend(newToken, deviceName).catch((err) => {
//           console.warn("⚠️ Failed to refresh FCM token:", err?.message || err);
//         });
//       });

//       return fcmToken;
//     } catch (error) {
//       console.error("❌ Failed to register FCM:", error);
//       return null;
//     }
//   }

//   /**
//    * إرسال التوكن لباك إند المشروع الحالي
//    */
//   private async sendTokenToBackend(token: string, deviceName: string) {
//     const authToken = await getToken();

//     if (!authToken) {
//       console.log("⚠️ No auth token found, skipping device token sync.");
//       return;
//     }

//     await axios.post(
//       "https://egypt.mahmoudalbatran.com/api/device-tokens",
//       {
//         token,
//         device_name: deviceName,
//         platform: Platform.OS,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );

//     console.log("✅ FCM token successfully synced with backend");
//   }

//   // الاستماع للإشعارات في الواجهة (Foreground)
//   onReceive(
//     callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
//   ) {
//     const msg = getMessaging();
//     if (!msg) return () => {};
//     return msg().onMessage(callback);
//   }

//   // النقر على الإشعار والتطبيق في الخلفية (Background)
//   onNotificationOpened(
//     callback: (message: FirebaseMessagingTypes.RemoteMessage) => void
//   ) {
//     const msg = getMessaging();
//     if (!msg) return () => {};
//     return msg().onNotificationOpenedApp(callback);
//   }

//   // النقر على الإشعار والتطبيق مغلق تماماً (Killed State)
//   async getInitialNotification() {
//     const msg = getMessaging();
//     if (!msg) return null;
//     return msg().getInitialNotification();
//   }
// }

// export const notificationService = new NotificationService();




// import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
// import DeviceInfo from "react-native-device-info";
// import { Platform } from "react-native";
// import axios from "axios";
// import { getToken } from "@/lib/auth-storage";

// // دالة آمنة تماماً لمنع الـ TypeError في حالة غياب الـ Native Module
// function safeGetMessaging(): any {
//   try {
//     if (typeof messaging === "function") {
//       return messaging;
//     }
//     const req = require("@react-native-firebase/messaging");
//     if (typeof req === "function") return req;
//     if (typeof req?.default === "function") return req.default;
//     return null;
//   } catch (e) {
//     return null;
//   }
// }

// class NotificationService {
//   /**
//    * تسجيل الجهاز وجلب FCM Token
//    */
//   async registerForPushNotifications(): Promise<string | null> {
//     try {
//       const msgFn = safeGetMessaging();
//       if (!msgFn) {
//         console.warn("⚠️ Firebase Messaging native module is not ready.");
//         return null;
//       }

//       const messagingInstance = msgFn();

//       // 1️⃣ طلب الصلاحيات
//       const authStatus = await messagingInstance.requestPermission({
//         alert: true,
//         badge: true,
//         sound: true,
//       });

//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (!enabled) {
//         console.log("❌ Notification permission denied");
//         return null;
//       }

//       // 2️⃣ تسجيل iOS APNs
//       if (Platform.OS === "ios") {
//         if (!messagingInstance.isDeviceRegisteredForRemoteMessages) {
//           await messagingInstance.registerDeviceForRemoteMessages();
//         }
//       }

//       // 3️⃣ جلب FCM Token
//       const fcmToken = await messagingInstance.getToken();

//       if (!fcmToken) {
//         console.warn("⚠️ FCM token is null");
//         return null;
//       }

//       console.log("🔥 FCM TOKEN:", fcmToken);

//       // 4️⃣ جلب اسم الجهاز
//       let deviceName = `${Platform.OS} Device`;
//       try {
//         deviceName = await DeviceInfo.getDeviceName();
//       } catch (e) {
//         // Fallback
//       }

//       // 5️⃣ إرسال التوكن للباك إند
//       this.sendTokenToBackend(fcmToken, deviceName).catch((err) => {
//         console.warn("⚠️ Failed to send FCM token to backend:", err?.message || err);
//       });

//       // 6️⃣ الاستماع للتجديد
//       messagingInstance.onTokenRefresh((newToken: string) => {
//         console.log("🔄 FCM token refreshed:", newToken);
//         this.sendTokenToBackend(newToken, deviceName).catch((err) => {
//           console.warn("⚠️ Failed to refresh FCM token:", err?.message || err);
//         });
//       });

//       return fcmToken;
//     } catch (error) {
//       console.error("❌ Failed to register FCM:", error);
//       return null;
//     }
//   }

//   private async sendTokenToBackend(token: string, deviceName: string) {
//     const authToken = await getToken();

//     if (!authToken) {
//       console.log("⚠️ No auth token found, skipping device token sync.");
//       return;
//     }

//     await axios.post(
//       "https://egypt.mahmoudalbatran.com/api/device-tokens",
//       {
//         token,
//         device_name: deviceName,
//         platform: Platform.OS,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );

//     console.log("✅ FCM token successfully synced with backend");
//   }

//   onReceive(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void) {
//     try {
//       const msgFn = safeGetMessaging();
//       if (!msgFn) return () => {};
//       return msgFn().onMessage(callback);
//     } catch {
//       return () => {};
//     }
//   }

//   onNotificationOpened(callback: (message: FirebaseMessagingTypes.RemoteMessage) => void) {
//     try {
//       const msgFn = safeGetMessaging();
//       if (!msgFn) return () => {};
//       return msgFn().onNotificationOpenedApp(callback);
//     } catch {
//       return () => {};
//     }
//   }

//   async getInitialNotification() {
//     try {
//       const msgFn = safeGetMessaging();
//       if (!msgFn) return null;
//       return msgFn().getInitialNotification();
//     } catch {
//       return null;
//     }
//   }
// }

// export const notificationService = new NotificationService();



















import { getApp } from "@react-native-firebase/app";

import {
  AuthorizationStatus,
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from "@react-native-firebase/messaging";

import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";
import axios from "axios";

import { getToken as getAuthToken } from "@/lib/auth-storage";
import { api } from "./api";

class NotificationService {
  private getMessagingInstance() {
    const firebaseApp = getApp();

    return getMessaging(firebaseApp);
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      const messaging = this.getMessagingInstance();

      console.log("🔥 Firebase Messaging instance created");

      /*
       * RNFirebase 25+ deprecated its own permission APIs
       * in favor of expo-notifications / react-native-permissions.
       *
       * We are keeping this here temporarily so that the
       * Firebase module can be tested independently first.
       */
      const authStatus = await requestPermission(messaging, {
        alert: true,
        badge: true,
        sound: true
      });

      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log("❌ Notification permission denied");

        return null;
      }

      /*
       * iOS requires remote-message registration before
       * requesting an FCM token.
       */
      if (Platform.OS === "ios") {
        if (!messaging.isDeviceRegisteredForRemoteMessages) {
          await registerDeviceForRemoteMessages(messaging);
        }
      }

      const fcmToken = await getToken(messaging);

      if (!fcmToken) {
        console.warn("⚠️ FCM token is null");

        return null;
      }

      console.log("🔥 FCM TOKEN:");
      console.log(fcmToken);

      let deviceName = `${Platform.OS} Device`;

      try {
        deviceName = await DeviceInfo.getDeviceName();
      } catch (error) {
        console.warn(
          "⚠️ Could not get device name:",
          error
        );
      }

      /*
       * Send token to backend.
       *
       * We intentionally do not await this request because
       * token registration should not block app startup.
       */
      this.sendTokenToBackend(
        fcmToken,
        deviceName
      ).catch((error) => {
        console.warn(
          "⚠️ Failed to send FCM token to backend:",
          error?.message || error
        );
      });

      /*
       * Listen for future FCM token changes.
       */
      onTokenRefresh(messaging, (newToken) => {
        console.log(
          "🔄 FCM token refreshed:"
        );

        console.log(newToken);

        this.sendTokenToBackend(
          newToken,
          deviceName
        ).catch((error) => {
          console.warn(
            "⚠️ Failed to refresh FCM token on backend:",
            error?.message || error
          );
        });
      });

      return fcmToken;
    } catch (error) {
      console.error(
        "❌ Failed to register FCM:",
        error
      );

      return null;
    }
  }

  private async sendTokenToBackend(
    token: string,
    deviceName: string
  ) {
    const authToken = await getAuthToken();

    if (!authToken) {
      console.log(
        "⚠️ No auth token found."
      );

      console.log(
        "⚠️ Skipping device token backend sync."
      );

      return;
    }

    try {
      console.log(authToken, 'rrrrrrrrrrrrrrrrrrrrrrrrrrr')
      await api.post(
        "https://egypt.mahmoudalbatran.com/api/device-tokens",
        {
          token,
          device_name: deviceName,
          platform: Platform.OS
        }
        // ,
        // {
        //   headers: {
        //     Authorization: `Bearer ${authToken}`
        //   }
        // }
      );

      console.log(
        "✅ FCM token successfully synced with backend"
      );
    } catch (error) {
      console.error(
        "❌ Backend FCM token sync failed:",
        error
      );

      throw error;
    }
  }

  onReceive(
    callback: (
      message: FirebaseMessagingTypes.RemoteMessage
    ) => void
  ) {
    const messaging = this.getMessagingInstance();

    console.log(
      "📡 Registering FCM foreground listener"
    );

    return onMessage(
      messaging,
      callback
    );
  }

  onNotificationOpened(
    callback: (
      message: FirebaseMessagingTypes.RemoteMessage
    ) => void
  ) {
    const messaging = this.getMessagingInstance();

    console.log(
      "📡 Registering FCM notification-open listener"
    );

    return onNotificationOpenedApp(
      messaging,
      callback
    );
  }

  async getInitialNotification() {
    const messaging = this.getMessagingInstance();

    console.log(
      "📡 Checking initial FCM notification"
    );

    return getInitialNotification(
      messaging
    );
  }
}

export const notificationService =
  new NotificationService();

















// {"employee": {"branch": "مقر الرئيسي", "department": "دائرة الحاسوب", "id": 495, "identification": "407966027", "name": "عبد الله مصطفى كامل اللحام", "work": "الحاسوب"}, "token": "139|Z8Odl4zsn36mtuGl529sWoGoAkQ8KzS5l1imSKli34e6ccf1"} uuuuuuuuuuuuuuuuuuuuu








// import messaging, {
//   FirebaseMessagingTypes,
// } from "@react-native-firebase/messaging";

// import DeviceInfo from "react-native-device-info";
// import { Platform } from "react-native";
// import axios from "axios";

// import { getToken } from "@/lib/auth-storage";

// class NotificationService {
//   /**
//    * Register device and get native FCM token.
//    */
//   async registerForPushNotifications(): Promise<string | null> {
//     try {
//       const messagingInstance = messaging();

//       // 1. Request notification permission
//       const authStatus = await messagingInstance.requestPermission({
//         alert: true,
//         badge: true,
//         sound: true,
//       });

//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (!enabled) {
//         console.log("❌ Notification permission denied");
//         return null;
//       }

//       // 2. Register APNs on iOS
//       if (Platform.OS === "ios") {
//         if (!messagingInstance.isDeviceRegisteredForRemoteMessages) {
//           await messagingInstance.registerDeviceForRemoteMessages();
//         }
//       }

//       // 3. Get native FCM token
//       const fcmToken = await messagingInstance.getToken();

//       if (!fcmToken) {
//         console.warn("⚠️ FCM token is null");
//         return null;
//       }

//       console.log("🔥 FCM TOKEN:", fcmToken);

//       // 4. Device name
//       let deviceName = `${Platform.OS} Device`;

//       try {
//         deviceName = await DeviceInfo.getDeviceName();
//       } catch {
//         // fallback
//       }

//       // 5. Sync token with backend
//       this.sendTokenToBackend(fcmToken, deviceName).catch((error) => {
//         console.warn(
//           "⚠️ Failed to send FCM token to backend:",
//           error?.message || error
//         );
//       });

//       // 6. Listen for token refresh
//       messagingInstance.onTokenRefresh((newToken) => {
//         console.log("🔄 FCM token refreshed:", newToken);

//         this.sendTokenToBackend(newToken, deviceName).catch((error) => {
//           console.warn(
//             "⚠️ Failed to refresh FCM token:",
//             error?.message || error
//           );
//         });
//       });

//       return fcmToken;
//     } catch (error) {
//       console.error("❌ Failed to register FCM:", error);
//       return null;
//     }
//   }

//   private async sendTokenToBackend(
//     token: string,
//     deviceName: string
//   ) {
//     const authToken = await getToken();

//     if (!authToken) {
//       console.log(
//         "⚠️ No auth token found, skipping device token sync."
//       );
//       return;
//     }

//     await axios.post(
//       "https://egypt.mahmoudalbatran.com/api/device-tokens",
//       {
//         token,
//         device_name: deviceName,
//         platform: Platform.OS,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );

//     console.log("✅ FCM token successfully synced with backend");
//   }

//   /**
//    * Foreground FCM messages.
//    */
//   onReceive(
//     callback: (
//       message: FirebaseMessagingTypes.RemoteMessage
//     ) => void
//   ) {
//     return messaging().onMessage(callback);
//   }

//   /**
//    * Notification opened while app was in background.
//    */
//   onNotificationOpened(
//     callback: (
//       message: FirebaseMessagingTypes.RemoteMessage
//     ) => void
//   ) {
//     return messaging().onNotificationOpenedApp(callback);
//   }

//   /**
//    * Notification opened app from completely terminated state.
//    */
//   async getInitialNotification() {
//     return messaging().getInitialNotification();
//   }
// }

// export const notificationService = new NotificationService();