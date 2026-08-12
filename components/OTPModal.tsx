

import { router } from "expo-router";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { saveToken, saveUser } from "@/lib/auth-storage";

const OTPModal = ({
  otpModal,
  setOtpModal,
  inputsRef,
  phoneNumber
}: any) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!otpModal) return;

    setTimer(60);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t === 1) clearInterval(interval);
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpModal]);

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("أدخل رمز التحقق كامل");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // router.replace("/(tabs)/home");

      const res = await axios.post(
        "https://egypt.mahmoudalbatran.com/api/login/verify",
        {
         email: phoneNumber,
          login_code: code,
        }
      );
      if (res?.data) {
        // ✅ SUCCESS
        console.log(res?.data, 'uuuuuuuuuuuuuuuuuuuuu');
        await saveToken(res?.data);
         
      setOtpModal(false);
      router.replace("/home");
      }

     

    } catch (err: any) {
      setError(
        err.response?.data?.message || "رمز التحقق غير صحيح"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(
        "https://egypt.mahmoudalbatran.com/api/login",
        { email: phoneNumber}
      );

      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setTimer(60);

    } catch {
      setError("فشل إعادة إرسال الرمز");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={otpModal} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setOtpModal(false)}>
        <View className="flex-1 bg-black/50 justify-center px-6">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-3xl p-8">

              <Text className="text-xl font-bold text-center">
                أدخل رمز التحقق
              </Text>

              <Text className="text-center text-gray-500 mt-2">
                تم إرسال رمز مكوّن من 6 أرقام الى  رقم الهاتف الخاص بك
              </Text>
              <Text className="text-center text-gray-500 mt-2">
                {phoneNumber}
              </Text>

              {/* OTP INPUTS */}
              <View
                className="flex-row justify-between mt-6"
                style={{ direction: "ltr" }}
              >
                {otp.map((value, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => (inputsRef.current[i] = r!)}
                    value={value}
                    maxLength={1}
                    keyboardType="number-pad"
                    className="w-12 h-14 text-xl text-center border rounded-xl"
                    onChangeText={(t) => {
                      const newOtp = [...otp];
                      newOtp[i] = t;
                      setOtp(newOtp);
                      if (t && i < 5) {
                        inputsRef.current[i + 1]?.focus();
                      }
                    }}
                  />
                ))}
              </View>

              {/* ERROR */}
              {error && (
                <Text className="text-red-500 text-center mt-4">
                  {error}
                </Text>
              )}

              {/* TIMER */}
              <Text className="text-center mt-4 text-gray-500">
                {timer > 0
                  ? `إعادة الإرسال خلال ${timer}s`
                  : "لم يصلك الرمز؟"}
              </Text>

              {/* RESEND */}
              {timer === 0 && (
                <Pressable onPress={resendOtp}>
                  <Text className="text-center text-brand-primary font-bold mt-2">
                    إعادة إرسال الرمز
                  </Text>
                </Pressable>
              )}

              {/* CONFIRM */}
              <Pressable
                onPress={verifyOtp}
                disabled={loading}
                className="mt-6 bg-brand-primary py-4 rounded-2xl"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-bold">
                    تأكيد
                  </Text>
                )}
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default OTPModal;
