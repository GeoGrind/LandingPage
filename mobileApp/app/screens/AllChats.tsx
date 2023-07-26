import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { ChatRoom } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "react-native-elements";
import { doc, getDoc } from "firebase/firestore";

const AllChats = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [idToEmoji, setIdToEmoji] = useState<{ [key: string]: string }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    const ref = collection(FIREBASE_DB, "chatRooms");
    const unsubscribe = onSnapshot(ref, async (chatRooms: DocumentData) => {
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

      const usefulIds = chatRoomsData.map(
        (chatRoom: ChatRoom, index: number) => {
          if (currentUser?.uid === chatRoom.ownerIds[0]) {
            return chatRoom.ownerIds[1];
          }
          if (currentUser?.uid === chatRoom.ownerIds[1]) {
            return chatRoom.ownerIds[0];
          }
        }
      );

      const fetchEmojis = async () => {
        try {
          const promises = usefulIds.map(async (userId: any) => {
            const userRef = doc(FIREBASE_DB, "users", userId);
            const snapshot = await getDoc(userRef);
            const data = snapshot.data();

            if (data && data.emoji) {
              return { [userId]: data.emoji };
            }
            return null;
          });

          const results = await Promise.all(promises);
          const updatedEmojis = results.reduce((acc, result) => {
            if (result) {
              return { ...acc, ...result };
            }
            return acc;
          }, {});

          setIdToEmoji((prevEmojis) => ({ ...prevEmojis, ...updatedEmojis }));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      await fetchEmojis();

      setChatRooms(chatRoomsData);
    });
    return unsubscribe;
  }, []);
  const handleRefresh = () => {
    console.log("scrolled");
  };
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
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
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
                <Text>
                  {chatRoom.ownerNames[0] === null
                    ? idToEmoji[chatRoom.ownerIds[0]]
                    : chatRoom.ownerNames[0]}
                </Text>
              )}
              {chatRoom.ownerIds[1] != currentUser?.uid && (
                <Text>
                  {chatRoom.ownerNames[1] === null
                    ? idToEmoji[chatRoom.ownerIds[1]]
                    : chatRoom.ownerNames[1]}
                </Text>
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add padding at the bottom to accommodate the refresh spinner
  },
});

export default AllChats;
