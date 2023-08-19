import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Portal,
  Button,
  TextInput as PaperTextInput,
  PaperProvider,
} from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import BottomSheet from "@gorhom/bottom-sheet";
import SegmentedPicker from "react-native-segmented-picker";

interface SessionModalProps {
  courseValue: string | null;
  timeValue: number | null;
  descriptionValue: string | null;
  setCourseValue: React.Dispatch<React.SetStateAction<string | null>>;
  setTimeValue: React.Dispatch<React.SetStateAction<number | null>>;
  setDescriptionValue: React.Dispatch<React.SetStateAction<string | null>>;
  handleFormSubmit: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  courseValue,
  timeValue,
  descriptionValue,
  setCourseValue,
  setTimeValue,
  setDescriptionValue,
  handleFormSubmit,
}) => {
  const [openSelector, setOpenSelector] = useState(false);
  const courseList = [
    "CS 240",
    "CS 241",
    "CS 341",
    "MATH 239",
    "CO 250",
    "STAT 230",
    "STAT 231",
  ];
  const temp = courseList.map((course) => ({ label: course, value: course }));
  const [items, setItems] = useState(temp);

  // Time selector:
  const segmentedPicker = useRef<SegmentedPicker | null>(null);

  // End of time selector
  const onConfirm = (selections: any) => {
    const hr = Number(selections["hour"]);
    const minute = Number(selections["minute"]);
    setTimeValue((60 * hr + minute) * 60000);
  };

  return (
    <View style={styles.formContainer}>
      <View style={{ zIndex: 100 }}>
        <DropDownPicker
          open={openSelector}
          value={courseValue}
          items={items}
          setOpen={setOpenSelector}
          setValue={setCourseValue}
          setItems={setItems}
        />
      </View>
      <Button
        onPress={() => {
          if (segmentedPicker.current) {
            segmentedPicker.current.show();
          }
        }}
      >
        Select session time
      </Button>
      <SegmentedPicker
        ref={segmentedPicker}
        onConfirm={onConfirm}
        options={[
          {
            key: "hour",
            items: [
              { label: "0 hour", value: "0" },
              { label: "1 hour", value: "1" },
              { label: "2 hours", value: "2" },
              { label: "3 hours", value: "3" },
              { label: "4 hours", value: "4" },
            ],
          },
          {
            key: "minute",
            items: [
              { label: "0 mins", value: "0" },
              { label: "1 mins", value: "1" },
              { label: "15 mins", value: "15" },
              { label: "30 mins", value: "30" },
              { label: "45 mins", value: "45" },
            ],
          },
        ]}
      />
      <PaperTextInput
        label="Description"
        style={styles.inputBox}
        onChangeText={(text) => {
          setDescriptionValue(text);
        }}
      />
      <Button
        mode="contained"
        onPress={handleFormSubmit}
        style={styles.submitButton}
      >
        Submit
      </Button>
    </View>
  );
};

export default SessionModal;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  inputBox: {
    width: "80%",
    marginTop: 10,
  },
});
