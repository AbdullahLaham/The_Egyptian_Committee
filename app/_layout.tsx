
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
            drawerPosition: "left",
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
            name="profile"
            options={{
              drawerItemStyle: { display: "none" },
              drawerLabel: "الملف الشخصي",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
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
            name="attendance-requests"
            options={{
              drawerLabel: "طلب حضور ودوام",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="clipboard-outline" size={size} color={color} />
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