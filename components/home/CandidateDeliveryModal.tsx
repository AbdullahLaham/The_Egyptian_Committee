// import {
//   Modal,
//   Pressable,
//   Text,
//   View,
//   ActivityIndicator,
// } from "react-native";

// import {
//   Ionicons,
//   MaterialIcons,
// } from "@expo/vector-icons";

// export default function CandidateDeliveryModal({
//   visible,
//   candidate,
//   loading,
//   onClose,
//   onConfirm,
// }: any) {
//   if (!candidate) return null;


// const isDelivered =
//   candidate?.status == "مستلم";

// const currentStatusStyle =
//   isDelivered
//     ? {
//         bg: "bg-green-500/10",
//         text: "text-green-400",
//       }
//     : {
//         bg: "bg-yellow-500/10",
//         text: "text-yellow-400",
//       };

// const actionButtonStyle =
//   isDelivered
//     ? "bg-brand-primary"
//     : "bg-green-500";

// const actionButtonText =
//   isDelivered
//     ? "إلغاء التسليم"
//     : "تأكيد التسليم";

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//     >
//       <View className="flex-1 bg-black/70 justify-end">
//         <View className="bg-brand-secondary rounded-t-[40px] px-6 pt-6 pb-10 border-t border-brand-white/10">

//           {/* HANDLE */}

//           <View className="w-20 h-2 rounded-full bg-brand-white/20 self-center mb-6" />

//           {/* ICON */}

//           <View
//             className={`w-24 h-24 rounded-full border items-center justify-center self-center ${
//               isDelivered
//                 ? "bg-green-500/10 border-green-500/20"
//                 : "bg-yellow-500/10 border-yellow-500/20"
//             }`}
//           >
//             <MaterialIcons
//               name={
//                 isDelivered
//                   ? "check-circle"
//                   : "volunteer-activism"
//               }
//               size={46}
//               color={
//                 isDelivered
//                   ? "#22C55E"
//                   : "#FACC15"
//               }
//             />
//           </View>

//           {/* TITLE */}

//           <Text className="text-brand-white text-3xl font-extrabold text-center mt-6">
//             {isDelivered
//               ? "تم التسليم"
//               : "تسليم المستفيد"}
//           </Text>

//           <Text className="text-gray-400 text-center mt-3 leading-7">
//             {isDelivered
//               ? "هذا المستفيد تم تسليمه بالفعل، يمكنك إلغاء التسليم."
//               : "هل أنت متأكد من تسليم المساعدة لهذا المستفيد؟"}
//           </Text>

//           {/* CANDIDATE INFO */}

//           <View className="mt-8 rounded-[28px] bg-brand-white/5 border border-brand-white/10 p-5">

//             <View className="flex-row items-center">

//               <View className="w-16 h-16 rounded-2xl bg-brand-primary/10 items-center justify-center">
//                 <Ionicons
//                   name="person"
//                   size={30}
//                   color="#fff"
//                 />
//               </View>

//               <View className="flex-1 mr-4">

//                 <Text className="text-brand-white text-xl font-extrabold">
//                   {
//                     candidate?.beneficiary
//                       ?.full_name
//                   }
//                 </Text>

//                 <Text className="text-gray-400 mt-2">
//                   الهوية:{" "}
//                   {
//                     candidate?.beneficiary
//                       ?.ID_number
//                   }
//                 </Text>

//                 <Text className="text-gray-400 mt-1">
//                   الجوال:{" "}
//                   {
//                     candidate?.beneficiary
//                       ?.Phone_Number
//                   }
//                 </Text>
//               </View>
//             </View>

//             {/* STATUS */}

//             <View className="mt-5 flex-row items-center justify-between">

//               <Text className="text-gray-400">
//                 الحالة الحالية
//               </Text>

//               <View
//                 className={`px-4 py-2 rounded-full ${
//                   isDelivered
//                     ? "bg-green-500/10"
//                     : "bg-yellow-500/10"
//                 }`}
//               >
//                 <Text
//                   className={`font-bold ${
//                     isDelivered
//                       ? "text-green-400"
//                       : "text-yellow-400"
//                   }`}
//                 >
//                   {candidate.status}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* ACTIONS */}

//           <View className="flex-row gap-2 mt-8">

//             <Pressable
//               onPress={onClose}
//               className="flex-1 py-5 rounded-2xl bg-brand-white/5 border border-brand-white/10 items-center"
//             >
//               <Text className="text-brand-white font-bold text-lg">
//                 إغلاق
//               </Text>
//             </Pressable>

//            <Pressable
//               onPress={onConfirm}
//               disabled={loading}
//               className={`flex-1 py-5 rounded-2xl items-center mr-4 ${
//                 isDelivered
//                   ? "bg-red-500"
//                   : "bg-green-500"
//               }`}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text className="text-white font-extrabold text-lg">
//                   {isDelivered
//                     ? "إلغاء التسليم"
//                     : "تأكيد التسليم"}
//                 </Text>
//               )}
//             </Pressable>
//           </View>

//           <View className="h-[6rem]" />
//         </View>
//       </View>
//     </Modal>
//   );
// }











import {
  Modal,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Image } from "expo-image";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import { useEffect, useState } from "react";
import { updateCandidateStatus } from "@/services/candidates.service";

export default function CandidateDeliveryModal({
  visible,
  candidate,
  loading,
  onClose,
  onConfirm,
}: any) {
  const [selectedImage, setSelectedImage] =
    useState<any>(null);

  useEffect(() => {
    if (!visible) {
      setSelectedImage(null);
    }
  }, [visible]);

  if (!candidate) return null;

  const isDelivered =
    candidate?.status === "مستلم";

  /* ================= CAMERA ================= */

  const handleTakePhoto =
    async () => {
      try {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (
          permission.status !== "granted"
        ) {
          Alert.alert(
            "صلاحية مطلوبة",
            "يجب السماح باستخدام الكاميرا"
          );

          return;
        }

        const result =
          await ImagePicker.launchCameraAsync(
            {
              mediaTypes:
                ImagePicker.MediaTypeOptions.Images,

              allowsEditing: true,

              quality: 0.7,

              aspect: [4, 3],
            }
          );

        if (!result.canceled) {
          setSelectedImage(
            result.assets?.[0]
          );
          console.log("Selected image:", result.assets?.[0]);
          // const res = await onConfirm(result.assets?.[0]);
          const res = await updateCandidateStatus({
            candidateId: candidate.id,
            status: "مستلم",
            imageUri: result.assets?.[0]?.["uri"] || "",
          });
          // console.log(res, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
          console.log("Confirmed image:", result.assets?.[0]?.uri);

        }
      } catch (error) {
        console.log(error);
      }
    };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    onConfirm(selectedImage || null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-brand-secondary rounded-t-[40px] px-6 pt-6 pb-10 border-t border-brand-white/10">

          {/* HANDLE */}

          <View className="w-20 h-2 rounded-full bg-brand-white/20 self-center mb-6" />

          {/* ICON */}

          <View
            className={`w-24 h-24 rounded-full border items-center justify-center self-center ${
              isDelivered
                ? "bg-green-500/10 border-green-500/20"
                : "bg-yellow-500/10 border-yellow-500/20"
            }`}
          >
            <MaterialIcons
              name={
                isDelivered
                  ? "check-circle"
                  : "volunteer-activism"
              }
              size={46}
              color={
                isDelivered
                  ? "#22C55E"
                  : "#FACC15"
              }
            />
          </View>

          {/* TITLE */}

          <Text className="text-brand-white text-3xl font-extrabold text-center mt-6">
            {isDelivered
              ? "تم التسليم"
              : "تسليم المستفيد"}
          </Text>

          <Text className="text-gray-400 text-center mt-3 leading-7">
            {isDelivered
              ? "يمكنك إضافة صورة هوية المستفيد أو إلغاء التسليم."
              : "يمكنك تأكيد التسليم مباشرة."}
          </Text>

          {/* INFO */}

          <View className="mt-8 rounded-[28px] bg-brand-white/5 border border-brand-white/10 p-5">

            <View className="flex-row items-center">

              <View className="w-16 h-16 rounded-2xl bg-brand-primary/10 items-center justify-center">
                <Ionicons
                  name="person"
                  size={30}
                  color="#fff"
                />
              </View>

              <View className="flex-1 mr-4">

                <Text className="text-brand-white text-xl font-extrabold">
                  {
                    candidate?.beneficiary
                      ?.full_name
                  }
                </Text>

                <Text className="text-gray-400 mt-2">
                  الهوية:{" "}
                  {
                    candidate?.beneficiary
                      ?.ID_number
                  }
                </Text>

                <Text className="text-gray-400 mt-1">
                  الجوال:{" "}
                  {
                    candidate?.beneficiary
                      ?.Phone_Number
                  }
                </Text>
              </View>
            </View>

            {/* STATUS */}

            <View className="mt-5 flex-row items-center justify-between">

              <Text className="text-gray-400">
                الحالة الحالية
              </Text>

              <View
                className={`px-4 py-2 rounded-full ${
                  isDelivered
                    ? "bg-green-500/10"
                    : "bg-yellow-500/10"
                }`}
              >
                <Text
                  className={`font-bold ${
                    isDelivered
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {candidate.status}
                </Text>
              </View>
            </View>
          </View>

          {candidate?.img && (
            <View className="mt-6">
              <Text className="text-gray-400 mb-2">
                صورة التسليم السابقة
              </Text>
              <Image
                source={{
                  uri: candidate.img,
                }}

                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 24,



                }}
                contentFit="cover"
              />
            </View>
          )}


          {/* CAMERA SECTION */}

          {isDelivered && (
            <View className="mt-6">

              <Pressable
                onPress={handleTakePhoto}
                className="bg-brand-white/5 border border-brand-white/10 rounded-2xl p-4 items-center"
              >
                <Ionicons
                  name="camera"
                  size={28}
                  color="#fff"
                />

                <Text className="text-white font-bold mt-2">
                  {selectedImage
                    ? "إعادة تصوير الهوية"
                    : "إضافة صورة الهوية"}
                </Text>
              </Pressable>

              {selectedImage && (
                <Image
                  source={{
                    uri:
                      selectedImage.uri,
                  }}
                  style={{
                    width: "100%",
                    height: 220,
                    borderRadius: 24,
                    marginTop: 16,
                  }}
                  contentFit="cover"
                />
              )}
            </View>
          )}

          {/* ACTIONS */}

          <View className="flex-row mt-8">

            <Pressable
              onPress={onClose}
              className="flex-1 py-5 rounded-2xl bg-brand-white/5 border border-brand-white/10 items-center"
            >
              <Text className="text-brand-white font-bold text-lg">
                إغلاق
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`flex-1 py-5 rounded-2xl items-center mr-4 ${
                isDelivered
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-extrabold text-lg">
                  {isDelivered
                    ? "إلغاء التسليم"
                    : "تأكيد التسليم"}
                </Text>
              )}
            </Pressable>
          </View>

          <View className="h-[6rem]" />
        </View>
      </View>
    </Modal>
  );
}