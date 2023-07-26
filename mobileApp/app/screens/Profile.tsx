import React, { useState, useRef } from "react";
import {
  Button,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Modal, { ReactNativeModal } from "react-native-modal";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { updateUserProfile } from "../utils/db";

export default function Profile() {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const modalViewRef = useRef<ReactNativeModal>(null);
  const handleTouchOutsideKeyboard = () => {
    Keyboard.dismiss();
  };
  // State variables for the form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emoji, setEmoji] = useState("");

  // Test
  const [selectedCourses, setSelectedCourses] = React.useState([]);
  const data = [
    { key: "1", value: "CS 240" },
    { key: "2", value: "CS 245" },
    { key: "3", value: "STAT 331" },
    { key: "4", value: "MATH 135" },
  ];

  // Function to handle form submission
  const handleFormSubmit = async () => {
    await updateUserProfile(firstName, lastName, emoji, selectedCourses);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutsideKeyboard}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Show modal" onPress={toggleModal} />
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={handleTouchOutsideKeyboard}
          ref={modalViewRef}
          backdropOpacity={1}
          backdropColor={"white"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text>Enter your details:</Text>
                <TextInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="black"
                  style={{ color: "black" }}
                />
                <TextInput
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="black"
                  style={{ color: "black" }}
                />
                <TextInput
                  placeholder="Emoji"
                  value={emoji}
                  onChangeText={setEmoji}
                  placeholderTextColor="black"
                  style={{ color: "black" }}
                />
                <MultipleSelectList
                  setSelected={(val: any) => setSelectedCourses(val)}
                  data={data}
                  save="value"
                  label="Categories"
                />
                <Button title="Submit" onPress={handleFormSubmit} />
                <Button title="Hide modal" onPress={toggleModal} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
