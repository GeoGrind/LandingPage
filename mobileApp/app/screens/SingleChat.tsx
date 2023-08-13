import {
  View,
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
import { generateUUID } from "../utils/util";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Chat, MessageType } from "@flyerhq/react-native-chat-ui";

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

  useLayoutEffect(() => {
    const msgCollectionRef = collection(
      FIREBASE_DB,
      `chatRooms/${id}/messages`
    );
    const q = query(msgCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
      const messages: MessageType.Text[] = firebaseDoc.docs
        .map((doc: any) => {
          const data = doc.data();
          return {
            author: data.author,
            createdAt: data.createdAt,
            id: data.id,
            text: data.text,
            type: data.type,
          };
        })
        .reverse();

      setMessages(messages);
    });

    return unsubscribe;
  }, [id]);

  const sendMessage = async (newMessage: MessageType.Text) => {
    try {
      const msgCollectionRef = collection(
        FIREBASE_DB,
        `chatRooms/${id}/messages`
      );

      const messageRef = doc(msgCollectionRef!, newMessage.id);

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

  const [messages, setMessages] = useState<MessageType.Any[]>([]);

  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages]);
  };
  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: { id: currentUser!.uid },
      createdAt: Date.now(),
      id: generateUUID(),
      text: message.text,
      type: "text",
    };
    addMessage(textMessage);
    sendMessage(textMessage);
  };
  return (
    <SafeAreaProvider>
      <Chat
        messages={messages}
        onSendPress={handleSendPress}
        user={{ id: currentUser!.uid }}
      />
    </SafeAreaProvider>
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
