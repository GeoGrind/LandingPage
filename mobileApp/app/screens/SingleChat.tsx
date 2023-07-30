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
import React, { useLayoutEffect, useState } from "react";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Message } from "../types";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { updateChatRoomLastChangeTime } from "../utils/db";
import { formatTime } from "../utils/util";
import { ScrollView } from "react-native";
import { getMessaging, getToken } from "firebase/messaging";
import { InsideRootStackParamList } from "../types";
import { sendNotificationById } from "../utils/notifications";
type Props = NativeStackScreenProps<InsideRootStackParamList, "SingleChat">;

const SingleChat = ({ route, navigation }: Props) => {
  const { id, chatRoomOwner1Id, chatRoomOwner2Id } = route.params;
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
        };
      });
      setMessages(messages);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    const msg = message.trim();
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
    };
    const messageRef = doc(msgCollectionRef!, documentId);
    await setDoc(messageRef, newMessage);
    await updateChatRoomLastChangeTime(id);

    if (chatRoomOwner1Id === currentUser?.uid) {
      await sendNotificationById(chatRoomOwner2Id);
    } else {
      await sendNotificationById(chatRoomOwner1Id);
    }

    setMessage("");
  };

  const renderMessage = ({ item }: { item: DocumentData }) => {
    const myMessage = item.sender === currentUser!.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          myMessage
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
      >
        {messages.map((item) => (
          <View key={item.id}>{renderMessage({ item })}</View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message"
          style={styles.messageInput}
        />
        <Button disabled={message === ""} title="Send" onPress={sendMessage} />
        <Button
          title="Go to the Map"
          onPress={() => navigation.navigate("Map", {})}
        />
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
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "#777",
    alignSelf: "flex-end",
  },
});

export default SingleChat;
