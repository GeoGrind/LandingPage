import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { sendNotificationById } from "../utils/notifications";

export default function Test() {
  const testHandler = async () => {
    console.log("here");
  };

  return (
    <View style={styles.container}>
      <Button title="Test" onPress={testHandler} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
