import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
// import {
//   getFcmToken,
//   getFcmTokenFromLocalStorage,
//   requestUserPermission,
//   notificationListener,
// } from "../utils/notifications";
// //
// import { Colors } from "react-native/Libraries/NewAppScreen";
// import { localStorage } from "../utils/storage";

const Test = () => {
  // const fcmToken = localStorage.getString("fcmtoken");
  // const [generatedToken, setGeneratedToken] = useState();
  // const isDarkMode = useColorScheme() === "dark";

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  // useEffect(() => {
  //   console.log("storage", fcmToken, "newly generated", generatedToken);
  // }, [fcmToken, generatedToken]);

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const token = await getFcmToken();
  //     if (token) {
  //       setGeneratedToken(token);
  //     }
  //   };
  //   const fetchTokenByLocal = async () => {
  //     await getFcmTokenFromLocalStorage();
  //   };
  //   void fetchToken();
  //   void fetchTokenByLocal();
  //   void requestUserPermission();
  //   void notificationListener();
  // }, []);

  return (
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     barStyle={isDarkMode ? "light-content" : "dark-content"}
    //     backgroundColor={backgroundStyle.backgroundColor}
    //   />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     contentContainerStyle={styles.sectionContainer}
    //     style={backgroundStyle}
    //   >
    //     <Button title="send notification" />
    //   </ScrollView>
    // </SafeAreaView>
    <Text>Test</Text>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default Test;
