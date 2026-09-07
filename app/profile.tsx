// import React, { useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   RefreshControl,
//   StatusBar,
//   Alert,
// } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { router } from 'expo-router'
// import { removeToken } from '@/lib/auth-storage'
// import { useTheme } from '@/context/ThemeContext'
// import { useUserStore } from '@/store/useUserStore'

// export default function ProfilePage() {
//   const { colorScheme, toggleTheme } = useTheme()
//   const isDark = colorScheme === 'dark'

//   // جلب البيانات والدوال من Zustand Store مباشرة
//   const { user, loading, fetchUser, clearUser } = useUserStore()
//   const [refreshing, setRefreshing] = useState(false)

//   useEffect(() => {
//     // سيتم جلب البيانات من الـ API فقط في أول مرة، وفي المرات القادمة سيعرضها فوراً من الميموري
//     fetchUser()
//   }, [])

//   /* Pull to Refresh الإجباري */
//   const onRefresh = async () => {
//     setRefreshing(true)
//     await fetchUser(true) // forceRefresh = true
//     setRefreshing(false)
//   }

//   /* Logout Action */
//   const handleLogout = () => {
//     Alert.alert('تسجيل الخروج', 'هل أنت تأكد من رغبتك في تسجيل الخروج؟', [
//       { text: 'إلغاء', style: 'cancel' },
//       {
//         text: 'تأكيد',
//         style: 'destructive',
//         onPress: async () => {
//           clearUser() // تفريغ بيانات المستخدم من Zustand Store
//           await removeToken()
//           router.replace('/(auth)/login')
//         },
//       },
//     ])
//   }

//   // عرض التحميل فقط في الزيارة الأولى المطلقة قبل إحضار البيانات
//   if (loading && !user && !refreshing) {
//     return (
//       <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F] items-center justify-center">
//         <ActivityIndicator size="large" color="#C09A3E" />
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

//       {/* خلفيات جمالية مضيئة */}
//       <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C09A3E]/10" />
//       <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-[#C8102E]/10" />

//       {/* Header Bar */}
//       <View className="px-5 pt-3 pb-4 flex-row items-center justify-between border-b border-gray-200/60 dark:border-white/10 mb-2">
//         <TouchableOpacity
//           onPress={() => router.back()}
//           activeOpacity={0.7}
//           className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center shadow-sm"
//         >
//           <Ionicons
//             name="arrow-forward"
//             size={20}
//             color={isDark ? '#FFF' : '#111827'}
//           />
//         </TouchableOpacity>

//         <Text className="text-xl font-black text-gray-900 dark:text-white">
//           الملف الشخصي
//         </Text>

//         <TouchableOpacity
//           onPress={toggleTheme}
//           activeOpacity={0.7}
//           className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center shadow-sm"
//         >
//           <Ionicons
//             name={isDark ? 'sunny-outline' : 'moon-outline'}
//             size={20}
//             color="#C09A3E"
//           />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 60 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#C09A3E"
//             colors={['#C09A3E']}
//           />
//         }
//       >
//         {/* Profile Card */}
//         <View className="px-5 mt-4">
//           <View className="p-5 rounded-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm items-center relative overflow-hidden">
//             <View className="absolute top-0 right-0 left-0 h-1.5 bg-[#C09A3E]" />

//             <View className="w-20 h-20 rounded-full bg-[#C09A3E]/15 items-center justify-center border-2 border-[#C09A3E] mb-3 mt-2">
//               <Ionicons name="person-outline" size={40} color="#C09A3E" />
//             </View>

//             <Text className="text-lg font-black text-gray-900 dark:text-white text-center mb-1">
//               {user?.name || 'غير معروف'}
//             </Text>

//             <View className="flex-row items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 mb-3">
//               <Ionicons name="briefcase-outline" size={14} color="#C09A3E" />
//               <Text className="text-xs font-bold text-gray-600 dark:text-gray-300">
//                 {user?.work || 'موظف'}
//               </Text>
//             </View>

//             <View
//               className={`px-3 py-0.5 rounded-full border ${
//                 user?.is_active
//                   ? 'bg-emerald-500/10 border-emerald-500/30'
//                   : 'bg-rose-500/10 border-rose-500/30'
//               }`}
//             >
//               <Text
//                 className={`text-[11px] font-extrabold ${
//                   user?.is_active
//                     ? 'text-emerald-600 dark:text-emerald-400'
//                     : 'text-rose-600 dark:text-rose-400'
//                 }`}
//               >
//                 {user?.is_active ? 'الحساب نشط' : 'الحساب متوقف'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Info Grid */}
//         <View className="px-5 mt-5">
//           <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">
//             المعلومات الشخصية
//           </Text>

//           <View className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm gap-4">
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center gap-3">
//                 <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
//                   <Ionicons name="card-outline" size={18} color="#C09A3E" />
//                 </View>
//                 <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
//                   رقم الهوية
//                 </Text>
//               </View>
//               <Text className="text-sm font-black text-gray-900 dark:text-white">
//                 {user?.identification || '-'}
//               </Text>
//             </View>

//             <View className="h-[1px] bg-gray-100 dark:bg-white/5" />

//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center gap-3">
//                 <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
//                   <Ionicons name="call-outline" size={18} color="#C09A3E" />
//                 </View>
//                 <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
//                   رقم الجوال الرئيسي
//                 </Text>
//               </View>
//               <Text className="text-sm font-black text-gray-900 dark:text-white">
//                 {user?.phone_number || '-'}
//               </Text>
//             </View>

//             {user?.phone_other && (
//               <>
//                 <View className="h-[1px] bg-gray-100 dark:bg-white/5" />
//                 <View className="flex-row items-center justify-between">
//                   <View className="flex-row items-center gap-3">
//                     <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
//                       <Ionicons
//                         name="phone-portrait-outline"
//                         size={18}
//                         color="#C09A3E"
//                       />
//                     </View>
//                     <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
//                       رقم جوال إضافي
//                     </Text>
//                   </View>
//                   <Text className="text-sm font-black text-gray-900 dark:text-white">
//                     {user?.phone_other}
//                   </Text>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>

//         {/* Job Rates */}
//         <View className="px-5 mt-5">
//           <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">
//             تفاصيل العمل والراتب
//           </Text>

//           <View className="flex-row gap-3">
//             <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
//               <View className="w-8 h-8 rounded-xl bg-amber-500/10 items-center justify-center mb-2">
//                 <Ionicons name="sunny-outline" size={18} color="#D97706" />
//               </View>
//               <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
//                 أجرة اليوم
//               </Text>
//               <Text className="text-base font-black text-gray-900 dark:text-white">
//                 {user?.day_rate ? `${user.day_rate} ₪` : '-'}
//               </Text>
//             </View>

//             <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
//               <View className="w-8 h-8 rounded-xl bg-indigo-500/10 items-center justify-center mb-2">
//                 <Ionicons name="moon-outline" size={18} color="#6366F1" />
//               </View>
//               <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
//                 أجرة الليلة
//               </Text>
//               <Text className="text-base font-black text-gray-900 dark:text-white">
//                 {user?.night_rate ? `${user.night_rate} ₪` : '-'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Logout */}
//         <View className="px-5 mt-6">
//           <TouchableOpacity
//             onPress={handleLogout}
//             activeOpacity={0.8}
//             className="flex-row items-center justify-center bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl gap-2"
//           >
//             <Ionicons name="log-out-outline" size={20} color="#C8102E" />
//             <Text className="text-sm font-black text-[#C8102E]">
//               تسجيل الخروج
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }













import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { removeToken } from '@/lib/auth-storage'
import { useTheme } from '@/context/ThemeContext'
import { useUserStore } from '@/store/useUserStore'
import { UpdatePasswordModal } from '@/components/profile/UpdatePasswordModal'
import ScreenHeader from '@/components/ScreenHeader'

export default function ProfilePage() {
  const { colorScheme, toggleTheme } = useTheme()
  const isDark = colorScheme === 'dark'

  const { user, loading, fetchUser, clearUser } = useUserStore()
  const [refreshing, setRefreshing] = useState(false)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchUser(true)
    setRefreshing(false)
  }

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل أنت تأكد من رغبتك في تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تأكيد',
        style: 'destructive',
        onPress: async () => {
          clearUser()
          await removeToken()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  if (loading && !user && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F] items-center justify-center">
        <ActivityIndicator size="large" color="#C09A3E" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C09A3E]/10" />
      <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-[#C8102E]/10" />

      {/* Header Bar */}
      {/* <View className="px-5 pt-3 pb-4 flex-row items-center justify-between border-b border-gray-200/60 dark:border-white/10 mb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center shadow-sm"
        >
          <Ionicons name="arrow-forward" size={20} color={isDark ? '#FFF' : '#111827'} />
        </TouchableOpacity>

        <Text className="text-xl font-black text-gray-900 dark:text-white">الملف الشخصي</Text>

        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center shadow-sm"
        >
          <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color="#C09A3E" />
        </TouchableOpacity>
      </View> */}
<ScreenHeader title="الملف الشخصي" iconName="person-outline" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C09A3E"
            colors={['#C09A3E']}
          />
        }
      >
        {/* Profile Card */}
        <View className="px-5 mt-4">
          <View className="p-5 rounded-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm items-center relative overflow-hidden">
            <View className="absolute top-0 right-0 left-0 h-1.5 bg-[#C09A3E]" />

            <View className="w-20 h-20 rounded-full bg-[#C09A3E]/15 items-center justify-center border-2 border-[#C09A3E] mb-3 mt-2">
              <Ionicons name="person-outline" size={40} color="#C09A3E" />
            </View>

            <Text className="text-lg font-black text-gray-900 dark:text-white text-center mb-1">
              {user?.name || 'غير معروف'}
            </Text>

            <View className="flex-row items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 mb-3">
              <Ionicons name="briefcase-outline" size={14} color="#C09A3E" />
              <Text className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {user?.work || 'موظف'}
              </Text>
            </View>

            <View
              className={`px-3 py-0.5 rounded-full border ${
                user?.is_active
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <Text
                className={`text-[11px] font-extrabold ${
                  user?.is_active
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {user?.is_active ? 'الحساب نشط' : 'الحساب متوقف'}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View className="px-5 mt-5">
          <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">
            المعلومات الشخصية
          </Text>

          <View className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
                  <Ionicons name="card-outline" size={18} color="#C09A3E" />
                </View>
                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  رقم الهوية
                </Text>
              </View>
              <Text className="text-sm font-black text-gray-900 dark:text-white">
                {user?.identification || '-'}
              </Text>
            </View>

            <View className="h-[1px] bg-gray-100 dark:bg-white/5" />

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
                  <Ionicons name="call-outline" size={18} color="#C09A3E" />
                </View>
                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  رقم الجوال الرئيسي
                </Text>
              </View>
              <Text className="text-sm font-black text-gray-900 dark:text-white">
                {user?.phone_number || '-'}
              </Text>
            </View>

            {user?.phone_other && (
              <>
                <View className="h-[1px] bg-gray-100 dark:bg-white/5" />
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
                      <Ionicons name="phone-portrait-outline" size={18} color="#C09A3E" />
                    </View>
                    <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      رقم جوال إضافي
                    </Text>
                  </View>
                  <Text className="text-sm font-black text-gray-900 dark:text-white">
                    {user?.phone_other}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        
        {/* Job Rates */}
         <View className="px-5 mt-5">
         <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">
             تفاصيل العمل والراتب
           </Text>

          <View className="flex-row gap-3">
             <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
               <View className="w-8 h-8 rounded-xl bg-amber-500/10 items-center justify-center mb-2">
                 <Ionicons name="sunny-outline" size={18} color="#D97706" />
               </View>
               <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                 أجرة اليوم
               </Text>
               <Text className="text-base font-black text-gray-900 dark:text-white">
                 {user?.day_rate ? `${user.day_rate} ₪` : '-'}
               </Text>
             </View>

             <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
               <View className="w-8 h-8 rounded-xl bg-indigo-500/10 items-center justify-center mb-2">
                 <Ionicons name="moon-outline" size={18} color="#6366F1" />
               </View>
               <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                 أجرة الليلة
               </Text>
               <Text className="text-base font-black text-gray-900 dark:text-white">
                 {user?.night_rate ? `${user.night_rate} ₪` : '-'}
               </Text>
             </View>
           </View>
         </View>


        {/* Security Section */}
        <View className="px-5 mt-5">
          <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">الأمان والحساب</Text>

          <TouchableOpacity
            onPress={() => setIsPasswordModalVisible(true)}
            activeOpacity={0.7}
            className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-xl bg-[#C09A3E]/10 items-center justify-center">
                <Ionicons name="lock-closed-outline" size={18} color="#C09A3E" />
              </View>
              <Text className="text-sm font-bold text-gray-900 dark:text-white">
                تغيير كلمة المرور
              </Text>
            </View>
            <Ionicons name="chevron-back" size={18} color={isDark ? '#666' : '#AAA'} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="flex-row items-center justify-center bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl gap-2"
          >
            <Ionicons name="log-out-outline" size={20} color="#C8102E" />
            <Text className="text-sm font-black text-[#C8102E]">تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* المكون المستقل */}
      <UpdatePasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      />
    </SafeAreaView>
  )
}