import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Button,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { updateUserFields } from "../../utils/db";
import { useDispatch } from "react-redux";
import { updateCurrentUser } from "../../store/features/currentUserSlice";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideRootStackParamList } from "../../types";

type Props = NativeStackScreenProps<InsideRootStackParamList, "UpdateBase">;

const UpdateBase = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const { field } = route.params;
  const currentUser = useSelector(
    (state: any) => state.currentUser.currentUser
  );

  const dynamicInitializeState = (field: string) => {
    switch (field) {
      case "username":
        return currentUser.username;
      case "email":
        return currentUser.email;
      case "program":
        return currentUser.program;
      case "yearOfGraduation":
        return currentUser.yearOfGraduation;
      case "university":
        return currentUser.university;
      default:
        return "";
    }
  };
  const [boxValue, setBoxValue] = useState<string>(() =>
    dynamicInitializeState(field)
  );

  const handleUpdate = async () => {
    const updatedField = { [field]: boxValue };
    await updateUserFields(updatedField);
    dispatch(updateCurrentUser(updatedField));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <TextInput
          style={styles.input}
          onChangeText={setBoxValue}
          value={boxValue}
          placeholder={`Enter your ${field}`}
          autoFocus={true}
        />
        <Button title={`Update ${field}`} onPress={handleUpdate} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100, // adjust this number to add more/less space at the top
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default UpdateBase;
