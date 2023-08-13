import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
const Test = () => {
  // State to store button click count
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  // Handle button click
  const handleButtonClick = () => {
    navigation.navigate("SingleChat", {
      id: "1d65bd57-3e00-4e41-9330-d2a56082be13",
      chatRoomOwner1Id: "ggPi3ozXwMUtwo2mHHDB2N8YnDk2",
      chatRoomOwner2Id: "UarK0Fzs2HeD0usxeihjVkAqfKl1",
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Click me" onPress={handleButtonClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Test;
