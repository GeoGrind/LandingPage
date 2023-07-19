import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});
  
// Fire a notification, returns true if succeed, false otherwise
export const fireNotification = async (): Promise<boolean> => {
    try{
        const token: string = await registerForPushNotificationsAsync();
        console.log(token);
    } catch {
        console.log("failed to get the token")
        return false
    }
    
    try{
        await schedulePushNotification();
    } catch{
        console.log("failed to push the notification");
    }
    return true
};


const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
};

const registerForPushNotificationsAsync = async (): Promise<string> => {

    let token: string = '';
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return token;
        }
        const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        token = expoPushToken;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
};