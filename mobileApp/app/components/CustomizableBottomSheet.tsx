import { RefObject, useState, useEffect } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { View, Text, StyleSheet } from "react-native";
import { User } from "../types";
import { getAuth } from "firebase/auth";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  incrementNumberOfCheerers,
  getChatRoomFromUserId,
  createChatRoom,
} from "../utils/db";
import { Button, Icon } from "react-native-elements";
interface Props {
  bottomSheetRef: RefObject<BottomSheet>;
  sheetContent: string;
  userMarker: User;
}
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
      navigation.navigate("AllChats");
    } else {
      navigation.navigate("AllChats");
    }
  } catch (e) {
    console.log("handleChatPerson Error", e);
  }
};
export const CustomizableBottomSheet: React.FC<Props> = ({
  bottomSheetRef,
  userMarker,
  sheetContent,
}) => {
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
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["25%", "50%"]}
      enablePanDownToClose={true}
    >
      <View style={styles.customizableBottomSheetContentContainer}>
        <Text>{userMarker.email}</Text>
        <Text>{userMarker.emoji}</Text>
      </View>

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

      {userMarker.uid !== user.uid && (
        <Button
          title={"Chat with me"}
          icon={<Icon name="chat" type="material" color="white" />}
          buttonStyle={styles.button}
          onPress={() => handleChatPerson(navigation, userMarker.uid, user.uid)}
        />
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  customizableBottomSheetContentContainer: {
    flex: 1,
    alignItems: "center",
  },
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
