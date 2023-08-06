import { StyleSheet, View } from "react-native";
import React from "react";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "react-native-elements";

const Test = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          navigation.navigate("UpdateProfilePicture", {});
        }}
        title="Press me"
      />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take full available space
    justifyContent: "center", // Align children in the center along the main axis (vertically)
    alignItems: "center", // Align children in the center along the cross axis (horizontally)
  },
});
