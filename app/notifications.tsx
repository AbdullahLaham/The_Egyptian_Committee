
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
import ScreenHeader from '@/components/ScreenHeader'

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
        'v1/employee/notifications/read_at',
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
      {/* <View className="px-5 pt-3 pb-4 flex-row items-center justify-between border-b border-gray-200/60 dark:border-white/10 mb-2">
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
      </View> */}
      <ScreenHeader title="الإشعارات" iconName="notifications-outline" />

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