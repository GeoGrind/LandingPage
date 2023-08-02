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
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { store } from "../store/store";
import { useSelector } from "react-redux";

export default function Profile() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const currentUser = useSelector(
    (state: any) => state.currentUser.currentUser
  );

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
              {currentUser?.name}
            </Paragraph>
            <FontAwesome5
              name="arrow-right"
              size={30}
              color="black"
              onPress={() => {
                navigation.navigate("UpdateBase", {
                  field: "name",
                });
              }}
            />
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Title>Email:</Title>
          <View style={styles.rightSection}>
            <Paragraph
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textWrapper}
            >
              {currentUser?.email}
            </Paragraph>
            <FontAwesome5
              name="arrow-right"
              size={30}
              color="black"
              onPress={() => {
                navigation.navigate("UpdateBase", {
                  field: "email",
                });
              }}
            />
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Title>Program:</Title>
          <View style={styles.rightSection}>
            <Paragraph
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textWrapper}
            >
              {currentUser?.program}
            </Paragraph>
            <FontAwesome5
              name="arrow-right"
              size={30}
              color="black"
              onPress={() => {
                navigation.navigate("UpdateBase", {
                  field: "program",
                });
              }}
            />
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Title>Year of Graduation:</Title>
          <View style={styles.rightSection}>
            <Paragraph
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textWrapper}
            >
              {currentUser?.yearOfGraduation}
            </Paragraph>
            <FontAwesome5
              name="arrow-right"
              size={30}
              color="black"
              onPress={() => {
                navigation.navigate("UpdateBase", {
                  field: "yearOfGraduation",
                });
              }}
            />
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Title>Status:</Title>
          <View style={styles.rightSection}>
            <Paragraph
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textWrapper}
            >
              {currentUser?.emoji}
            </Paragraph>
            <FontAwesome5
              name="arrow-right"
              size={30}
              color="black"
              onPress={() => {
                navigation.navigate("UpdateEmoji");
              }}
            />
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
    width: 350,
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
