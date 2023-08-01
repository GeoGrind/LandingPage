import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { ChatRoom } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "react-native-elements";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { formatTime } from "../utils/util";

const AllChats = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [idToEmoji, setIdToEmoji] = useState<{ [key: string]: string }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchChatRoomsData = async () => {
    try {
      const ref = collection(FIREBASE_DB, "chatRooms");
      const snapshot = await getDocs(ref);
      const chatRoomsData = snapshot.docs
        .map((doc: any) => {
          const data = doc.data();
          const chatRoom: ChatRoom = {
            id: doc.id,
            ownerIds: data.ownerIds || [],

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

      const usefulIds = chatRoomsData.map((chatRoom: ChatRoom) => {
        if (currentUser?.uid === chatRoom.ownerIds[0]) {
          return chatRoom.ownerIds[1];
        }
        if (currentUser?.uid === chatRoom.ownerIds[1]) {
          return chatRoom.ownerIds[0];
        }
      });

      const promises = usefulIds.map(async (userId: any) => {
        const userRef = doc(FIREBASE_DB, "users", userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();

        if (userData && userData.emoji) {
          return { [userId]: userData.emoji };
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
      console.log(idToEmoji);
      setChatRooms(chatRoomsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Fetch data when naviagation happens
  useFocusEffect(
    React.useCallback(() => {
      fetchChatRoomsData();
      return () => {};
    }, [])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchChatRoomsData();
    setIsRefreshing(false);
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
                navigation.navigate("SingleChat", {
                  id: chatRoom.id,
                  chatRoomOwner1Id: chatRoom.ownerIds[0],
                  chatRoomOwner2Id: chatRoom.ownerIds[1],
                });
              }}
            >
              {chatRoom.ownerIds[0] != currentUser?.uid && (
                <Text>{idToEmoji[chatRoom.ownerIds[0]]}</Text>
              )}
              {chatRoom.ownerIds[1] != currentUser?.uid && (
                <Text>{idToEmoji[chatRoom.ownerIds[1]]}</Text>
              )}
              <Text>{formatTime(chatRoom.lastChangeTime)}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
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
