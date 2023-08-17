import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getUserById, handleUpload } from "../../utils/db";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "react-native-paper";
import { Avatar } from "react-native-elements";
import { User } from "../../types";
export default function UpdateProfilePicture() {
  const [image, setImage] = useState<string | null>(null);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const user: User | null = await getUserById(currentUser!.uid);
      if (user?.profilePicture) {
        setImage(user.profilePicture);
      }
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
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
    navigation.navigate("Setting");
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {image && (
        <View style={{ marginBottom: 20 }}>
          <Avatar
            size={150}
            rounded
            source={{
              uri: image,
            }}
          />
        </View>
      )}

      <Button
        icon="image-album"
        mode="contained"
        onPress={pickImageFromLibrary}
        style={{ marginVertical: 10, width: 200 }} // Set fixed width here
      >
        Choose from library
      </Button>

      <Button
        icon="camera"
        mode="contained"
        onPress={takePicture}
        style={{ marginVertical: 10, width: 200 }} // And here
      >
        Take a picture
      </Button>

      <Button
        icon="upload"
        mode="contained"
        onPress={uploadImage}
        style={{ marginVertical: 10, width: 200 }} // And here
      >
        Upload your picture
      </Button>
    </View>
  );
}
