import { StyleSheet, Text, View } from "react-native";
import React from "react";
type Props = {
  id: string | null;
};
const Test: React.FC<Props> = ({ id }) => {
  return (
    <View>
      <Text>{id}</Text>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
