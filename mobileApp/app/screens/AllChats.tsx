import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { Group } from "../types";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const AllChats = () => {
  const [groupsCollectionRef, setGroupsCollectionRef] = useState(null);
  const [groups, setGroups] = useState([]);
  const { currentUser } = FIREBASE_AUTH;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  useEffect(() => {
    const ref = collection(FIREBASE_DB, "groups");
    setGroupsCollectionRef(ref as any);

    const unsubscribe = onSnapshot(ref, (groups: DocumentData) => {
      console.log("Current groups in database: ", groups);
      const groupsData = groups.docs.map((doc: any) => {
        return { id: doc.id, ...doc.data() };
      });
      console.log("Current groups in database: ", groupsData);

      setGroups(groupsData);
    });

    return unsubscribe;
  }, []);

  const startGroup = async () => {
    try {
      await addDoc(groupsCollectionRef!, {
        name: `Group #${Math.floor(Math.random() * 1000)}`,
        description: "This is a chat group",
        creator: currentUser?.uid,
      });
    } catch (error) {
      console.log("error creating group", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {groups.map((group: Group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            onPress={() => {
              navigation.navigate("SingleChat", { id: group.id });
            }}
          >
            <Text>{group.name}</Text>
            <Text>{group.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          navigation.navigate("Map");
        }}
      >
        <Ionicons name="exit-outline" size={24} color="red" />
      </Pressable>

      <Pressable style={styles.rightButton} onPress={startGroup}>
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    left: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  rightButton: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  groupCard: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 4,
  },
});

export default AllChats;
