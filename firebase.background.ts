// import messaging from "@react-native-firebase/messaging";

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log("📦 Background message:", remoteMessage.data);
// });



// firebase.background.ts

// import messaging from "@react-native-firebase/messaging";

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log(
//     "📦 FCM background message:",
//     remoteMessage.messageId,
//     remoteMessage.data
//   );

//   // لا تحاول هنا استخدام router أو React state.
//   // إذا احتجت تخزين البيانات، يمكنك فعل ذلك هنا.
// });

// import messaging from '@react-native-firebase/messaging';

// // ✅ استدعاء messaging كـ namespace يحتوي على الدالة نفسها أو getMessaging
// messaging.setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });










// import messaging from "@react-native-firebase/messaging";

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log("📦 Background message:", remoteMessage.data);
// });




import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

const firebaseApp = getApp();
const messaging = getMessaging(firebaseApp);

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  console.log(
    "📦 FCM background message:",
    remoteMessage
  );

  console.log(
    "📦 FCM background data:",
    remoteMessage.data
  );
});
