import axios from "axios";
import { getToken, logout } from "./auth-storage";
import { useUserStore } from "@/store/user.store";

export const checkAuth = async () => {
  const token = await getToken();

  if (!token) throw new Error("No token");

  try {
    const res = await axios.get(
      "https://egypt.mahmoudalbatran.com/api/user",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(token, 'check auth response');

    
    // console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuu', res.data)
    // ✅ خزّن المستخدم في Zustand
    useUserStore.getState().setUser(res.data); // لأننا خارج React Component

    return res.data; // user data لو حاب تستخدمه


  } catch (error: any) {
    // if (error.response?.status === 401) {
    //   await logout(); // امسح التوكن
    // }
    throw error;
  }
};
