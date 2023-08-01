import React from "react";
import { View, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type Props = {
  onStopSessionClick: () => void;
  onSignOffClick: () => void;
  onTestClick: () => void;
  onListViewClick: () => void;
  onChatClick: () => void;
  onProfileClick: () => void;
};

const Navbar: React.FC<Props> = ({
  onStopSessionClick,
  onSignOffClick,
  onTestClick,
  onListViewClick,
  onChatClick,
  onProfileClick,
}) => {
  return (
    <View style={styles.container}>
      <FontAwesome5
        name="stop"
        size={30}
        color="black"
        onPress={onStopSessionClick}
      />
      <FontAwesome5
        name="sign-out-alt"
        size={30}
        color="black"
        onPress={onSignOffClick}
      />
      <FontAwesome5 name="cog" size={30} color="black" onPress={onTestClick} />

      <FontAwesome5
        name="comments"
        size={30}
        color="black"
        onPress={onChatClick}
      />

      <FontAwesome5
        name="user"
        size={30}
        color="black"
        onPress={onProfileClick}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
  },
  buttonContainer: {
    marginVertical: 5,
  },
});

export default Navbar;
