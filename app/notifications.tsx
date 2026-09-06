
// import React, { useEffect, useState, useCallback } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   Pressable,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { getToken } from '@/lib/auth-storage'
// import EmptyNotifications from '@/components/notifications/EmptyNotifications'
// import { router } from 'expo-router'
// import { api } from '@/services/api'
// import { SafeAreaView } from 'react-native-safe-area-context'

// /* ================== TYPES ================== */

// type Notification = {
//   id: string
//   title: string
//   body: string
//   time: string
//   read: boolean
//   type: 'order' | 'promo' | 'system'
// }

// /* ================== HELPERS ================== */

// // const formatTime = (date: string) => {
// //   // يمكن تطوير هذا لاحقًا ليحسب الوقت منذ الإنشاء
// //   return 'منذ قليل'
// // }


// const formatTime = (date: string) => {
//   const createdAt = new Date(date)
//   const now = new Date()
//   const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000) // الفرق بالثواني

//   if (diff < 60) return `منذ ${diff} ثانية`
//   if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
//   if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
//   if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`
  
//   // لو أكبر من أسبوع، نعرض التاريخ بالشهر واليوم
//   const day = createdAt.getDate()
//   const month = createdAt.toLocaleString('ar-EG', { month: 'short' })
//   return `${day} ${month}`
// }


// /* ================== ITEM ================== */

// const NotificationItem = ({
//   item,
//   onPress,
// }: {
//   item: Notification
//   onPress: () => void
// }) => {
//   const iconMap = {
//     order: 'cube-outline',
//     promo: 'pricetag-outline',
//     system: 'settings-outline',
//   }

//   const iconBg =
//     item.type === 'promo'
//       ? '#F6A64D'
//       : item.type === 'order'
//       ? '#7CC7A4'
//       : '#6FB7D6'

//   return (
//     <Pressable
//       onPress={onPress}
//       className={`mx-4 mb-3 rounded-3xl p-4 flex-row gap-4 ${
//         item.read ? 'bg-white' : 'bg-[#7CC7A4]/10'
//       }`}
//       style={{
//         shadowColor: item.read ? '#000' : '#7CC7A4',
//         shadowOpacity: item.read ? 0.05 : 0.15,
//         shadowRadius: 10,
//         elevation: item.read ? 2 : 6,
//       }}
//     >
//       {/* Icon */}
//       <View
//         className="w-11 h-11 rounded-2xl items-center justify-center"
//         style={{ backgroundColor: iconBg }}
//       >
//         <Ionicons name={iconMap[item.type]} size={22} color="#fff" />
//       </View>

//       {/* Content */}
//       <View className="flex-1">
//         <View className="flex-row justify-between items-center mb-1">
//           <Text
//             className={`text-sm ${
//               item.read
//                 ? 'font-semibold text-[#1F2937]'
//                 : 'font-extrabold text-[#1F2937]'
//             }`}
//             style={{ writingDirection: 'rtl' }}
//           >
//             {item.title}
//           </Text>

//           {item.read && <View className="w-2 h-2 rounded-full bg-[#7CC7A4]" />}
//         </View>

//         <Text
//           className="text-xs text-neutral-500 mb-2"
//           style={{ writingDirection: 'rtl' }}
//         >
//           {item.body}
//         </Text>

//         <Text
//           className="text-[11px] text-neutral-400"
//           style={{ writingDirection: 'rtl' }}
//         >
//           {item.time}
//         </Text>
//       </View>
//     </Pressable>
//   )
// }

// /* ================== PAGE ================== */

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [loading, setLoading] = useState(true)
//   const [page, setPage] = useState(1)
//   const [lastPage, setLastPage] = useState(1)
//   const [loadingMore, setLoadingMore] = useState(false)
//   const [refreshing, setRefreshing] = useState(false)

//   /* Fetch notifications */
//   const fetchNotifications = async (pageNumber = 1) => {
//     try {
//       if (pageNumber === 1 && !refreshing) setLoading(true)
//       else setLoadingMore(true)

//       const token = await getToken()
//       const res = await api.get(`/notifications?page=${pageNumber}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       console.log(res.data, 'tttttttttttttttttttttttttttttttttttttttttttttt')

//       const formatted: Notification[] = res.data.notifications.data.map(
//         (n: any) => ({
//           id: n.id,
//           title: n.data.title,
//           body: n.data.body,
//           time: formatTime(n.created_at),
//           read: n.read_at, // true if read_at exists
//           type: 'order', // يمكنك تحديد type ديناميكياً إذا أردت
//         })
//       )

//       if (pageNumber === 1) setNotifications(formatted)
//       else setNotifications(prev => [...prev, ...formatted])

//       setLastPage(res.data.notifications.last_page)
//       setPage(pageNumber)
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setLoading(false)
//       setLoadingMore(false)
//       setRefreshing(false)
//     }
//   }

//   /* Load more when reaching end */
//   const loadMore = () => {
//     if (!loadingMore && page < lastPage) {
//       fetchNotifications(page + 1)
//     }
//   }

//   /* Pull-to-refresh */
//   const onRefresh = () => {
//     setRefreshing(true)
//     fetchNotifications(1)
//   }

//   /* Mark all notifications as read */
//   const markAllAsRead = async () => {

//     if (!(notifications?.length > 0)) return;

    
//     try {
//       const token = await getToken()
//       await api.put(
//         '/notifications/read_at',
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       setNotifications(prev =>
//         prev.map(n => ({ ...n, read: true }))
//       )
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     fetchNotifications()
//     markAllAsRead()
//   }, [])

//   if (loading && page === 1) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <ActivityIndicator size="large" />
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-[#F8FAFC] pt-6 relative">
//       {/* Header */}
//       <Text
//         className="text-3xl text-center font-extrabold text-[#1F2937] mb-6 px-4 mt-2"
//         style={{ writingDirection: 'rtl' }}
//       >
//         الإشعارات
//       </Text>

//       <Pressable
//               onPress={() => router.back()}
//               className="absolute z-[99] top-10 left-4 w-10 h-10 bg-white rounded-full items-center justify-center shadow"
//             >
//               <Ionicons name="arrow-forward" size={22} color="#1F2937" />
//             </Pressable>

//       {/* Empty State */}
//       {notifications.length === 0 ? (
//         <EmptyNotifications />
//       ) : (
//         <FlatList
//           data={notifications}
//           keyExtractor={item => item.id}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 120 }}
//           renderItem={({ item }) => (
//             <NotificationItem
//               item={item}
//               onPress={() =>
//                 setNotifications(prev =>
//                   prev.map(n =>
//                     n.id === item.id ? { ...n, read: true } : n
//                   )
//                 )
//               }
//             />
//           )}
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={() =>
//             loadingMore ? (
//               <View className="py-4">
//                 <ActivityIndicator size="small" />
//               </View>
//             ) : null
//           }
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         />
//       )}
//     </SafeAreaView>
//   )
// }




// import React, { useEffect, useState, useCallback } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   Pressable,
//   ActivityIndicator,
//   RefreshControl,
//   StatusBar,
//   TouchableOpacity,
// } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { getToken } from '@/lib/auth-storage'
// import EmptyNotifications from '@/components/notifications/EmptyNotifications'
// import { router } from 'expo-router'
// import { api } from '@/services/api'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useTheme } from '@/context/ThemeContext'

// /* ================== TYPES ================== */

// type Notification = {
//   id: string
//   title: string
//   body: string
//   time: string
//   read: boolean
//   type: 'order' | 'promo' | 'system'
// }

// /* ================== HELPERS ================== */

// const formatTime = (date: string) => {
//   const createdAt = new Date(date)
//   const now = new Date()
//   const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000)

//   if (diff < 60) return `منذ ${diff} ثانية`
//   if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
//   if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
//   if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`

//   const day = createdAt.getDate()
//   const month = createdAt.toLocaleString('ar-EG', { month: 'short' })
//   return `${day} ${month}`
// }

// /* ================== ITEM COMPONENT ================== */

// const NotificationItem = ({
//   item,
//   onPress,
// }: {
//   item: Notification
//   onPress: () => void
// }) => {
//   const iconMap = {
//     order: 'cube-outline',
//     promo: 'pricetag-outline',
//     system: 'settings-outline',
//   }

//   return (
//     <Pressable
//       onPress={onPress}
//       className={`mx-5 mb-3.5 p-4 rounded-2xl border flex-row gap-3.5 items-start ${
//         item.read
//           ? 'bg-white dark:bg-[#141414] border-gray-200 dark:border-white/10'
//           : 'bg-[#C09A3E]/10 border-[#C09A3E]/30'
//       }`}
//     >
//       {/* Icon Wrapper */}
//       <View className="w-10 h-10 rounded-xl bg-[#C09A3E]/15 items-center justify-center">
//         <Ionicons name={iconMap[item.type] as any} size={20} color="#C09A3E" />
//       </View>

//       {/* Content */}
//       <View className="flex-1">
//         <View className="flex-row justify-between items-center mb-1">
//           <Text
//             className={`text-sm flex-1 ${
//               item.read
//                 ? 'font-bold text-gray-800 dark:text-gray-200'
//                 : 'font-extrabold text-gray-900 dark:text-white'
//             }`}
//             style={{ writingDirection: 'rtl' }}
//           >
//             {item.title}
//           </Text>

//           {!item.read && (
//             <View className="w-2.5 h-2.5 rounded-full bg-[#C8102E] mr-2" />
//           )}
//         </View>

//         <Text
//           className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-5 font-medium"
//           style={{ writingDirection: 'rtl' }}
//         >
//           {item.body}
//         </Text>

//         <Text
//           className="text-[10px] font-bold text-gray-400 dark:text-gray-500"
//           style={{ writingDirection: 'rtl' }}
//         >
//           {item.time}
//         </Text>
//       </View>
//     </Pressable>
//   )
// }

// /* ================== MAIN PAGE ================== */

// export default function NotificationsPage() {
//   const { colorScheme } = useTheme()
//   const isDark = colorScheme === 'dark'

//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)

//   /* Fetch Notifications without Pagination */
//   const fetchNotifications = useCallback(async () => {
//     try {
//       const token = await getToken()
//       const res = await api.get('v1/employee/notifications', {
//         headers: {
//         'Accept': 'application/json', // <--- Add this header
//       },
//       })

//       console.log(res?.data, 'eeeeeeeeeeeeeeeeeeeeeeeee')

//       // التعامل مع القائمة مباشرة بدون Pagination
//       const rawList = Array.isArray(res.data.notifications)
//         ? res.data.notifications
//         : res.data.notifications?.data || []

//       const formatted: Notification[] = rawList.map((n: any) => ({
//         id: n.id,
//         title: n.data?.title || n.title || 'إشعار جديد',
//         body: n.data?.body || n.body || '',
//         time: formatTime(n.created_at),
//         read: !!n.read_at,
//         type: n.data?.type || 'order',
//       }))

//       setNotifications(formatted)
//     } catch (error) {
//       console.log('Error fetching notifications:', error)
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }, [])

//   /* Mark all notifications as read */
//   const markAllAsRead = async () => {
//     try {
//       const token = await getToken()
//       await api.put(
//         '/notifications/read_at',
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })))
//     } catch (error) {
//       console.log('Error marking notifications read:', error)
//     }
//   }

//   useEffect(() => {
//     fetchNotifications()
//     markAllAsRead()
//   }, [fetchNotifications])

//   const onRefresh = () => {
//     setRefreshing(true)
//     fetchNotifications()
//   }

//   if (loading && !refreshing) {
//     return (
//       <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F] items-center justify-center">
//         <ActivityIndicator size="large" color="#C09A3E" />
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

//       {/* خلفيات جمالية مضيئة موحدة */}
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
//           الإشعارات
//         </Text>

//         <View className="w-10" />
//       </View>

//       {/* Main List / Empty State */}
//       {notifications.length === 0 ? (
//         <EmptyNotifications />
//       ) : (
//         <FlatList
//           data={notifications}
//           keyExtractor={item => item.id}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingTop: 12, paddingBottom: 60 }}
//           renderItem={({ item }) => (
//             <NotificationItem
//               item={item}
//               onPress={() =>
//                 setNotifications(prev =>
//                   prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
//                 )
//               }
//             />
//           )}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor="#C09A3E"
//               colors={['#C09A3E']}
//             />
//           }
//         />
//       )}
//     </SafeAreaView>
//   )
// }






import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getToken } from '@/lib/auth-storage'
import EmptyNotifications from '@/components/notifications/EmptyNotifications'
import { router } from 'expo-router'
import { api } from '@/services/api'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/context/ThemeContext'

/* ================== TYPES ================== */

type Notification = {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  type: 'order' | 'promo' | 'system'
}

/* ================== HELPERS ================== */

const formatTime = (date: string) => {
  if (!date) return ''
  const createdAt = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000)

  if (diff < 60) return `منذ ${diff} ثانية`
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`

  const day = createdAt.getDate()
  const month = createdAt.toLocaleString('ar-EG', { month: 'short' })
  return `${day} ${month}`
}

/* ================== ITEM COMPONENT ================== */

const NotificationItem = ({
  item,
  onPress,
}: {
  item: Notification
  onPress: () => void
}) => {
  const iconMap = {
    order: 'cube-outline',
    promo: 'pricetag-outline',
    system: 'settings-outline',
  }

  return (
    <Pressable
      onPress={onPress}
      className={`mx-5 mb-3.5 p-4 rounded-2xl border flex-row gap-3.5 items-start ${
        item.read
          ? 'bg-white dark:bg-[#141414] border-gray-200 dark:border-white/10'
          : 'bg-[#C09A3E]/10 border-[#C09A3E]/30'
      }`}
    >
      {/* Icon Wrapper */}
      <View className="w-10 h-10 rounded-xl bg-[#C09A3E]/15 items-center justify-center">
        <Ionicons name={iconMap[item.type] as any} size={20} color="#C09A3E" />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            className={`text-sm flex-1 ${
              item.read
                ? 'font-bold text-gray-800 dark:text-gray-200'
                : 'font-extrabold text-gray-900 dark:text-white'
            }`}
            style={{ writingDirection: 'rtl' }}
          >
            {item.title}
          </Text>

          {!item.read && (
            <View className="w-2.5 h-2.5 rounded-full bg-[#C8102E] mr-2" />
          )}
        </View>

        <Text
          className="text-xs text-gray-600 dark:text-gray-400 mb-2 leading-5 font-medium"
          style={{ writingDirection: 'rtl' }}
        >
          {item.body}
        </Text>

        <Text
          className="text-[10px] font-bold text-gray-400 dark:text-gray-500"
          style={{ writingDirection: 'rtl' }}
        >
          {item.time}
        </Text>
      </View>
    </Pressable>
  )
}

/* ================== MAIN PAGE ================== */

export default function NotificationsPage() {
  const { colorScheme } = useTheme()
  const isDark = colorScheme === 'dark'

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  /* Fetch Notifications with Pagination Support */
  const fetchNotifications = useCallback(
    async (pageNumber = 1, isRefresh = false) => {
      try {
        if (pageNumber === 1 && !isRefresh) {
          setLoading(true)
        } else if (pageNumber > 1) {
          setLoadingMore(true)
        }

        const token = await getToken()
        const res = await api.get(`/v1/employee/notifications?page=${pageNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const notificationsData = res.data.notifications
        const rawList = notificationsData?.data || []

        const formatted: Notification[] = rawList.map((n: any) => ({
          id: n.id,
          title: n.data?.title || 'إشعار جديد',
          body: n.data?.body || '',
          time: formatTime(n.created_at),
          read: !!n.read_at,
          type: 'order',
        }))

        if (pageNumber === 1) {
          setNotifications(formatted)
        } else {
          setNotifications(prev => [...prev, ...formatted])
        }

        setPage(notificationsData?.current_page || 1)
        setLastPage(notificationsData?.last_page || 1)
      } catch (error) {
        console.log('Error fetching notifications:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
        setRefreshing(false)
      }
    },
    []
  )

  /* Load More Handler */
  const handleLoadMore = () => {
    if (!loadingMore && page < lastPage) {
      fetchNotifications(page + 1)
    }
  }

  /* Pull-to-refresh */
  const onRefresh = () => {
    setRefreshing(true)
    fetchNotifications(1, true)
  }

  /* Mark all notifications as read */
  const markAllAsRead = async () => {
    try {
      const token = await getToken()
      await api.put(
        '/notifications/read_at',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.log('Error marking notifications read:', error)
    }
  }

  useEffect(() => {
    fetchNotifications(1)
    markAllAsRead()
  }, [fetchNotifications])

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F] items-center justify-center">
        <ActivityIndicator size="large" color="#C09A3E" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* خلفيات جمالية مضيئة */}
      <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C09A3E]/10" />
      <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-[#C8102E]/10" />

      {/* Header Bar */}
      <View className="px-5 pt-3 pb-4 flex-row items-center justify-between border-b border-gray-200/60 dark:border-white/10 mb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 items-center justify-center shadow-sm"
        >
          <Ionicons
            name="arrow-forward"
            size={20}
            color={isDark ? '#FFF' : '#111827'}
          />
        </TouchableOpacity>

        <Text className="text-xl font-black text-gray-900 dark:text-white">
          الإشعارات
        </Text>

        <View className="w-10" />
      </View>

      {/* Main List / Empty State */}
      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 60 }}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() =>
                setNotifications(prev =>
                  prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
                )
              }
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={() =>
            loadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#C09A3E" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#C09A3E"
              colors={['#C09A3E']}
            />
          }
        />
      )}
    </SafeAreaView>
  )
}