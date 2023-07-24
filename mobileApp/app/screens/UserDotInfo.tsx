import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { User } from "../types";
import { Button, Icon } from "react-native-elements";
import { incrementNumberOfCheerers } from "../utils/db";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { createChatRoom } from "../utils/db";
import { getChatRoomFromUserId } from "../utils/db";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// Note: User marker is the person who owns the marker, not the current Signed-in user
type Props = {
  userMarker: User;
};

const updateCheerersInDB = async (uid: string) => {
  try {
    await incrementNumberOfCheerers(uid);
  } catch (error) {
    console.error("Error occurred while incrementing numberOfCheerers:", error);
  }
};

const handleChatPerson = async (
  navigation: NativeStackNavigationProp<ParamListBase>,
  person1Id: string,
  person2Id: string
) => {
  try {
    const chatRoomId = await getChatRoomFromUserId(person1Id, person2Id);
    if (chatRoomId == null) {
      const newChatRoomId = await createChatRoom(person1Id, person2Id);
      navigation.navigate("SingleChat", { id: newChatRoomId });
    } else {
      navigation.navigate("SingleChat", { id: chatRoomId });
    }
  } catch (e) {
    console.log("handleChatPerson Error", e);
  }
};

export default function UserDotInfo({ userMarker }: Props) {
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  useEffect(() => {
    if (userMarker.onGoingSession) {
      setCheerers(userMarker.onGoingSession.numberOfCheerers || 0);
    }
  }, [userMarker]);

  const [cheerers, setCheerers] = useState<number>(0);
  if (!user) {
    console.log("No user is logged in");
    return null;
  }
  const handleButtonPress = () => {
    setIsButtonDisabled(true); // Disable the button immediately upon clicking
    updateCheerersInDB(userMarker.uid)
      .then(() => {
        setCheerers((prevCheerers) => prevCheerers + 1);
      })
      .catch((error) => {
        console.error(
          "Error occurred while incrementing numberOfCheerers:",
          error
        );
        setIsButtonDisabled(false); // Re-enable the button in case of an error
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{userMarker.onGoingSession?.course}</Text>
      <Text style={styles.randomText}>
        This is a random paragraph. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit.
      </Text>
      <Button
        title={cheerers > 0 ? `Like (${cheerers})` : "Like"}
        icon={<Icon name="thumb-up" type="material" color="white" />}
        buttonStyle={styles.button}
        onPress={handleButtonPress}
        disabled={
          isButtonDisabled ||
          userMarker.onGoingSession?.cheerers?.includes(user.uid)
        }
      />
      <Button
        title={"Chat with me"}
        icon={<Icon name="chat" type="material" color="white" />}
        buttonStyle={styles.button}
        onPress={() => handleChatPerson(navigation, userMarker.uid, user.uid)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  randomText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
