import { create } from 'zustand'
import { api } from '@/services/api'
import { getToken } from '@/lib/auth-storage'

export type UserProfile = {
  id: number
  name: string
  identification: string
  phone_number: string
  phone_other: string | null
  image: string | null
  work: string
  created_at: string
  branch_id: number
  department_id: number
  day_rate: string
  night_rate: string
  is_active: boolean
}

type UserState = {
  user: UserProfile | null
  loading: boolean
  error: string | null
  isFetched: boolean // علامة تؤكد أن البيانات تم جلبها سابقاً
  permissions: any
  fetchUser: (forceRefresh?: boolean) => Promise<void>
  clearUser: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isFetched: false,
  permissions: [],

  fetchUser: async (forceRefresh = false) => {
    // إذا كانت البيانات موجودة ولم نطلب تحديثاً إجبارياً، لا داعي للتحميل
    if (get().isFetched && !forceRefresh && get().user) return

    // إظهار مؤشر التحميل فقط عند أول جلب (First Fetch)
    if (!get().isFetched) {
      set({ loading: true, error: null })
    }

    try {
      const token = await getToken()
      const res = await api.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("resssssssssss", res.data)

      if (res.data) {
        set({ user: res.data.auth, isFetched: true, error: null, permissions:  res.data.permissions})
      }
    } catch (err: any) {
      console.log('Error fetching user profile store:', err)
      set({ error: err.message || 'حدث خطأ أثناء جلب البيانات' })
    } finally {
      set({ loading: false })
    }
  },

  // تفريغ الستور كاملاً عند تسجيل الخروج
  clearUser: () => {
    set({ user: null, isFetched: false, loading: false, error: null, permissions:  []})
  },
}))