import { View, StyleSheet } from "react-native";
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
const AllChats = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [idToEmoji, setIdToEmoji] = useState<{ [key: string]: string }>({});
  const [idToNames, setIdToNames] = useState<{ [key: string]: string }>({});

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
          const emoji = userData.emoji || "";
          const name = userData.name || "";
          return {
            emoji: { [userId]: emoji },
            name: { [userId]: name },
          };
        }
        return null;
      });

      const results = await Promise.all(promises);
      const updatedEmojis = results.reduce((acc, result) => {
        if (result) {
          return { ...acc, ...result.emoji };
        }
        return acc;
      }, {});
      const updatedNames = results.reduce((acc, result) => {
        if (result) {
          return { ...acc, ...result.name };
        }
        return acc;
      }, {});

      setIdToEmoji((prevEmojis) => ({ ...prevEmojis, ...updatedEmojis }));
      setIdToNames((prevNames) => ({
        ...prevNames,
        ...updatedNames,
      }));
      setChatRooms(chatRoomsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    fetchChatRoomsData();
  }, []);

  useEffect(() => {
    fetchChatRoomsData();
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
      <Stories
        chatRooms={chatRooms}
        idToEmoji={idToEmoji}
        idToNames={idToNames}
        setSelectedChatOwner1Id={setSelectedChatOwner1Id}
        setSelectedChatOwner2Id={setSelectedChatOwner2Id}
        setSelectedChatRoomId={setSelectedChatRoomId}
        openBottomSheet={openBottomSheet}
      />

      {selectedChatOwner1Id && selectedChatOwner2Id && selectedChatRoomId && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={["75%", "90%"]}
          onChange={handleSheetChanges}
        >
          <SingleChat
            chatRoomOwner1Id={selectedChatOwner1Id}
            chatRoomOwner2Id={selectedChatOwner2Id}
            id={selectedChatRoomId}
          />
        </BottomSheet>
      )}
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
