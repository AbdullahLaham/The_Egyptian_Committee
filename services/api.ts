// // services/api.ts

// import axios from "axios";

// export const api = axios.create({
//   baseURL: "https://egypt.mahmoudalbatran.com/api",

//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },

//   timeout: 15000,
// });


// services/api.ts

import { getToken } from "@/lib/auth-storage";
import axios from "axios";

export const api = axios.create({
  baseURL: "https://egypt.mahmoudalbatran.com/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor لإضافة Bearer Token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return config; // حتى لو فشل جلب التوكن، نكمل الطلب بدون كسر التطبيق
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor (اختياري)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - token invalid or expired");
      // ممكن تعمل logout هنا
    }

    
    return Promise.reject(error);
  }
);