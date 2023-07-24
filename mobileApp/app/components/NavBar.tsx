import React from "react";
import { View, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type Props = {
  onRefreshClick: () => void;
  onStartSessionClick: () => void;
  onStopSessionClick: () => void;
  onSignOffClick: () => void;
  onTestClick: () => void;
  onListViewClick: () => void;
  onChatClick: () => void;
};

const Navbar: React.FC<Props> = ({
  onRefreshClick,
  onStartSessionClick,
  onStopSessionClick,
  onSignOffClick,
  onTestClick,
  onListViewClick,
  onChatClick,
}) => {
  return (
    <View style={styles.container}>
      <FontAwesome5
        name="sync"
        size={30}
        color="black"
        onPress={onRefreshClick}
      />
      <FontAwesome5
        name="play"
        size={30}
        color="black"
        onPress={onStartSessionClick}
      />
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
      {/* <FontAwesome5
        name="list"
        size={30}
        color="black"
        onPress={onListViewClick}
      /> */}
      <FontAwesome5
        name="comments"
        size={30}
        color="black"
        onPress={onChatClick}
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
