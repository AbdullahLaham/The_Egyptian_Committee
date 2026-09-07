import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getToken } from '@/lib/auth-storage'
import { api } from '@/services/api'
import { useTheme } from '@/context/ThemeContext'

interface UpdatePasswordModalProps {
  visible: boolean
  onClose: () => void
}

type ToastState = {
  type: 'success' | 'error'
  title: string
  message: string
} | null

export function UpdatePasswordModal({ visible, onClose }: UpdatePasswordModalProps) {
  const { colorScheme } = useTheme()
  const isDark = colorScheme === 'dark'

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [alertBanner, setAlertBanner] = useState<ToastState>(null)

  // 1. تتبع ارتفاع لوحة المفاتيح
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height)
    })
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    setAlertBanner({ type, title, message })
  }

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setAlertBanner(null)
    setKeyboardHeight(0)
    onClose()
  }

  const updatePassword = async () => {
    setAlertBanner(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('error', 'خطأ', 'جميع الحقول مطلوبة')
      return
    }

    if (newPassword.length < 6) {
      showAlert('error', 'خطأ', 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل')
      return
    }

    if (newPassword !== confirmPassword) {
      showAlert('error', 'خطأ', 'كلمة المرور الجديدة غير متطابقة')
      return
    }

    try {
      setLoadingPassword(true)
      const token = await getToken()

      if (!token) return

      await api.post(
        '/updatepassword',
        {
          old_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      showAlert('success', 'تم بنجاح', 'تم تغيير كلمة المرور بنجاح')

      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (error: any) {
      console.log('Update password error:', error.response?.data || error.message)
      const errorMsg =
        error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور'
      showAlert('error', 'فشل العملية', errorMsg)
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* الضغط على الخلفية الشفافة يغلق الكيبورد */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className="flex-1 justify-end bg-black/60"
          style={{ paddingBottom: keyboardHeight }} // رفع المحتوى ديناميكياً بارتفاع الكيبورد
        >
          {/* منع إغلاق الكيبورد عند الضغط داخل المودال نفسه */}
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white dark:bg-[#141414] rounded-t-3xl border-t border-gray-200 dark:border-white/10 max-h-[85vh]">
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 24 }}
              >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-white/5">
                  <Text className="text-lg font-black text-gray-900 dark:text-white">
                    تغيير كلمة المرور
                  </Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 items-center justify-center"
                  >
                    <Ionicons name="close" size={20} color={isDark ? '#FFF' : '#111827'} />
                  </TouchableOpacity>
                </View>

                {/* Alert Banner */}
                {alertBanner && (
                  <View
                    className={`p-3.5 rounded-2xl mb-4 flex-row items-center gap-3 border ${
                      alertBanner.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-rose-500/10 border-rose-500/30'
                    }`}
                  >
                    <Ionicons
                      name={
                        alertBanner.type === 'success'
                          ? 'checkmark-circle-outline'
                          : 'alert-circle-outline'
                      }
                      size={22}
                      color={alertBanner.type === 'success' ? '#10B981' : '#F43F5E'}
                    />
                    <View className="flex-1">
                      <Text
                        className={`text-xs font-black ${
                          alertBanner.type === 'success'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {alertBanner.title}
                      </Text>
                      <Text className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {alertBanner.message}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Field 1: Current Password */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 text-right">
                    كلمة المرور الحالية
                  </Text>
                  <View className="flex-row items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-3.5 h-12">
                    <Ionicons name="key-outline" size={18} color="#C09A3E" />
                    <TextInput
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      secureTextEntry={!showCurrentPassword}
                      placeholder="أدخل كلمة المرور الحالية"
                      placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
                      className="flex-1 text-right text-sm font-bold text-gray-900 dark:text-white px-3 h-full"
                    />
                    <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                      <Ionicons
                        name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={isDark ? '#888' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Field 2: New Password */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 text-right">
                    كلمة المرور الجديدة
                  </Text>
                  <View className="flex-row items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-3.5 h-12">
                    <Ionicons name="lock-closed-outline" size={18} color="#C09A3E" />
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      placeholder="أدخل كلمة المرور الجديدة"
                      placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
                      className="flex-1 text-right text-sm font-bold text-gray-900 dark:text-white px-3 h-full"
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                      <Ionicons
                        name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={isDark ? '#888' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Field 3: Confirm Password */}
                <View className="mb-6">
                  <Text className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 text-right">
                    تأكيد كلمة المرور الجديدة
                  </Text>
                  <View className="flex-row items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-3.5 h-12">
                    <Ionicons name="checkmark-circle-outline" size={18} color="#C09A3E" />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="أعد أدخل كلمة المرور الجديدة"
                      placeholderTextColor={isDark ? '#666' : '#9CA3AF'}
                      className="flex-1 text-right text-sm font-bold text-gray-900 dark:text-white px-3 h-full"
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={isDark ? '#888' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={updatePassword}
                  disabled={loadingPassword}
                  activeOpacity={0.8}
                  className="bg-[#C09A3E] h-[2.5rem] rounded-2xl items-center justify-center shadow-sm mb-10"
                >
                  {loadingPassword ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text className="text-white font-black text-base">تحديث كلمة المرور</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}