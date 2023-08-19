import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Pressable } from "react-native";
import { updateUserFields } from "../../utils/db";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../../store/features/currentUserSlice";
import { useSelector } from "react-redux";

import EmojiPicker from "rn-emoji-picker";
import { emojis } from "rn-emoji-picker/dist/data";
import { Emoji } from "rn-emoji-picker/dist/interfaces";

import { Modal, Portal, Text, PaperProvider } from "react-native-paper";

export default function UpdateEmoji() {
  const dispatch = useDispatch();
  const [recent, setRecent] = useState<Emoji[]>([]);

  const currentUser = useSelector(
    (state: any) => state.currentUser.currentUser
  );

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSelected = async (emoji: string) => {
    dispatch(updateCurrentUser({ emoji: emoji }));
    await updateUserFields({ emoji: emoji });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Pressable style={styles.emojiContainer} onPress={showModal}>
          <Text style={styles.emoji}>{currentUser?.emoji}</Text>
        </Pressable>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.pickerContainer}
          >
            <EmojiPicker
              emojis={emojis} // emojis data source see data/emojis
              recent={recent} // store of recently used emojis
              autoFocus={true} // autofocus search input
              loading={false} // spinner for if your emoji data or recent store is async
              darkMode={false} // to be or not to be, that is the question
              perLine={7} // # of emoji's per line
              onSelect={(selected) => {
                handleSelected(selected.emoji);
              }} // callback when user selects emoji - returns emoji obj
              onChangeRecent={setRecent} // callback to update recent storage - arr of emoji objs
            />
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
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
    position: "absolute",
    top: 40,
  },
  emoji: {
    fontSize: 50,
  },
  pickerContainer: {
    backgroundColor: "white",
    height: "60%",
    width: "90%",
    position: "absolute",
    top: "30%", // These values center the modal with 80% height
    left: "5%", // and 90% width
    right: "5%",
    bottom: "10%",
  },
});
