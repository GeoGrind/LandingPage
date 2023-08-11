import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideRootStackParamList } from "../types";
import { getUserById } from "../utils/db";
import { useFocusEffect } from "@react-navigation/native";
import { User } from "../types";
import { useState } from "react";
import { Avatar } from "react-native-elements";
type Props = NativeStackScreenProps<InsideRootStackParamList, "Profile">;

const Profile = ({ route }: Props) => {
  const { id } = route.params;
  const [targetUser, setTargetUser] = useState<User | null>(null);

  const fetchUserDataAndSet = async () => {
    const user = await getUserById(id);

    setTargetUser(user);
  };
  useEffect(() => {
    fetchUserDataAndSet();
    console.log("here");
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchUserDataAndSet();
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.topPartition}></View>
      <View style={styles.bottomPartition}>
        <Avatar
          size={150}
          rounded
          source={{
            uri: targetUser?.profilePicture,
          }}
          containerStyle={styles.avatarStyle}
        />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topPartition: {
    flex: 0.25,
    backgroundColor: "grey",
  },
  bottomPartition: {
    flex: 0.75,
    backgroundColor: "white",
  },
  avatarStyle: {
    position: "absolute",
    left: "50%",
    top: "0%",
    transform: [
      { translateX: -75 }, // Half of Avatar's width
      { translateY: -75 }, // Shift upwards by half of Avatar's height
    ],
  },
});
