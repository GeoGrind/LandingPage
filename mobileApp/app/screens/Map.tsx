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
import { Button, Image } from "react-native";
import { signOut, getAuth } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { Session, User } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import UserDotInfo from "./UserDotInfo";
import Navbar from "../components/NavBar";
import { Keyboard } from "react-native";
import { updateUserExpoToken } from "../utils/db";
import { getUserLocation } from "../utils/db";
import { useDispatch } from "react-redux";
import { updateLocation } from "../store/features/locationSlice";
import { store } from "../store/store";
const Map = () => {
  const [inSessionUsers, setInSessionUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({ course: "" });
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const appState = useRef(AppState.currentState);
  const { currentUser } = FIREBASE_AUTH;
  const [input, setInput] = useState<string>("");
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  const updateUI = async () => {
    await fetchData();
    console.log(store.getState().location);
    const newLocation = await getUserLocation();
    if (newLocation) {
      dispatch(updateLocation({ location: newLocation }));
    }
  };

  // This tracks if the user exit the app.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // Fetch the data when the user comes back.
        updateUI();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  // This use effect can fetch the data when there is a navigation even happened
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      updateUI();
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
    fetchData();
  };

  const handleSignOffClick = async () => {
    try {
      await stopSessionOfCurrentUser();
      await updateUserExpoToken("");
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
  if (loading) {
    return (
      // TODO: Make the loading look better
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onTouchStart={() => {
            // Dismiss the keyboard when the user taps on the map
            Keyboard.dismiss();
          }}
        >
          {filterUsers().map((user, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: user.location!.latitude,
                  longitude: user.location!.longitude,
                }}
              >
                <Text>{user.emoji}</Text>
                <Callout style={{ width: 300, height: 300 }}>
                  <UserDotInfo userMarker={user} />
                </Callout>
              </Marker>
            );
          })}
        </MapView>
        <View style={styles.searchBar}>
          <TextInput
            style={{
              borderRadius: 10,
              margin: 10,
              color: "#000",
              borderColor: "#666",
              backgroundColor: "#FFF",
              borderWidth: 1,
              height: 45,
              paddingHorizontal: 10,
              fontSize: 18,
            }}
            placeholder={"Search"}
            placeholderTextColor={"#666"}
            value={input}
            onChangeText={(s) => {
              setInput(s);
              console.log(s);
            }}
          />
        </View>
        <View style={styles.profilePicture}>
          <Button title="Profile" onPress={handleProfileClick} />
        </View>
        <View style={styles.buttonContainer}>
          <Navbar
            onRefreshClick={() => {
              fetchData();
            }}
            onStartSessionClick={() => {
              setShowForm(true);
            }}
            onStopSessionClick={handleStopSessionClick}
            onSignOffClick={handleSignOffClick}
            onTestClick={() => {
              navigation.navigate("Test");
            }}
            onListViewClick={() => {
              navigation.navigate("ListView");
            }}
            onChatClick={() => {
              navigation.navigate("AllChats");
            }}
          />
        </View>

        {showForm && (
          <Modal visible={showForm} transparent>
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPress={() => setShowForm(false)}
            >
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Course Name"
                  value={formValues.course}
                  onChangeText={(text) => setFormValues({ course: text })}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleFormSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBar: {
    position: "absolute",
    top: "5%",
    left: "25%",
    width: "50%",
    justifyContent: "center",
  },
  profilePicture: {
    position: "absolute", //use absolute position to show button on top of the map
    top: "5%", //for center align
    alignSelf: "flex-end", //for align to right
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: "100%",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "white",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  callout: {
    height: 400,
    width: 200, // Adjust the width as needed
    padding: 10,
    borderRadius: 5,
  },
});

export default Map;
