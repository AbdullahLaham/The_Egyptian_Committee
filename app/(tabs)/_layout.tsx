import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}













// app/(tabs)/_layout.tsx

// import React from 'react'
// import { Tabs } from 'expo-router'

// import { useColorScheme } from '@/hooks/use-color-scheme'
// import { TabBarIcon } from '@/components/tab-bar-icon'

// export default function TabLayout() {
//   const colorScheme = useColorScheme()
//   const isDark = colorScheme === 'dark'

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,

//         tabBarActiveTintColor: '#ef4444',
//         tabBarInactiveTintColor: isDark
//           ? '#6b7280'
//           : '#9ca3af',

//         tabBarShowLabel: true,

//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '700',
//           marginTop: 6,
//         },

//         tabBarStyle: {
//           position: 'absolute',

//           bottom: 18,
//           left: 16,
//           right: 16,

//           height: 78,

//           borderTopWidth: 0,

//           borderRadius: 30,

//           backgroundColor: isDark
//             ? '#0f0f0f'
//             : '#ffffff',

//           elevation: 0,

//           shadowColor: '#ef4444',
//           shadowOffset: {
//             width: 0,
//             height: 10,
//           },
//           shadowOpacity: 0.2,
//           shadowRadius: 20,
//         },

//         tabBarItemStyle: {
//           paddingTop: 6,
//         },
//       }}>
      
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',

//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon
//               name="home"
//               focused={focused}
//               color={color}
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="search"
//         options={{
//           title: 'Search',

//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon
//               name="search"
//               focused={focused}
//               color={color}
//             />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',

//           tabBarIcon: ({ focused, color }) => (
//             <TabBarIcon
//               name="person"
//               focused={focused}
//               color={color}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   )
// }