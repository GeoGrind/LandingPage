import * as Notifications from "expo-notifications";
import { Keyboard, Alert, Platform } from "react-native";
import { getUserById } from "./db";
import * as Device from "expo-device";

export const initializeExpoToken = async () => {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "48115910-b9cc-4fae-a62a-0c6ad6000a86",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
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
  const user = await getUserById(id);
  const expoToken = user?.expoToken;
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
