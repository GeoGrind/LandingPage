import React from "react";
import { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Portal, Text, Button, PaperProvider } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { updateUserFields } from "../../utils/db";
import { updateCurrentUser } from "../../store/features/currentUserSlice";
const UpdateTermCourses = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: any) => state.currentUser.currentUser
  );

  const handleUpdate = async () => {
    if (value && !currentUser?.termCourses?.includes(value)) {
      const updatedTermCourses = [...currentUser.termCourses, value];
      dispatch(updateCurrentUser({ termCourses: updatedTermCourses }));
      await updateUserFields({
        termCourses: updatedTermCourses,
      });
    }
    hideModal();
  };
  const handleDelete = async (courseToDelete: string) => {
    const updatedTermCourses = currentUser?.termCourses?.filter(
      (course: string) => course !== courseToDelete
    );

    if (updatedTermCourses) {
      dispatch(updateCurrentUser({ termCourses: updatedTermCourses }));
      await updateUserFields({
        termCourses: updatedTermCourses,
      });
    }
  };

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

  // For the selector (inside the modal)
  const [openSelector, setOpenSelector] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(temp);
  // For the modal
  const [visibleModal, setVisibleModal] = React.useState(false);
  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Courses</Text>

        {currentUser?.termCourses?.map((course: string, index: number) => (
          <View key={index} style={styles.courseContainer}>
            <Text style={styles.courseText}>{course}</Text>
            <Button onPress={() => handleDelete(course)}>Delete</Button>
          </View>
        ))}

        <Button style={{ marginTop: 30 }} onPress={showModal}>
          Add a course
        </Button>

        <Portal>
          <Modal
            visible={visibleModal}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <DropDownPicker
              open={openSelector}
              value={value}
              items={items}
              setOpen={setOpenSelector}
              setValue={setValue}
              setItems={setItems}
            />
            <Button style={{ marginTop: 30 }} onPress={handleUpdate}>
              Update
            </Button>
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  courseContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
  },
  courseText: {
    fontSize: 18,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
  },
});

export default UpdateTermCourses;
