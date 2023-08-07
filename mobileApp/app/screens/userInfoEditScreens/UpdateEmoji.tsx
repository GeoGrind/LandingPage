import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Pressable } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { updateUserFields } from "../../utils/db";
import { Text } from "react-native";
import EmojiPicker from "rn-emoji-keyboard";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../../store/features/currentUserSlice";
import { useSelector } from "react-redux";

export default function UpdateEmoji() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleOpenPress = () => {
    setIsOpen(true);
  };
  const currentUser = useSelector(
    (state: any) => state.currentUser.currentUser
  );
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Pressable style={styles.emojiContainer} onPress={handleOpenPress}>
        <Text style={styles.emoji}>{currentUser?.emoji}</Text>
      </Pressable>

      <EmojiPicker
        onEmojiSelected={async (emoji) => {
          console.log(emoji);
          dispatch(updateCurrentUser({ emoji: emoji.emoji }));
          await updateUserFields({ emoji: emoji.emoji });
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
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
