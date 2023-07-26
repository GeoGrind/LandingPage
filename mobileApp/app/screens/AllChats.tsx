import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { ChatRoom } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "react-native-elements";

const AllChats = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    const ref = collection(FIREBASE_DB, "chatRooms");
    const unsubscribe = onSnapshot(ref, (chatRooms: DocumentData) => {
      const chatRoomsData = chatRooms.docs
        .map((doc: any) => {
          const data = doc.data();
          const chatRoom: ChatRoom = {
            id: doc.id,
            ownerIds: data.ownerIds || [],
            ownerNames: data.ownerNames,
            lastChangeTime: data.lastChangeTime,
          };
          return chatRoom;
        })
        .filter((chatRoom: ChatRoom) => {
          return (
            chatRoom.ownerIds[0] === currentUser?.uid ||
            chatRoom.ownerIds[1] === currentUser?.uid
          );
        });

      setChatRooms(chatRoomsData);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          icon: "map",
          color: "#fff",
          onPress: () => {
            navigation.navigate("Map");
          },
        }}
        centerComponent={{ text: "Chats", style: { color: "#fff" } }}
      />
      <ScrollView>
        {chatRooms
          .sort((a, b) => b.lastChangeTime - a.lastChangeTime) // Sort in descending order
          .map((chatRoom: ChatRoom) => (
            <TouchableOpacity
              key={chatRoom.id}
              style={styles.groupCard}
              onPress={() => {
                navigation.navigate("SingleChat", { id: chatRoom.id });
              }}
            >
              {chatRoom.ownerIds[0] != currentUser?.uid && (
                <Text>{chatRoom.ownerNames[0]}</Text>
              )}
              {chatRoom.ownerIds[1] != currentUser?.uid && (
                <Text>{chatRoom.ownerNames[1]}</Text>
              )}
              <Text>{new Date(chatRoom.lastChangeTime).toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          navigation.navigate("Map");
        }}
      >
        <Ionicons name="exit-outline" size={24} color="red" />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    left: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  rightButton: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  groupCard: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 4,
  },
});

export default AllChats;
