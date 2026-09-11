
import { useEffect, useRef } from "react";
import { Platform, I18nManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { router, useRootNavigationState } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

import CustomDrawerContent from "@/components/CustomDrawerContent";
import { ThemeProvider } from "@/context/ThemeContext";
import { notificationService } from "@/services/notification.service";
// import "@/firebase.background"; // استيراد معالج الخلفية في أول السطر

// 1. Force RTL layout immediately
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

// 2. إعداد قناة الإشعارات لنظام أندرويد
async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default Notifications",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#C09A3E",
      sound: "default",
    });
  }
}

// 3. إعداد طريقة إظهار الإشعار والتطبيق مفتوح (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type NotificationData = {
  type?: "SALARY_DISBURSEMENT" | "ORDER" | "SYSTEM" | "CAMPAIGN";
  orderId?: string | number;
  [key: string]: any;
};

// 4. دالة التوجيه عند الضغط على الإشعار
function handleNotificationNavigation(data: NotificationData) {
  if (!data) return;

  if (data.type === "SALARY_DISBURSEMENT") {
    router.push("/disbursements");
  } else if (data.type === "CAMPAIGN") {
    router.push("/campaigns");
  } else if (data.orderId) {
    router.push(`/home`);
  }
}

export default function RootLayout() {
  const navState = useRootNavigationState();
  const handledInitialNotification = useRef(false);

  useEffect(() => {
    // التأكد من جاهزية الـ Navigation State قبل تفعيل الاستماع والتوجيه
    if (!navState?.key) return;

    // أ) إعداد قناة الأندرويد وتسجيل التوكن
    setupNotificationChannel();
    notificationService.registerForPushNotifications();

    // ب) استقبال الإشعار والتطبيق مفتوح (Foreground)
    const unsubscribeOnMessage = notificationService.onReceive(async (message) => {
      console.log("🟢 Foreground Notification:", message);

      if (message.notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: message.notification.title || "تنبيه جديد",
            body: message.notification.body || "",
            data: message.data,
          },
          trigger: null,
        });
      }
    });

    // ج) فتح التطبيق بالنقر على الإشعار من الخلفية (Background)
    const unsubscribeOnOpen = notificationService.onNotificationOpened((message) => {
      handledInitialNotification.current = true;
      const data = message.data as NotificationData;
      console.log("🟡 Opened from background:", data);
      handleNotificationNavigation(data);
    });

    // د) فتح التطبيق بالنقر على الإشعار والتطبيق مغلق تماماً (Cold Start)
    (async () => {
      const initialMessage = await notificationService.getInitialNotification();

      if (initialMessage && !handledInitialNotification.current) {
        handledInitialNotification.current = true;
        const data = initialMessage.data as NotificationData;
        console.log("🔴 Cold start from notification:", data);
        handleNotificationNavigation(data);
      }
    })();

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpen();
    };
  }, [navState?.key]);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerPosition: "right",
            drawerStyle: {
              backgroundColor: "#0F0F0F",
              width: 290,
            },
            drawerActiveTintColor: "#C09A3E",
            drawerInactiveTintColor: "#9CA3AF",
            drawerActiveBackgroundColor: "rgba(192, 154, 62, 0.15)",
            drawerLabelStyle: {
              fontSize: 15,
              fontWeight: "bold",
              marginRight: -10,
            },
            drawerItemStyle: {
              borderRadius: 12,
              marginVertical: 3,
              paddingHorizontal: 6,
            },
          }}
        >
          {/* Visible Screen: Home */}
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: "الرئيسية",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />

          
          <Drawer.Screen
            name="campaigns"
            options={{
              drawerLabel: "الحملات والترشيحات",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="megaphone-outline" size={size} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="disbursements"
            options={{
              drawerLabel: "المستحقات والصرف",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="wallet-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="attendance"
            options={{
              drawerLabel: "سجل الحضور والدوام",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="complaints"
            options={{
              drawerLabel: "الشكاوى",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="clipboard-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="notifications"
            options={{
              drawerLabel: "الاشعارات",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="notifications-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              drawerItemStyle: {  },
              drawerLabel: "الملف الشخصي",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="index"
            options={{
              drawerItemStyle: { display: "none" },
              drawerLabel: "الرئيسية",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />

          {/* Hidden Screens: Auth Routes & Modals */}
          <Drawer.Screen
            name="(auth)"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="modal"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}




































// To send notifications to your Android, iOS, and Web apps, you can use Firebase Cloud Messaging (FCM) [FCM]. FCM is a reliable, cross-platform messaging solution available at no-cost [FCM].

// Here are the two primary ways you can send notifications:

// Option 1: Send from the Firebase Console (No Coding Required)

// This is perfect for quick testing, marketing campaigns, or targeting specific user segments [Console].

// Go to the Firebase console and select your egyption project.

// In the left-hand navigation, go to Engagement > Messaging [Flutter].

// Click Create your first campaign (or New campaign) and select Firebase Notification messages [Flutter].

// Enter your notification title and body text [Console].

// Target your audience. You can select a specific app, such as your iOS app (com.abdullah.lahham123.maser) or one of your Android apps.

// Schedule the message (send immediately or at a specific time) and click Publish.

// Option 2: Send Programmatically (From Your Server)

// If you want to trigger automated notifications (like chat messages or transactional alerts) [Types], you can use the Firebase Admin SDK or the FCM HTTP v1 API from your backend server or Cloud Functions [Types].

// Here is how the flow works:

// Retrieve the Token: In your client apps (using Kotlin/Java for Android, Swift for iOS, or JavaScript for Web), request notification permissions and retrieve the unique FCM registration token for the device [Flutter].

// Store the Token: Send this registration token to your backend server and store it securely [Flutter].

// Send the Message: Your backend uses the Firebase Admin SDK to build and send a payload targeting that token [Types, Topics].

// For example, a standard JSON payload looks like this:

// {
//   "message": {
//     "token": "USER_REGISTRATION_TOKEN",
//     "notification": {
//       "title": "Hello!",
//       "body": "This is a notification."
//     }
//   }
// }
// Expand
// Quick Platform Setup Checklist:

// Android: Ensure your apps are configured with Google Play services [Flutter].

// iOS: Enable Push Notifications and Background Modes (Remote notifications) in Xcode [Flutter]. You will also need to upload your APNs Authentication Key (.p8 file) to the Cloud Messaging tab in your Firebase Project Settings [Flutter].

// Web: Generate a Web Push certificates key pair (VAPID key) in your Firebase Project Settings to associate with your web client [Flutter].

// You sent

// i cant fid Engagement