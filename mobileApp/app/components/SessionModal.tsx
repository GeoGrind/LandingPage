import { StyleSheet, View, Text } from "react-native";
import React, { useRef, useState } from "react";
import { Button, TextInput as PaperTextInput } from "react-native-paper";
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
  setCourseValue,
  setTimeValue,
  setDescriptionValue,
  handleFormSubmit,
}) => {
  // Time selector:
  const segmentedPickerTime = useRef<SegmentedPicker | null>(null);
  const segmentedPickerCourse = useRef<SegmentedPicker | null>(null);

  // End of time selector
  const onConfirmTime = (selections: any) => {
    const hr = Number(selections["hour"]);
    const minute = Number(selections["minute"]);
    setTimeValue((60 * hr + minute) * 60000);

    const timeString = `${hr > 0 ? hr + " hour" + (hr > 1 ? "s" : "") : ""}${
      minute > 0 ? " " + minute + " mins" : ""
    }`.trim();
    setSelectedTime(timeString);
  };
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Course selector:
  const onConfirmCourse = (selections: any) => {
    const course = selections["course"];
    setSelectedCourse(course);
    setCourseValue(course);
  };
  const [seletedCourse, setSelectedCourse] = useState<string>("");

  return (
    <View style={styles.formContainer}>
      <Text style={styles.heading}>Create a new session</Text>
      <Text style={styles.subheading}>Start your study journey</Text>
      <PaperTextInput
        value={seletedCourse || "Choose the course"}
        mode="outlined"
        style={styles.clickableInputBox}
        onTouchEnd={() => {
          if (segmentedPickerCourse.current) {
            segmentedPickerCourse.current.show();
          }
        }}
        editable={false} // this ensures the user can't manually type into it
      />

      <SegmentedPicker
        ref={segmentedPickerCourse}
        onConfirm={onConfirmCourse}
        options={[
          {
            key: "course",
            items: [
              { label: "CS 135", value: "CS 135" },
              { label: "CS 240", value: "CS 240" },
            ],
          },
        ]}
      />

      <PaperTextInput
        value={selectedTime || "Select session time"}
        mode="outlined"
        style={styles.clickableInputBox}
        onTouchEnd={() => {
          if (segmentedPickerTime.current) {
            segmentedPickerTime.current.show();
          }
        }}
        editable={false}
      />
      <SegmentedPicker
        ref={segmentedPickerTime}
        onConfirm={onConfirmTime}
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
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
  },
  submitButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  inputBox: {
    width: "80%",
    marginTop: 10,
    borderRadius: 10,
  },
  clickableInputBox: {
    width: "80%",
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
});
