import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { Avatar, ListItem } from "react-native-elements";
import { Button } from "react-native-elements";
import { updateUserFields } from "../utils/db";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

function getIconByTitle(title: string) {
  switch (title) {
    case "Email": {
      return <FontAwesome5 name="inbox" size={24} color="black" />;
    }
    case "Username": {
      return <FontAwesome5 name="user" size={24} color="black" />;
    }
    case "Year": {
      return <FontAwesome5 name="calendar-alt" size={24} color="black" />;
    }

    case "Program": {
      return <FontAwesome5 name="graduation-cap" size={24} color="black" />;
    }
    case "Status": {
      return <FontAwesome5 name="smile" size={24} color="black" />;
    }
    case "Courses": {
      return <FontAwesome5 name="chalkboard-teacher" size={24} color="black" />;
    }
    case "Profile Picture": {
      return <FontAwesome5 name="portrait" size={24} color="black" />;
    }
    case "University": {
      return <FontAwesome5 name="school" size={24} color="black" />;
    }
    default: {
      return <Text>Error</Text>;
    }
  }
}
const handleSignOffClick = async () => {
  try {
    updateUserFields({
      session: null,
    });
    await updateUserFields({
      expoToken: "",
    });
    await signOut(FIREBASE_AUTH);
  } catch (error) {
    console.log("Error signing off:", error);
  }
};
export default function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const currentUserRedux = useSelector(
    (state: any) => state.currentUser.currentUser
  );
  const navigateToUpdateBase = (field: string) => {
    navigation.navigate("UpdateBase", { field });
  };
  const settingsOptions = [
    { title: "Username", onPress: () => navigateToUpdateBase("username") },
    { title: "Program", onPress: () => navigateToUpdateBase("program") },
    { title: "Year", onPress: () => navigateToUpdateBase("yearOfGraduation") },
    { title: "Status", onPress: () => navigation.navigate("UpdateEmoji") },
    {
      title: "Courses",
      onPress: () => navigation.navigate("UpdateTermCourses"),
    },
    {
      title: "Profile Picture",
      onPress: () => navigation.navigate("UpdateProfilePicture"),
    },
    { title: "University", onPress: () => navigateToUpdateBase("university") },
  ];

  const getFieldText = (field: string) => {
    switch (field) {
      case "Username":
        return currentUserRedux?.username;

      case "Program":
        return currentUserRedux?.program;

      case "Year":
        return currentUserRedux?.yearOfGraduation;

      case "Status":
        return currentUserRedux?.emoji;

      case "Courses":
        return currentUserRedux?.termCourses.join(", ");

      case "Profile Picture":
        return null;

      case "University":
        return currentUserRedux?.university;

      default:
        return;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {settingsOptions.map((option, index) => (
        <ListItem
          key={index}
          onPress={option.onPress}
          containerStyle={styles.listItem}
        >
          <ListItem.Content style={styles.iconContainer}>
            {getIconByTitle(option.title)}
          </ListItem.Content>
          <ListItem.Content style={styles.textContainer}>
            <ListItem.Title style={styles.listItemText}>
              {option.title}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.detailText}>
              {getFieldText(option.title)}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color="#b5b5b5" />
        </ListItem>
      ))}
      <Button
        title="Log Out"
        onPress={handleSignOffClick}
        buttonStyle={styles.logoutButton}
        titleStyle={styles.logoutButtonText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10, // Added padding around the list
  },
  listItem: {
    borderRadius: 10, // Added border radius
    marginBottom: 12, // Increased spacing between items
    elevation: 1, // For Android shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowRadius: 3, // For iOS shadow
    shadowOffset: { width: 1, height: 1 }, // For iOS shadow
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 4,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Made text darker
  },
  detailText: {
    fontSize: 14,
    color: "#888", // Changed gray tone
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#e74c3c", // Choose a color that signifies 'caution' or 'action'.
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
