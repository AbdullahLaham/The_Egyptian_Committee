

import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Linking } from "react-native";
import { saveToken } from "@/lib/auth-storage";
import OTPModal from "@/components/OTPModal";

export default function LoginScreen() {

   const inputsRef = useRef<TextInput[]>([]);



  const [phonePrefix, setPhonePrefix] = useState("970");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(60);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  /* ---------------- LOGIN ---------------- */
const submitLogin = async () => {
  setError(null);

  if (!identification || !password) {
    return setError("جميع الحقول مطلوبة");
  }

  // if (!/^\d{9}$/.test(phoneNumber)) {
  //   return setError("رقم الهاتف يجب أن يكون 9 أرقام");
  // }


  try {
    setLoading(true);

    const res = await axios.post(
      "https://egypt.mahmoudalbatran.com/api/v1/employee/login",
      
      {
        identification: identification,
        password: password,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data);

    if (res.status !== 200) {
      throw new Error("فشل تسجيل الدخول");
    }

    // رسالة نجاح
    // alert(res.data.message);

    // ✅ OTP sent to phone
      setOtpModal(true);

      setTimer(60);

  } catch (err: any) {
    console.log(err.response?.data || err);

    setError(
      err.response?.data?.message ||
      err.message ||
      "فشل تسجيل الدخول"
    );
  } finally {
    setLoading(false);
  }
};


/* ---------------- OTP TIMER ---------------- */
  useEffect(() => {
    if (!otpModal || timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpModal, timer]);




  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={30}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 bg-brand-light justify-center px-6">
        <View className="absolute inset-0 bg-brand-secondary/10" />

        {/* Card */}
        <View className="bg-gray-50 rounded-[36px] px-7 py-10 shadow-2xl border border-gray-100">

          {/* Header */}
          <View className="mb-10 items-center">
            <View className="w-24 h-24 rounded-2xl bg-brand-primary/15 items-center justify-center mb-4">
              <Image
                source={require("@/assets/images/micon.png")}
                style={{ width: 100, height: 100, transform: [{ scale: 1.5 }] }}
              />
            </View>

            <Text className="text-3xl mt-7 font-extrabold text-gray-600">
              تسجيل الدخول
            </Text>

            {/* <Text className="text-center text-gray-500 font-medium text-base mt-2">
              أهلاً بعودتك، سجل دخولك لمتابعة رحلتك معنا
            </Text> */}
          </View>

          {/* Inputs */}
          <View className="gap-5">
            {/* Phone */}
            <View>
              <Text className="text-sm text-gray-600 mb-2 font-medium">
               البريد الإلكتروني
              </Text>

              <View className="flex-row gap-2">
                <TextInput
                  placeholder="*******40"
                  value={identification}
                  onChangeText={setIdentification}
                  keyboardType="number-pad"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 border border-gray-200 rounded-2xl px-5 py-4 text-brand-dark text-base bg-gray-50"
                />
              </View>
            </View>

            {/* Password */}
            <KeyboardAvoidingView>
              <View>
                <Text className="text-sm text-gray-600 mb-2 font-medium">
                  كلمة المرور
                </Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className="border border-gray-200 rounded-2xl px-5 py-4 text-brand-dark text-base bg-gray-50"
                />
              </View>
            </KeyboardAvoidingView>
          </View>

          {/* Guest */}
          {false && <Pressable
            disabled={loading}
            onPress={() => {}
              // router.push("/(tabs)/home")
            }
            className="mt-8 border border-brand-primary py-4 rounded-2xl"
          >
            
          </Pressable>}

          {/* Submit */}
          <Pressable
            disabled={loading}
            onPress={submitLogin}
            className="mt-5 bg-brand-primary py-4 rounded-2xl shadow-lg shadow-brand-primary/30"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                تسجيل الدخول
              </Text>
            )}
          </Pressable>

          {/* Contact via WhatsApp if forgot password */}
<Pressable
  onPress={() => {
    const whatsappNumber = "+970567800880"; // ضع رقم الواتساب هنا
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
      "مرحباً، نسيت كلمة المرور وأحتاج مساعدة."
    )}`;
    // افتح الرابط
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("لا يمكن فتح واتساب على هذا الجهاز");
      }
    });
  }}
  className="mt-4 py-3 rounded-2xl"
>
  <Text className="text-brand-primary text-center font-bold text-base">
    نسيت كلمة المرور؟ تواصل عبر واتساب
  </Text>
</Pressable>


          {/* Error */}
          {error && (
            <Text className="text-red-500 text-center mt-4">
              {String(error)}
            </Text>
          )}

          {/* Footer */}
          {/* <Text className="text-center text-gray-500 mt-8 text-base">
            ليس لديك حساب؟{" "}
            <Text
              className="text-brand-accent font-extrabold"
              onPress={() => router.push("/(auth)/sign-up")}
            >
              إنشاء حساب
            </Text>
          </Text> */}
        </View>
         {/* OTP MODAL */}
        <OTPModal
          inputsRef={inputsRef}
          otpModal={otpModal}
          setOtpModal={setOtpModal}
          otp={otp}
          setOtp={setOtp}
          identification={`${identification}`}
          password={password}
          timer={timer}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
