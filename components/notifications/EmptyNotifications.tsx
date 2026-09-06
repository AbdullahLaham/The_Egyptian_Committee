import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const EmptyNotifications = () => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons
        name="notifications-off-outline"
        size={64}
        color="#9CA3AF"
      />
      <Text
        className="text-lg font-bold text-gray-600 mt-4"
        style={{ writingDirection: 'rtl' }}
      >
        لا توجد إشعارات
      </Text>
      <Text
        className="text-sm text-gray-400 mt-2 text-center"
        style={{ writingDirection: 'rtl' }}
      >
        سيتم عرض الإشعارات الجديدة هنا عند وصولها
      </Text>
    </View>
  )
}


export default EmptyNotifications

const styles = StyleSheet.create({})