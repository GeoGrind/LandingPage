import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideRootStackParamList } from "../types";
import { getUserById } from "../utils/db";
import { useFocusEffect } from "@react-navigation/native";
import { User } from "../types";
import { useState } from "react";
import { Avatar } from "react-native-elements";
import { Button } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type Props = NativeStackScreenProps<InsideRootStackParamList, "Profile">;

const Profile = ({ route }: Props) => {
  const { id } = route.params;
  const [targetUser, setTargetUser] = useState<User | null>(null);

  const fetchUserDataAndSet = async () => {
    const user = await getUserById(id);

    setTargetUser(user);
  };
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
          size={wp("40%")}
          rounded
          source={{
            uri: targetUser?.profilePicture,
          }}
          containerStyle={styles.avatarStyle}
        />
        <View style={styles.profileInfoContainer}>
          <Text style={styles.nameText}>{targetUser?.name}</Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => {}}
              style={{
                marginVertical: wp("3%"),
                width: wp("40%"),
                marginRight: wp("5%"),
              }} // Set fixed width here
              labelStyle={{ marginHorizontal: 0 }}
            >
              CONNECT
            </Button>
            <Button
              mode="contained"
              onPress={() => {}}
              style={{ marginVertical: wp("3%"), width: wp("40%") }} // Set fixed width here
              labelStyle={{ marginHorizontal: 0 }}
            >
              MESSAGE
            </Button>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.cardText}>{targetUser?.university}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.cardText}>
                {targetUser?.yearOfGraduation}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.cardText}>{targetUser?.program}</Text>
            </View>
          </View>
        </View>
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
    flex: 0.2,
    backgroundColor: "grey",
  },
  bottomPartition: {
    flex: 0.8,
    backgroundColor: "white",
  },
  avatarStyle: {
    position: "absolute",
    left: "50%",
    top: "0%",
    transform: [{ translateX: -wp("20%") }, { translateY: -wp("20%") }],
  },
  nameText: {
    textAlign: "center",
    marginTop: hp("3%"),
    fontSize: 22,
    fontWeight: "bold",
  },
  profileInfoContainer: {
    position: "absolute",
    left: "50%",
    top: "15%",
    transform: [{ translateX: -wp("20%") }],
    alignItems: "center",
    width: wp("40%"),
  },

  buttonContainer: {
    marginTop: hp("3%"),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContainer: {
    width: wp("90%"), // 90% of the screen width, adjust accordingly
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 10,
    marginTop: 20, // or any value you like to have some space above the card
    alignSelf: "center", // to center the card horizontally
  },
  infoCard: {
    width: wp("80%"),
    backgroundColor: "white",
    paddingVertical: hp("1%"),
    borderRadius: 20,
    marginVertical: hp("1%"),
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
  },
});
