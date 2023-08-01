import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Pressable } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { updateUserFields } from "../../utils/db";
import { Text, TextInput } from "react-native";
import { User } from "../../types";
import { getUserById } from "../../utils/db";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import EmojiModal from "react-native-emoji-modal";
export default function UpdateEmoji() {
  useEffect(() => {
    const fetchAndSetData = async () => {
      if (FIREBASE_AUTH.currentUser?.uid === undefined) {
        console.log("Error when fetching user in profile.tsx");
        return;
      }
      const currentUserFetched = await getUserById(
        FIREBASE_AUTH.currentUser?.uid
      );
      setEmoji(currentUserFetched?.emoji);
    };
    try {
      fetchAndSetData();
    } catch (e) {
      console.log("Test.tsx", e);
    }
  }, []);

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
  };
  const handleSubmit = async () => {
    updateUserFields({ emoji: emoji });
  };
  const [emoji, setEmoji] = useState<string>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Pressable style={styles.emojiContainer} onPress={handleOpenPress}>
        <Text style={styles.emoji}>{emoji}</Text>
      </Pressable>

      <Button title="Submit your changes" onPress={handleSubmit} />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", "90%"]}
        enablePanDownToClose={true}
      >
        <EmojiModal
          onEmojiSelected={(emoji) => {
            setEmoji(emoji!);
            bottomSheetRef.current?.collapse();
          }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // ensure the emoji stays within the circle
  },
  emoji: {
    fontSize: 50,
  },
});
