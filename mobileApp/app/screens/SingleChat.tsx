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
import { useSearchParams } from "expo-router";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { User } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

type RootStackParamList = {
  Map: {};
  Profile: {};
  Test: {};
  ListView: {};
  AllChats: {};
  SingleChat: { id: string };
};
type Props = NativeStackScreenProps<RootStackParamList, "SingleChat">;

const SingleChat = ({ route, navigation }: Props) => {
  const { id } = route.params;
  console.log(id);
  const { currentUser } = FIREBASE_AUTH;

  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>("");

  useLayoutEffect(() => {
    const msgCollectionRef = collection(FIREBASE_DB, `groups/${id}/messages`);
    const q = query(msgCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (groups: DocumentData) => {
      const messages = groups.docs.map((doc: any) => {
        return { id: doc.id, ...doc.data() };
      });
      setMessages(messages);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    const msg = message.trim();
    if (msg.length === 0) return;

    const msgCollectionRef = collection(FIREBASE_DB, `groups/${id}/messages`);

    await addDoc(msgCollectionRef, {
      message: msg,
      sender: currentUser!.uid,
      createdAt: Date.now(),
    });

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
        <Text style={styles.time}>{item.createdAt}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
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
        <Button
          title="Go to AllChats"
          onPress={() => navigation.navigate("AllChats", {})}
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
