import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ChatRoom } from "../types";
import { useSelector } from "react-redux";
type Props = {
  chatRooms: ChatRoom[];
  idToEmoji: { [key: string]: string };
  idToNames: { [key: string]: string };
  setSelectedChatOwner1Id: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedChatOwner2Id: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedChatRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  openBottomSheet: () => void;
};
const Stories: React.FC<Props> = ({
  chatRooms,
  idToEmoji,
  idToNames,
  setSelectedChatOwner1Id,
  setSelectedChatOwner2Id,
  setSelectedChatRoomId,
  openBottomSheet,
}) => {
  const currentUserRedux = useSelector(
    (state: any) => state.currentUser.currentUser
  );
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{ paddingVertical: 20 }}
    >
      {chatRooms.map((data, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedChatOwner1Id(data.ownerIds[0]);
              setSelectedChatOwner2Id(data.ownerIds[1]);
              setSelectedChatRoomId(data.id);
              openBottomSheet();
            }}
          >
            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: 8,
                position: "relative",
              }}
            >
              <View
                style={{
                  width: 68,
                  height: 68,
                  backgroundColor: "white",
                  borderWidth: 1.8,
                  borderRadius: 100,
                  borderColor: "#c13584",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data.ownerIds[0] != currentUserRedux?.uid && (
                  <Text
                    style={{
                      fontSize: 30,
                      color: "black",
                    }}
                  >
                    {idToEmoji[data?.ownerIds[0]]}
                  </Text>
                )}
                {data.ownerIds[1] != currentUserRedux?.uid && (
                  <Text
                    style={{
                      fontSize: 30,
                      color: "black",
                    }}
                  >
                    {idToEmoji[data?.ownerIds[1]]}
                  </Text>
                )}
              </View>

              {data.ownerIds[0] != currentUserRedux?.uid && (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    opacity: 1,
                  }}
                >
                  {idToNames[data?.ownerIds[0]]}
                </Text>
              )}
              {data.ownerIds[1] != currentUserRedux?.uid && (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    opacity: 1,
                  }}
                >
                  {idToNames[data?.ownerIds[1]]}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Stories;
