import {
  View,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { Message } from "../types";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { updateChatRoomLastChangeTime } from "../utils/db";
import { formatTime } from "../utils/util";
import { sendNotificationById } from "../utils/notifications";
import { Dimensions } from "react-native";

type Props = {
  id: string;
  chatRoomOwner1Id: string;
  chatRoomOwner2Id: string;
};
const SingleChat: React.FC<Props> = ({
  id,
  chatRoomOwner1Id,
  chatRoomOwner2Id,
}) => {
  const { currentUser } = FIREBASE_AUTH;
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>("");

  useLayoutEffect(() => {
    const msgCollectionRef = collection(
      FIREBASE_DB,
      `chatRooms/${id}/messages`
    );
    const q = query(msgCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
      const messages: Message[] = firebaseDoc.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt || 0,
          message: data.message || "",
          sender: data.sender || "",
          isHeader: data.isHeader,
        };
      });
      let previousMessageTime: Date | null = null;
      for (let i = 0; i < messages.length; i++) {
        const currentMessageTime = new Date(messages[i].createdAt);
        if (
          !previousMessageTime ||
          previousMessageTime.getMinutes() !== currentMessageTime.getMinutes()
        ) {
          messages[i].isHeader = true;
        }
        previousMessageTime = currentMessageTime;
      }
      setMessages(messages);
    });

    return unsubscribe;
  }, [id]);

  const sendMessage = async () => {
    try {
      const msg = message.trim();
      setMessage("");
      if (msg.length === 0) return;
      const msgCollectionRef = collection(
        FIREBASE_DB,
        `chatRooms/${id}/messages`
      );
      const documentId = uuidv4();
      const newMessage: Message = {
        id: documentId,
        message: msg,
        sender: currentUser!.uid,
        createdAt: Date.now(),
        isHeader: false,
      };
      const messageRef = doc(msgCollectionRef!, documentId);
      await setDoc(messageRef, newMessage);
      await updateChatRoomLastChangeTime(id);
      if (chatRoomOwner1Id === currentUser?.uid) {
        await sendNotificationById(chatRoomOwner2Id);
      } else {
        await sendNotificationById(chatRoomOwner1Id);
      }
    } catch (e) {
      console.log("messages failed to send", e);
    }
  };

  const renderMessage = ({ item }: { item: DocumentData }) => {
    const myMessage = item.sender === currentUser!.uid;

    return (
      <View style={styles.singleMessageWrapper}>
        {item.isHeader && (
          <Text style={styles.headerText}>{formatTime(item.createdAt)}</Text>
        )}
        <View
          style={[
            styles.messageContainer,
            myMessage
              ? styles.userMessageContainer
              : styles.otherMessageContainer,
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={[styles.time, myMessage ? {} : { color: "black" }]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };
  const flatListRef = useRef<FlatList>(null);
  const windowHeight = Dimensions.get("window").height;
  const keyboardVerticalOffset = Platform.OS === "ios" ? windowHeight * 0.1 : 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset + 20}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current!.scrollToEnd({ animated: true });
          }
        }}
        onLayout={() => {
          if (messages.length > 0) {
            flatListRef.current!.scrollToEnd({ animated: true });
          }
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message"
          style={styles.messageInput}
        />
        <Button disabled={message === ""} title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessageContainer: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    backgroundColor: "grey",
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "#777",
    alignSelf: "flex-end",
  },

  singleMessageWrapper: {
    marginBottom: 10,
  },

  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
    textAlign: "center", // Add this line
    width: "100%", // Ensure it takes full width
  },
});

export default SingleChat;
