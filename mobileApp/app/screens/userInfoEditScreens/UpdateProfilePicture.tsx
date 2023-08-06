import React, { useState, useEffect } from "react";
import { Button, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { handleUpload } from "../../utils/db";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { User } from "../../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchProfilePictureFromFirestore } from "../../utils/db";

export default function UpdateProfilePicture() {
  const [image, setImage] = useState<string | null>(null);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    // Fetch the user's profile picture from Firestore here
    const fetchProfilePicture = async () => {
      // Replace 'fetchProfilePictureFromFirestore' with your own logic to retrieve the profile picture
      const profilePicture = await fetchProfilePictureFromFirestore();
      // Update the 'image' state with the fetched profile picture
      setImage(profilePicture);
    };
    fetchProfilePicture();
  }, []);

  const pickImageFromLibrary = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    handleUpload(image!);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{currentUser?.email}</Text>
      <Button title="Pick from library" onPress={pickImageFromLibrary} />
      <Button title="Take a picture" onPress={takePicture} />
      <Button title="Upload" onPress={uploadImage} />
      <Button title="Exit" onPress={() => navigation.navigate("Map")} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}
