import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Button,
  View,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import * as Notifications from "expo-notifications";
import { sendNotificationById } from "../utils/notifications";
import BottomSheet from "@gorhom/bottom-sheet";
import { updateUserFields } from "../utils/db";
import { Text, TextInput } from "react-native";
import { User } from "../types";
import { getUserById } from "../utils/db";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import EmojiModal from "react-native-emoji-modal";
import { store } from "../store/store";
import { updateCurrentUser } from "../store/features/currentUserSlice";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/features/currentUserSlice";
// Testing redux

// End of Testing redux

export default function Test() {
  const dispatch = useDispatch();

  const fetchAndSetData = async () => {
    if (FIREBASE_AUTH.currentUser?.uid === undefined) {
      console.log("Error when fetching user in profile.tsx");
      return;
    }
    const currentUserFetched = await getUserById(
      FIREBASE_AUTH.currentUser?.uid
    );
    dispatch(setCurrentUser(currentUserFetched));
  };

  return (
    <View style={styles.container}>
      <Button
        title="Print store"
        onPress={() => {
          console.log(store.getState().currentUser.currentUser?.name);
          console.log(store.getState().currentUser.currentUser?.email);
        }}
      />

      <Button
        title="Initial set"
        onPress={() => {
          fetchAndSetData();
        }}
      />

      <Button
        title="Update the name and email"
        onPress={() => {
          console.log(store.getState().currentUser);
          dispatch(
            updateCurrentUser({ name: "TestName", email: "Test Email" })
          );
          console.log(store.getState().currentUser.currentUser?.name);
        }}
      />
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
  emojiContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // ensure the emoji stays within the circle
  },
  emoji: {
    fontSize: 50,
  },
});
