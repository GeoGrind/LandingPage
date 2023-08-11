import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

function getIconByTitle(title: string) {
  switch (title) {
    case "Email": {
      return <FontAwesome5 name="inbox" size={24} color="black" />;
    }
    case "Name": {
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

function CircleInfo({ title, onPress, style }: any) {
  return (
    <TouchableOpacity style={[styles.circleContainer, style]} onPress={onPress}>
      <Text style={styles.circleTitle}>{title}</Text>
      {getIconByTitle(title)}
      <FontAwesome5 name="arrow-right" size={24} color="black" />
    </TouchableOpacity>
  );
}

export default function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.container}>
      <CircleInfo
        title="Name"
        onPress={() => navigation.navigate("UpdateBase", { field: "name" })}
        style={styles.circle1}
      />

      <CircleInfo
        title="Program"
        onPress={() => navigation.navigate("UpdateBase", { field: "program" })}
        style={styles.circle2}
      />
      <CircleInfo
        title="Year"
        onPress={() =>
          navigation.navigate("UpdateBase", { field: "yearOfGraduation" })
        }
        style={styles.circle3}
      />
      <CircleInfo
        title="Status"
        onPress={() => navigation.navigate("UpdateEmoji")}
        style={styles.circle4}
      />
      <CircleInfo
        title="Courses"
        onPress={() => navigation.navigate("UpdateEmoji")}
        style={styles.circle5}
      />
      <CircleInfo
        title="Profile Picture"
        onPress={() => navigation.navigate("UpdateProfilePicture")}
        style={styles.circle6}
      />
      <CircleInfo
        title="University"
        onPress={() =>
          navigation.navigate("UpdateBase", { field: "university" })
        }
        style={styles.circle7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    position: "relative", // Important for absolute positioning
  },
  circleContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute", // Absolute position
  },
  circleTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  circleInfo: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  circle1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 30, // Predefined Y position
    left: 40, // Predefined X position
  },

  circle2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    top: 350,
    right: 30,
  },
  circle3: {
    width: 90,
    height: 90,
    borderRadius: 45,
    top: 100,
    right: 50,
  },
  circle4: {
    width: 110,
    height: 110,
    borderRadius: 55,
    bottom: 80,
    left: 200,
  },
  circle5: {
    width: 110,
    height: 110,
    borderRadius: 65,
    bottom: 400,
    left: 20,
  },
  circle6: {
    width: 130,
    height: 130,
    borderRadius: 65,
    bottom: 200,
    left: 20,
  },
  circle7: {
    width: 90,
    height: 90,
    borderRadius: 45,
    bottom: 20,
    left: 20,
  },
});
