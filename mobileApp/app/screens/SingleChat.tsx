import { StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getUserById, updateChatRoomFieldById } from "../utils/db";
import { sendNotificationById } from "../utils/notifications";
import { generateUUID } from "../utils/util";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Chat, MessageType } from "@flyerhq/react-native-chat-ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideRootStackParamList, User } from "../types";
import { Avatar, Header } from "react-native-elements";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<InsideRootStackParamList, "SingleChat">;

const SingleChat = ({ route }: Props) => {
  const { id, chatRoomOwner1Id, chatRoomOwner2Id } = route.params;
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [otherName, setOtherName] = useState<string>();
  const [otherImg, setOtherImg] = useState<string>();
  const [otherId, setOtherId] = useState<string>();

  useEffect(() => {
    const getOtherName = async () => {
      const user1 = await getUserById(chatRoomOwner1Id);
      const user2 = await getUserById(chatRoomOwner2Id);

      if (currentUser?.uid === user1?.uid) {
        setOtherName(user2!.username);
        setOtherImg(user2?.profilePicture);
        setOtherId(user2?.uid);
      } else {
        setOtherName(user1!.username);
        setOtherImg(user1?.profilePicture);
        setOtherId(user1?.uid);
      }
    };

    getOtherName();
  });

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
      await updateChatRoomFieldById(id, {
        lastChangeTime: Date.now(),
        lastMessage: newMessage,
      });

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
      <Header
        leftComponent={{
          icon: "map",
          color: "#fff",
          onPress: () => {
            navigation.navigate("AllChats");
          },
        }}
        rightComponent={
          otherImg ? (
            <Avatar
              source={{
                uri: `${otherImg}`,
              }}
              onPress={() => {
                navigation.navigate("Profile", {
                  id: otherId,
                });
              }}
            />
          ) : (
            <Avatar
              source={{
                uri: `https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png`,
              }}
              onPress={() => {
                navigation.navigate("Profile", {
                  id: otherId,
                });
              }}
            />
          )
        }
        centerComponent={{ text: `${otherName}`, style: { color: "#fff" } }}
      />

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
