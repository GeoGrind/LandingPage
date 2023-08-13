import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { collection } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { ChatRoom } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "react-native-elements";
import { doc, getDoc, getDocs } from "firebase/firestore";
import Stories from "../components/Stories";
import SingleChat from "./SingleChat";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
const AllChats = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [idToNames, setIdToNames] = useState<{ [key: string]: string }>({});
  const [idToEmojis, setIdToEmojis] = useState<{ [key: string]: string }>({});
  const [idToProfilePictures, setIdToProfilePictures] = useState<{
    [key: string]: string;
  }>({});

  const [selectedChatOwner1Id, setSelectedChatOwner1Id] = useState<
    string | null
  >(null);
  const [selectedChatOwner2Id, setSelectedChatOwner2Id] = useState<
    string | null
  >(null);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(
    null
  );
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const test = ["1", "2", "3"];

  const fetchChatRoomsData = async (initFetch: boolean) => {
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
        .sort((a, b) => b.lastChangeTime - a.lastChangeTime)
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

        if (userData) {
          const name = userData.name || "";
          const profilePicture = userData.profilePicture || "";
          const emoji = userData.emoji || "";
          return {
            name: { [userId]: name },
            profilePicture: { [userId]: profilePicture },
            emoji: { [userId]: emoji },
          };
        }
        return null;
      });

      const results = await Promise.all(promises);
      //profilePicture
      const updatedProfilePictures = results.reduce((acc, result) => {
        if (result) {
          return { ...acc, ...result.profilePicture };
        }
        return acc;
      }, {});

      const updatedNames = results.reduce((acc, result) => {
        if (result) {
          return { ...acc, ...result.name };
        }
        return acc;
      }, {});
      const updatedEmojis = results.reduce((acc, result) => {
        if (result) {
          return { ...acc, ...result.emoji };
        }
        return acc;
      }, {});
      setIdToProfilePictures((prevProfilePictures) => ({
        ...prevProfilePictures,
        ...updatedProfilePictures,
      }));
      setIdToNames((prevNames) => ({
        ...prevNames,
        ...updatedNames,
      }));
      setIdToEmojis((prevEmojis) => ({
        ...prevEmojis,
        ...updatedEmojis,
      }));
      setChatRooms(chatRoomsData);
      if (chatRoomsData.length > 0 && initFetch == true) {
        setSelectedChatOwner1Id(chatRoomsData[0].ownerIds[0]);
        setSelectedChatOwner2Id(chatRoomsData[0].ownerIds[1]);
        setSelectedChatRoomId(chatRoomsData[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // callbacks

  useEffect(() => {
    fetchChatRoomsData(true);
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
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRoomContainer}
            onPress={() => {
              navigation.navigate("SingleChat", {
                id: item.id,
                chatRoomOwner1Id: item.ownerIds[0],
                chatRoomOwner2Id: item.ownerIds[1],
              });
            }}
          >
            <Image
              style={styles.profilePic}
              source={{
                uri:
                  item.ownerIds[0] == currentUser?.uid
                    ? idToProfilePictures[item.ownerIds[1]]
                    : idToProfilePictures[item.ownerIds[0]],
              }}
            />
            <View style={styles.chatDetails}>
              <Text style={styles.chatUserName}>
                {item.ownerIds[0] == currentUser?.uid
                  ? idToNames[item.ownerIds[1]]
                  : idToNames[item.ownerIds[0]]}
              </Text>
              {/* Add a placeholder last message for now */}
              <Text style={styles.lastMessage}>Last message...</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
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
  chatRoomContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  chatUserName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
});

export default AllChats;
