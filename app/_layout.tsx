// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//         <Stack.Screen name="home" options={{ headerShown: false }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }




import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { I18nManager } from "react-native";
import { ThemeProvider } from "@/context/ThemeContext";

// 1. Force RTL layout immediately
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}
export default function RootLayout() {
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

















// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Drawer } from "expo-router/drawer";
// import CustomDrawerContent from "@/components/CustomDrawerContent";
// import { Ionicons } from "@expo/vector-icons";
// import { I18nManager } from "react-native";
// import { ThemeProvider } from "@/context/ThemeContext";

// if (!I18nManager.isRTL) {
//   I18nManager.allowRTL(true);
//   I18nManager.forceRTL(true);
// }

// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <Drawer
//           drawerContent={(props) => <CustomDrawerContent {...props} />}
//           screenOptions={{
//             headerShown: false,
//             drawerPosition: "right", // Opens from Right to Left
//             drawerStyle: {
//               backgroundColor: "#0F0F0F",
//               width: 290,
//             },
//             drawerActiveTintColor: "#C09A3E",
//             drawerInactiveTintColor: "#9CA3AF",
//             drawerActiveBackgroundColor: "rgba(192, 154, 62, 0.15)",
//             drawerLabelStyle: {
//               fontSize: 15,
//               fontWeight: "bold",
//               marginRight: -10,
//             },
//             drawerItemStyle: {
//               borderRadius: 12,
//               marginVertical: 3,
//               paddingHorizontal: 6,
//             },
//           }}
//         >
//           {/* الرئيسية */}
//           <Drawer.Screen
//             name="home"
//             options={{
//               drawerLabel: "الرئيسية",
//               drawerIcon: ({ color, size }) => (
//                 <Ionicons name="home-outline" size={size} color={color} />
//               ),
//             }}
//           />

//           {/* الملف الشخصي */}
//           <Drawer.Screen
//             name="profile"
//             options={{
//               drawerLabel: "الملف الشخصي",
//               drawerIcon: ({ color, size }) => (
//                 <Ionicons name="person-outline" size={size} color={color} />
//               ),
//             }}
//           />

//           {/* الحملات والترشيحات */}
//           <Drawer.Screen
//             name="campaigns"
//             options={{
//               drawerLabel: "الحملات والترشيحات",
//               drawerIcon: ({ color, size }) => (
//                 <Ionicons name="megaphone-outline" size={size} color={color} />
//               ),
//             }}
//           />

//           {/* المستحقات والصرف */}
//           <Drawer.Screen
//             name="disbursements"
//             options={{
//               drawerLabel: "المستحقات والصرف",
//               drawerIcon: ({ color, size }) => (
//                 <Ionicons name="wallet-outline" size={size} color={color} />
//               ),
//             }}
//           />

//           {/* سجل الحضور والدوام */}
//           <Drawer.Screen
//             name="attendance"
//             options={{
//               drawerLabel: "سجل الحضور والدوام",
//               drawerIcon: ({ color, size }) => (
//                 <Ionicons name="calendar-outline" size={size} color={color} />
//               ),
//             }}
//           />

//           {/* طلب حضور ودوام */}
//           <Drawer.Screen
//             name="attendance-request"
//             options={{
//               drawerLabel: "طلب حضور ودوام",
//               drawerIcon: ({ color, size }) => (
//                 <Ionicons name="clipboard-outline" size={size} color={color} />
//               ),
//             }}
//           />

//           {/* Hidden Screens */}
//           <Drawer.Screen
//             name="index"
//             options={{
//               drawerItemStyle: { display: "none" },
//               drawerLabel: "الرئيسية",
//               drawerIcon: ({ color, size }) => (
//                 <Ionicons name="home-outline" size={size} color={color} />
//               ),
//             }}
//           />
//           <Drawer.Screen
//             name="(auth)"
//             options={{
//               drawerItemStyle: { display: "none" },
//             }}
//           />
//           <Drawer.Screen
//             name="modal"
//             options={{
//               drawerItemStyle: { display: "none" },
//             }}
//           />
//           <Drawer.Screen
//             name="(tabs)"
//             options={{
//               drawerItemStyle: { display: "none" },
//             }}
//           />
//         </Drawer>
//       </GestureHandlerRootView>
//     </ThemeProvider>
//   );
// }