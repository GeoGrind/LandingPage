import * as Notifications from "expo-notifications";
import { Keyboard, Alert, Platform } from "react-native";
import { getExpoTokenById } from "./db";

export const initializeExpoToken = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;

  if (finalStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permission required",
      "Push notifications need the appropriate permissions."
    );
    return;
  }

  const pushTokenData = await Notifications.getExpoPushTokenAsync({
    projectId: "b8fc75f0-6051-4db3-a6d0-6f841221ca76",
  });

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return pushTokenData.data;
};

export function scheduleNotificationHandler() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "My first local notification",
      body: "This is the body of the notification.",
      data: { userName: "Max" },
    },
    trigger: {
      seconds: 5,
    },
  });
}

export const sendNotificationById = async (id: string) => {
  const expoToken = await getExpoTokenById(id);
  if (expoToken === "") {
    return;
  }
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: `${expoToken}`,
      title: "Test - sent from a device!",
      body: "This is a test!",
    }),
  });
};
