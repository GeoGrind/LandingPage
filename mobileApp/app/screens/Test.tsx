import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { ChatRoom } from "../types";
import { useSelector } from "react-redux";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type Props = {
  chatRooms: ChatRoom[];
  idToEmoji: { [key: string]: string };
  idToNames: { [key: string]: string };
};
const Stories: React.FC<Props> = ({ chatRooms, idToEmoji, idToNames }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  console.log(idToNames);
  const currentUserRedux = useSelector(
    (state: any) => state.currentUser.currentUser
  );
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{ paddingVertical: 20 }}
    >
      {chatRooms
        .sort((a, b) => b.lastChangeTime - a.lastChangeTime)
        .map((data, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate("SingleChat", {
                  id: data.id,
                  chatRoomOwner1Id: data.ownerIds[0],
                  chatRoomOwner2Id: data.ownerIds[1],
                });
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
