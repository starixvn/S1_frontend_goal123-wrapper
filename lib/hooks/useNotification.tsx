import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';

// checkout notifee to handle on notification pressed
// background handler is configured at expo/index.js
export default function useNotification() {
  useEffect(() => {
    async function onDisplayNotification(message) {
      // Request permissions (required for iOS)
      await notifee.requestPermission();

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      try {
        await notifee.displayNotification({
          title: message.notification.title,
          body: message.notification.body,
          android: {
            channelId,
          },
        });
      } catch (e) {
        console.log('on notification received error', e);
      }
    }

    async function onMessageReceived(message) {
      console.log(
        '🚀 ~ file: useNotification.tsx:33 ~ onMessageReceived ~ message',
        message,
      );
      onDisplayNotification(message);
    }

    async function configureNotification() {
      await messaging().requestPermission();
      // await messaging().registerDeviceForRemoteMessages()
      const token = await messaging().getToken();
      console.log('FCM TOKEN : ', token);
    }

    configureNotification();

    const unsubscribe = messaging().onMessage(onMessageReceived);

    return () => {
      unsubscribe();
    };
  }, []);
}
