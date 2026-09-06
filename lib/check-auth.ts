// import axios from "axios";
// import { getToken, logout } from "./auth-storage";
// import { useUserStore } from "@/store/user.store";

// export const checkAuth = async () => {
//   const token = await getToken();

//   if (!token) throw new Error("No token");

//   try {
//     const res = await axios.get(
//       "https://egypt.mahmoudalbatran.com/api/user",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log(token, 'check auth response');

    
//     // console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuu', res.data)
//     // ✅ خزّن المستخدم في Zustand
//     useUserStore.getState().setUser(res.data); // لأننا خارج React Component

//     return res.data; // user data لو حاب تستخدمه


//   } catch (error: any) {
//     // if (error.response?.status === 401) {
//     //   await logout(); // امسح التوكن
//     // }
//     throw error;
//   }
// };











import axios from "axios";
import { getToken, logout } from "./auth-storage";
import { useUserStore } from "@/store/user.store";

export const checkAuth = async () => {
  const token = await getToken();

  // إذا لم يكن هناك توكن من الأساس، نعتبره غير مسجل
  if (!token) throw new Error("NO_TOKEN");

  try {
    const res = await axios.get(
      "https://egypt.mahmoudalbatran.com/api/user",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 8000, // مهلة زمنية 8 ثواني لتفادي التعليق
      }
    );

    //  خزن المستخدم في Zustand عند نجاح الاتصال
    useUserStore.getState().setUser(res.data);
    return res.data;

  } catch (error: any) {
    // 1. إذا كان الخطأ بسبب انتهاء الصلاحية أو عدم المخولية (401)
    if (error.response?.status === 401) {
      // await logout(); // امسح التوكن المنتهي
      throw new Error("UNAUTHORIZED");
    }

    // 2. إذا كان الخطأ بسبب انقطاع الإنترنت أو عدم استجابة السيرفر (Network Error / Timeout)
    if (!error.response || error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
      console.log("No internet connection, proceeding with saved token locally.");
      return { offline: true }; // نرجع مؤشر أنه تم الدخول أوفلاين
    }

    throw error;
  }
};