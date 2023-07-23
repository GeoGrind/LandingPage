import React, { useRef } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  AppState,
} from "react-native";
import { useState, useEffect } from "react";
import "firebase/firestore";
import {
  updateSession,
  getUserLocationAndStoreInDb,
  stopSessionOfCurrentUser,
  fetchActiveUsers,
} from "../utils/db";
import { Button } from "react-native";
import { signOut, getAuth } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { Session, User } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UserDotInfo from "./UserDotInfo";
import Navbar from "../components/NavBar";
import { Keyboard } from "react-native";
import SessionCard from "../components/SessionCard";

const ListView = () => {
  const [inSessionUsers, setInSessionUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ course: "" });
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const appState = useRef(AppState.currentState);
  const { currentUser } = FIREBASE_AUTH;
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  // This tracks if the user exit the app.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        // Fetch the data when the user comes back.
        fetchData();
      }
      appState.current = nextAppState;
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  // This use effect can fetch the data when there is a navigation even happened
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    const temp1 = await fetchActiveUsers();
    setInSessionUsers(temp1);
  };

  const handleFormSubmit = async () => {
    /* TODO: This process is very slow, needs optimization 
    Try to update the UI at client side first, then update the DB in the background
    */
    setShowForm(false);
    const newSession: Session = {
      course: formValues.course,
      startTime: Date.now(),
      isVisible: true,
      sessionStartLocation: { longitude: 0, latitude: 0 }, // Set initial location
      numberOfCheerers: 0,
      cheerers: [],
    };

    const userLocation = await getUserLocationAndStoreInDb();
    newSession.sessionStartLocation = userLocation;
    await updateSession(newSession);
    console.log(`Form submitted, course: ${formValues.course}`);
    fetchData();
  };

  const handleSignOffClick = async () => {
    try {
      await stopSessionOfCurrentUser();
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.log("Error signing off:", error);
    }
  };
  const handleStopSessionClick = async () => {
    // TODO: Needs the UI update immediately after the button is clicked
    try {
      await stopSessionOfCurrentUser();
      await fetchData();
    } catch (error) {
      console.log("Error stopping session:", error);
    }
  };
  const handleProfileClick = () => {
    navigation.navigate("Profile");
  };

  const filterUsers = () => {
    if (!input.trim()) {
      return inSessionUsers; // If input is empty, return all users
    }

    // Filter users based on the prefix match in "onGoingSession.course"
    return inSessionUsers.filter(
      (user) =>
        user.onGoingSession && user.onGoingSession.course.startsWith(input)
    );
  };
  const newSession: Session = {
    course: "123",
    startTime: Date.now(),
    isVisible: true,
    sessionStartLocation: { longitude: 0, latitude: 0 }, // Set initial location
    numberOfCheerers: 0,
    cheerers: [],
  };
  return (
    <View style={styles.container}>
      <Button title="Exit" onPress={() => navigation.navigate("Map")} />
      <SessionCard session={newSession} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListView;
