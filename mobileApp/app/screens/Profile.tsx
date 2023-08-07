import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideRootStackParamList } from "../types";
import { getUserById } from "../utils/db";
import { useFocusEffect } from "@react-navigation/native";
import { User } from "../types";
import { useState } from "react";
type Props = NativeStackScreenProps<InsideRootStackParamList, "Profile">;

const Profile = ({ route }: Props) => {
  const { id } = route.params;
  const [targetUser, setTargetUser] = useState<User | null>(null);

  const fetchUserDataAndSet = async () => {
    const user = await getUserById(id);
    setTargetUser(user);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserDataAndSet();
      return () => {};
    }, [])
  );
  return (
    <View>
      <Text>{targetUser?.email}</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
