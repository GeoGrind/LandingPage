import React, { useRef, useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  AppState,
  Alert,
} from "react-native";
import "firebase/firestore";
import {
  fetchActiveUsers,
  getUserLocation,
  updateUserFields,
} from "../utils/db";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { Session, User } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Navbar from "../components/NavBar";
import { Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet from "@gorhom/bottom-sheet";
import { CustomizableBottomSheet } from "../components/CustomizableBottomSheet";
import { getUserById } from "../utils/db";
import { updateCurrentUser } from "../store/features/currentUserSlice";
import { setCurrentUser } from "../store/features/currentUserSlice";
import { useSelector } from "react-redux";

import { Modal, Portal, PaperProvider } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import SessionModal from "../components/SessionModal";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const Map = () => {
  const [inSessionUsers, setInSessionUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const appState = useRef(AppState.currentState);
  const { currentUser } = FIREBASE_AUTH;
  const [input, setInput] = useState<string>("");
  const [clickedUser, setClickedUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const currentUserRedux = useSelector(
    (state: any) => state.currentUser.currentUser
  );

  // Modal for starting session
  const [courseValue, setCourseValue] = useState<string | null>(null);
  const [timeValue, setTimeValue] = useState<number | null>(null);
  const [descriptionValue, setDescriptionValue] = useState<string | null>(null);
  // end of Modal for starting session

  // Bottom sheet logic
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpenPress = (user: User) => {
    setClickedUser(user);
    bottomSheetRef.current?.expand();
  };

  // End of Bottom sheet logic

  // Set up redux when it mounts
  const fetchAndSetData = async () => {
    if (FIREBASE_AUTH.currentUser?.uid === undefined) {
      console.log("Error when fetching user in Setting.tsx");
      return;
    }
    const currentUserFetched = await getUserById(
      FIREBASE_AUTH.currentUser?.uid
    );
    dispatch(setCurrentUser(currentUserFetched));
  };

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
        // Fetch the data when the user comes back.
        fetchData();
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
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    const temp1 = await fetchActiveUsers();
    await fetchAndSetData();
    setInSessionUsers(temp1);
  };

  const handleFormSubmit = async () => {
    /* TODO: This process is very slow, needs optimization 
    Try to update the UI at client side first, then update the DB in the background
    */

    if (!courseValue || !timeValue || !descriptionValue) {
      alert("Fill out all fields");
      return;
    }
    setShowForm(false);
    const newSession: Session = {
      course: courseValue,
      startTime: Date.now(),
      isVisible: true,
      sessionStartLocation: { longitude: 0, latitude: 0 }, // Set initial location
      numberOfCheerers: 0,
      cheerers: [],
      stopTime: Date.now() + timeValue,
      description: descriptionValue,
    };
    const curLocation = await getUserLocation();
    newSession.sessionStartLocation = curLocation;
    dispatch(
      updateCurrentUser({
        location: curLocation,
        isInSession: true,
        onGoingSession: newSession,
      })
    );
    updateUserFields({
      isInSession: true,
      onGoingSession: newSession,
      location: curLocation,
    });
  };

  const handleSignOffClick = async () => {
    try {
      updateUserFields({
        location: null,
        onGoingSession: null,
        isInSession: false,
      });
      await updateUserFields({
        expoToken: "",
      });
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      console.log("Error signing off:", error);
    }
  };
  const handleStopSessionClick = async () => {
    // TODO: Needs the UI update immediately after the button is clicked
    try {
      updateUserFields({
        location: null,
        onGoingSession: null,
        isInSession: false,
      });
      dispatch(
        updateCurrentUser({
          location: null,
          isInSession: false,
          onGoingSession: null,
        })
      );
    } catch (error) {
      console.log("Error stopping session:", error);
    }
  };
  const handleSettingClick = () => {
    navigation.navigate("Setting");
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

  return (
    <PaperProvider>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onTouchStart={() => {
            // Dismiss the keyboard when the user taps on the map
            Keyboard.dismiss();
          }}
        >
          {filterUsers().map((user, index) => {
            if (user.uid === currentUser?.uid) {
              return null;
            }
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: user.location!.latitude,
                  longitude: user.location!.longitude,
                }}
                onPress={() => {
                  handleOpenPress(user);
                }}
              >
                <Text>{user.emoji}</Text>
              </Marker>
            );
          })}
          {currentUserRedux?.isInSession && (
            <Marker
              key={10000000}
              coordinate={{
                latitude: currentUserRedux?.location.latitude,
                longitude: currentUserRedux?.location.longitude,
              }}
              onPress={() => {
                handleOpenPress(currentUserRedux);
              }}
            >
              <Text>{currentUserRedux?.emoji}</Text>
            </Marker>
          )}
        </MapView>
        <View style={styles.searchContainer}>
          {currentUserRedux?.isInSession && (
            <CountdownCircleTimer
              isPlaying
              duration={
                (currentUserRedux.onGoingSession.stopTime -
                  currentUserRedux.onGoingSession.startTime) /
                1000
              }
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[7, 5, 2, 0]}
              size={50}
              strokeWidth={6}
              onComplete={() => {
                handleStopSessionClick();
              }}
            >
              {({ remainingTime }) => {
                const hours = Math.floor(remainingTime / 3600);
                const minutes = Math.floor((remainingTime % 3600) / 60);
                return <Text>{`${hours}:${minutes}`}</Text>;
              }}
            </CountdownCircleTimer>
          )}
          <TextInput
            style={styles.searchBar}
            placeholder={"Search"}
            placeholderTextColor={"#666"}
            value={input}
            onChangeText={(s) => {
              setInput(s);
              console.log(s);
            }}
          />
          <TouchableOpacity onPress={fetchData}>
            <FontAwesome5 name="sync" size={30} color="black" />
          </TouchableOpacity>
        </View>
        {!currentUserRedux?.isInSession && (
          <View style={styles.roundButton}>
            <FontAwesome5
              name="play"
              size={24}
              color="white"
              onPress={() => setShowForm(true)}
            />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Navbar
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
            onSettingClick={handleSettingClick}
          />
        </View>

        <Portal>
          <Modal
            visible={showForm}
            onDismiss={() => setShowForm(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <SessionModal
              courseValue={courseValue}
              timeValue={timeValue}
              descriptionValue={descriptionValue}
              setCourseValue={setCourseValue}
              setTimeValue={setTimeValue}
              setDescriptionValue={setDescriptionValue}
              handleFormSubmit={handleFormSubmit}
            />
          </Modal>
        </Portal>

        {clickedUser && (
          <CustomizableBottomSheet
            bottomSheetRef={bottomSheetRef}
            sheetContent="Awesome 🎉"
            userMarker={clickedUser}
          />
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    position: "absolute",
    top: "5%",
    width: "80%",
    left: "10%", // Center the container
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    borderRadius: 10,
    margin: 10,
    color: "#000",
    borderColor: "#666",
    backgroundColor: "#FFF",
    borderWidth: 1,
    height: 45,
    paddingHorizontal: 10,
    fontSize: 18,
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
    backgroundColor: "white",
    padding: 20,
    width: "80%", // 80% of the screen width
    height: "50%", // 50% of the screen height
    alignSelf: "center",
    borderRadius: 5,
  },
  roundButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 60, // Adjust this value as per your Navbar's height
    alignSelf: "center",
  },
});

export default Map;
