import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

import Modal, { ReactNativeModal } from "react-native-modal";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { updateUserProfile } from "../utils/db";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { getUserById } from "../utils/db";
import { User } from "../types";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    const fetchAndSetData = async () => {
      if (FIREBASE_AUTH.currentUser?.uid === undefined) {
        console.log("Error when fetching user in profile.tsx");
        return;
      }
      const currentUserFetched = await getUserById(
        FIREBASE_AUTH.currentUser?.uid
      );
      setCurrentUser(currentUserFetched!);
    };
    try {
      fetchAndSetData();
    } catch (e) {
      console.log("Profile.tsx", e);
    }
  }, []);

  const handleFormSubmit = async () => {
    // TODO: update user info
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Title>Name:</Title>
          <View style={styles.rightSection}>
            <Paragraph
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textWrapper}
            >
              {currentUser?.name ? currentUser.name : "Empty"}
            </Paragraph>
            <FontAwesome5 name="arrow-right" size={30} color="black" />
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Title>Name:</Title>
          <View style={styles.rightSection}>
            <Paragraph
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textWrapper}
            >
              {currentUser?.email ? currentUser.email : "Empty"}
            </Paragraph>
            <FontAwesome5 name="arrow-right" size={30} color="black" />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    marginBottom: 10,
    width: 300,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  textWrapper: {
    marginRight: 10, // Add the desired spacing here (e.g., 10)
  },
});
