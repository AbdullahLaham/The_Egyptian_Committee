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
// import { UpdatePasswordModal } from '@/components/profile/UpdatePasswordModal'
// import ScreenHeader from '@/components/ScreenHeader'

// export default function ProfilePage() {
//   const { colorScheme, toggleTheme } = useTheme()
//   const isDark = colorScheme === 'dark'

//   const { user, loading, fetchUser, clearUser } = useUserStore()
//   const [refreshing, setRefreshing] = useState(false)
//   const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)

//   useEffect(() => {
//     fetchUser()
//   }, [])

//   const onRefresh = async () => {
//     setRefreshing(true)
//     await fetchUser(true)
//     setRefreshing(false)
//   }

//   const handleLogout = () => {
//     Alert.alert('تسجيل الخروج', 'هل أنت تأكد من رغبتك في تسجيل الخروج؟', [
//       { text: 'إلغاء', style: 'cancel' },
//       {
//         text: 'تأكيد',
//         style: 'destructive',
//         onPress: async () => {
//           clearUser()
//           await removeToken()
//           router.replace('/(auth)/login')
//         },
//       },
//     ])
//   }

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

//       <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C09A3E]/10" />
//       <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-[#C8102E]/10" />

//       {/* Header Bar */}
//       {/* <View className="px-5 pt-3 pb-4 flex-row items-center justify-between border-b border-gray-200/60 dark:border-white/10 mb-2">
//         <TouchableOpacity
//           onPress={() => router.back()}
//           activeOpacity={0.7}
//           className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center shadow-sm"
//         >
//           <Ionicons name="arrow-forward" size={20} color={isDark ? '#FFF' : '#111827'} />
//         </TouchableOpacity>

//         <Text className="text-xl font-black text-gray-900 dark:text-white">الملف الشخصي</Text>

//         <TouchableOpacity
//           onPress={toggleTheme}
//           activeOpacity={0.7}
//           className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center shadow-sm"
//         >
//           <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color="#C09A3E" />
//         </TouchableOpacity>
//       </View> */}
// <ScreenHeader title="الملف الشخصي" iconName="person-outline" />
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
//                       <Ionicons name="phone-portrait-outline" size={18} color="#C09A3E" />
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
//          <View className="px-5 mt-5">
//          <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">
//              تفاصيل العمل والراتب
//            </Text>

//           <View className="flex-row gap-3">
//              <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
//                <View className="w-8 h-8 rounded-xl bg-amber-500/10 items-center justify-center mb-2">
//                  <Ionicons name="sunny-outline" size={18} color="#D97706" />
//                </View>
//                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
//                  أجرة اليوم
//                </Text>
//                <Text className="text-base font-black text-gray-900 dark:text-white">
//                  {user?.day_rate ? `${user.day_rate} ₪` : '-'}
//                </Text>
//              </View>

//              <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
//                <View className="w-8 h-8 rounded-xl bg-indigo-500/10 items-center justify-center mb-2">
//                  <Ionicons name="moon-outline" size={18} color="#6366F1" />
//                </View>
//                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
//                  أجرة الليلة
//                </Text>
//                <Text className="text-base font-black text-gray-900 dark:text-white">
//                  {user?.night_rate ? `${user.night_rate} ₪` : '-'}
//                </Text>
//              </View>
//            </View>
//          </View>


//         {/* Security Section */}
//         <View className="px-5 mt-5">
//           <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">الأمان والحساب</Text>

//           <TouchableOpacity
//             onPress={() => setIsPasswordModalVisible(true)}
//             activeOpacity={0.7}
//             className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm flex-row items-center justify-between"
//           >
//             <View className="flex-row items-center gap-3">
//               <View className="w-9 h-9 rounded-xl bg-[#C09A3E]/10 items-center justify-center">
//                 <Ionicons name="lock-closed-outline" size={18} color="#C09A3E" />
//               </View>
//               <Text className="text-sm font-bold text-gray-900 dark:text-white">
//                 تغيير كلمة المرور
//               </Text>
//             </View>
//             <Ionicons name="chevron-back" size={18} color={isDark ? '#666' : '#AAA'} />
//           </TouchableOpacity>
//         </View>

//         {/* Logout */}
//         <View className="px-5 mt-6">
//           <TouchableOpacity
//             onPress={handleLogout}
//             activeOpacity={0.8}
//             className="flex-row items-center justify-center bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl gap-2"
//           >
//             <Ionicons name="log-out-outline" size={20} color="#C8102E" />
//             <Text className="text-sm font-black text-[#C8102E]">تسجيل الخروج</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* المكون المستقل */}
//       <UpdatePasswordModal
//         visible={isPasswordModalVisible}
//         onClose={() => setIsPasswordModalVisible(false)}
//       />
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
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

import { removeToken, getToken } from '@/lib/auth-storage'
import { useTheme } from '@/context/ThemeContext'
import { useUserStore } from '@/store/useUserStore'
import { UpdatePasswordModal } from '@/components/profile/UpdatePasswordModal'
import ScreenHeader from '@/components/ScreenHeader'

export default function ProfilePage() {
  const { colorScheme } = useTheme()
  const isDark = colorScheme === 'dark'

  const { user, loading, fetchUser, clearUser } = useUserStore()

  const [refreshing, setRefreshing] = useState(false)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)

  // Profile photo states
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)

    try {
      await fetchUser(true)
    } finally {
      setRefreshing(false)
    }
  }

  /**
   * Build the profile image URL returned by the API.
   *
   * API returns something like:
   * clients/profile/1788939985-....png
   *
   * If your backend uses /storage/ for uploaded files,
   * change the return below to:
   *
   * https://egypt.mahmoudalbatran.com/storage/${user.profile_photo_path}
   */
  const getProfilePhotoUrl = () => {
    if (!user?.profile_photo_path) {
      return null
    }

    // If backend already returns a complete URL
    if (
      user.profile_photo_path.startsWith('http://') ||
      user.profile_photo_path.startsWith('https://')
    ) {
      return user.profile_photo_path
    }

    return `https://egypt.mahmoudalbatran.com/storage/${user.profile_photo_path}`
  }

  const profilePhotoUrl = getProfilePhotoUrl()

  /**
   * Select and upload profile photo
   */
  const handleUpdateProfilePhoto = async () => {
    try {
      // --------------------------------------------------
      // 1. Ask permission to access gallery
      // --------------------------------------------------
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert(
          'صلاحية الصور',
          'يجب السماح للتطبيق بالوصول إلى الصور لاختيار صورة الملف الشخصي.'
        )

        return
      }

      // --------------------------------------------------
      // 2. Open image picker
      // --------------------------------------------------
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      // User cancelled
      if (result.canceled || !result.assets?.length) {
        return
      }

      const asset = result.assets[0]

      // --------------------------------------------------
      // 3. Show selected image immediately
      // --------------------------------------------------
      setLocalPhotoUri(asset.uri)

      setUploadingPhoto(true)

      // --------------------------------------------------
      // 4. Get authentication token
      // --------------------------------------------------
      const token = await getToken()

      if (!token) {
        setLocalPhotoUri(null)

        Alert.alert(
          'خطأ',
          'انتهت جلسة تسجيل الدخول، يرجى تسجيل الدخول مرة أخرى.'
        )

        return
      }

      // --------------------------------------------------
      // 5. Create multipart/form-data
      // --------------------------------------------------
      const formData = new FormData()

      // Get a safe filename
      const fileName =
        asset.fileName ||
        asset.uri.split('/').pop() ||
        `profile_${Date.now()}.jpg`

      // Determine mime type
      const mimeType = asset.mimeType || 'image/jpeg'

      formData.append(
        'profile_photo_path',
        {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
        } as any
      )

      // --------------------------------------------------
      // 6. Send request to API
      // --------------------------------------------------
      const response = await fetch(
        'https://egypt.mahmoudalbatran.com/api/updateotherprofile',
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',

            // IMPORTANT:
            // Do NOT manually add:
            //
            // Content-Type: multipart/form-data
            //
            // React Native needs to generate the multipart
            // boundary automatically.
          },

          body: formData,
        }
      )

      // --------------------------------------------------
      // 7. Read API response
      // --------------------------------------------------
      const data = await response.json()

      console.log('Update profile photo response:', data)

      // --------------------------------------------------
      // 8. Handle API error
      // --------------------------------------------------
      if (!response.ok) {
        throw new Error(
          data?.message || 'حدث خطأ أثناء تحديث صورة الملف الشخصي'
        )
      }

      // --------------------------------------------------
      // 9. Success
      // --------------------------------------------------
      Alert.alert(
        'تم بنجاح',
        data?.message || 'تم تحديث صورة الملف الشخصي بنجاح'
      )

      // --------------------------------------------------
      // 10. Refresh user data
      // --------------------------------------------------
      await fetchUser(true)

      // The server version is now available
      // through user.profile_photo_path.
      setLocalPhotoUri(null)
    } catch (error) {
      console.error('Profile photo upload error:', error)

      setLocalPhotoUri(null)

      Alert.alert(
        'خطأ',
        error instanceof Error
          ? error.message
          : 'حدث خطأ أثناء تحديث صورة الملف الشخصي'
      )
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت تأكد من رغبتك في تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تأكيد',
          style: 'destructive',
          onPress: async () => {
            clearUser()
            await removeToken()
            router.replace('/(auth)/login')
          },
        },
      ]
    )
  }

  if (loading && !user && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F] items-center justify-center">
        <ActivityIndicator
          size="large"
          color="#C09A3E"
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      {/* Background decorations */}
      <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C09A3E]/10" />

      <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-[#C8102E]/10" />

      {/* Header */}
      <ScreenHeader
        title="الملف الشخصي"
        iconName="person-outline"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#C09A3E"
            colors={['#C09A3E']}
          />
        }
      >
        {/* ===================================================== */}
        {/* Profile Card */}
        {/* ===================================================== */}

        <View className="px-5 mt-4">
          <View className="p-5 rounded-3xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm items-center relative overflow-hidden">
            {/* Gold top border */}
            <View className="absolute top-0 right-0 left-0 h-1.5 bg-[#C09A3E]" />

            {/* ================================================= */}
            {/* Profile Photo */}
            {/* ================================================= */}

            <TouchableOpacity
              onPress={handleUpdateProfilePhoto}
              disabled={uploadingPhoto}
              activeOpacity={0.8}
              className="w-20 h-20 rounded-full bg-[#C09A3E]/15 items-center justify-center border-2 border-[#C09A3E] mb-2 mt-2 overflow-hidden"
            >
              {localPhotoUri || profilePhotoUrl ? (
                <Image
                  source={{
                    uri:
                      localPhotoUri ||
                      profilePhotoUrl ||
                      undefined,
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={40}
                  color="#C09A3E"
                />
              )}

              {/* Upload loading overlay */}
              {uploadingPhoto && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center">
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* Change photo button */}
            <TouchableOpacity
              onPress={handleUpdateProfilePhoto}
              disabled={uploadingPhoto}
              activeOpacity={0.7}
              className="flex-row items-center gap-1.5 mb-3"
            >
              <Ionicons
                name="camera-outline"
                size={15}
                color="#C09A3E"
              />

              <Text className="text-xs font-bold text-[#C09A3E]">
                {uploadingPhoto
                  ? 'جاري تحديث الصورة...'
                  : 'تغيير صورة الملف الشخصي'}
              </Text>
            </TouchableOpacity>

            {/* User name */}
            <Text className="text-lg font-black text-gray-900 dark:text-white text-center mb-1">
              {user?.name || 'غير معروف'}
            </Text>

            {/* Work */}
            <View className="flex-row items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 mb-3">
              <Ionicons
                name="briefcase-outline"
                size={14}
                color="#C09A3E"
              />

              <Text className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {user?.work || 'موظف'}
              </Text>
            </View>

            {/* Account status */}
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
                {user?.is_active
                  ? 'الحساب نشط'
                  : 'الحساب متوقف'}
              </Text>
            </View>
          </View>
        </View>

        {/* ===================================================== */}
        {/* Personal Information */}
        {/* ===================================================== */}

        <View className="px-5 mt-5">
          <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">
            المعلومات الشخصية
          </Text>

          <View className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm gap-4">
            {/* Identification */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
                  <Ionicons
                    name="card-outline"
                    size={18}
                    color="#C09A3E"
                  />
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

            {/* Main phone */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color="#C09A3E"
                  />
                </View>

                <Text className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  رقم الجوال الرئيسي
                </Text>
              </View>

              <Text className="text-sm font-black text-gray-900 dark:text-white">
                {user?.phone_number || '-'}
              </Text>
            </View>

            {/* Other phone */}
            {user?.phone_other && (
              <>
                <View className="h-[1px] bg-gray-100 dark:bg-white/5" />

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 items-center justify-center">
                      <Ionicons
                        name="phone-portrait-outline"
                        size={18}
                        color="#C09A3E"
                      />
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

        {/* ===================================================== */}
        {/* Job Rates */}
        {/* ===================================================== */}

        <View className="px-5 mt-5">
          <Text className="text-xs font-bold text-[#C09A3E] mb-3 tracking-wider">
            تفاصيل العمل والراتب
          </Text>

          <View className="flex-row gap-3">
            {/* Day rate */}
            <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
              <View className="w-8 h-8 rounded-xl bg-amber-500/10 items-center justify-center mb-2">
                <Ionicons
                  name="sunny-outline"
                  size={18}
                  color="#D97706"
                />
              </View>

              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                أجرة اليوم
              </Text>

              <Text className="text-base font-black text-gray-900 dark:text-white">
                {user?.day_rate
                  ? `${user.day_rate} ₪`
                  : '-'}
              </Text>
            </View>

            {/* Night rate */}
            <View className="flex-1 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm">
              <View className="w-8 h-8 rounded-xl bg-indigo-500/10 items-center justify-center mb-2">
                <Ionicons
                  name="moon-outline"
                  size={18}
                  color="#6366F1"
                />
              </View>

              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                أجرة الليلة
              </Text>

              <Text className="text-base font-black text-gray-900 dark:text-white">
                {user?.night_rate
                  ? `${user.night_rate} ₪`
                  : '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* ===================================================== */}
        {/* Security */}
        {/* ===================================================== */}

        <View className="px-5 mt-5">
          <Text className="text-xs font-bold text-[#C09A3E] mb-3">
            الأمان والحساب
          </Text>

          <TouchableOpacity
            onPress={() =>
              setIsPasswordModalVisible(true)
            }
            activeOpacity={0.7}
            className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-xl bg-[#C09A3E]/10 items-center justify-center">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#C09A3E"
                />
              </View>

              <Text className="text-sm font-bold text-gray-900 dark:text-white">
                تغيير كلمة المرور
              </Text>
            </View>

            <Ionicons
              name="chevron-back"
              size={18}
              color={isDark ? '#666' : '#AAA'}
            />
          </TouchableOpacity>
        </View>

        {/* ===================================================== */}
        {/* Logout */}
        {/* ===================================================== */}

        <View className="px-5 mt-6">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="flex-row items-center justify-center bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl gap-2"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#C8102E"
            />

            <Text className="text-sm font-black text-[#C8102E]">
              تسجيل الخروج
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ===================================================== */}
      {/* Password Modal */}
      {/* ===================================================== */}

      <UpdatePasswordModal
        visible={isPasswordModalVisible}
        onClose={() =>
          setIsPasswordModalVisible(false)
        }
      />
    </SafeAreaView>
  )
}