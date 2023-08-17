import { FIREBASE_DB } from "../../FirebaseConfig";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  collection,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { getAuth } from "firebase/auth";
import { User, Location, Session, ChatRoom } from "../types";
import "react-native-get-random-values";
import { generateUUID } from "./util";

export const getUserLocation = async (): Promise<Location | null> => {
  try {
    // Check if the user is logged in
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is logged in");
      return null;
    }

    // Check if the user is in session
    const userRef = doc(FIREBASE_DB, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      console.log("User document does not exist");
      return null;
    }
    const userData = userSnapshot.data();
    if (!userData) {
      return null;
    }

    // Check location permissions
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Please grant location permissions");
      return null;
    }

    // Get the current location
    const currentLocation: LocationObject = await getCurrentPositionAsync({});
    const { longitude, latitude } = currentLocation.coords;

    const location = {
      longitude,
      latitude,
    };

    return location;
  } catch (error) {
    console.log("Error retrieving user location:", error);
    return null;
  }
};

// Fetch the {Location, uid} pairs
export const fetchAllLocationUserPairs = async (): Promise<
  { location: Location; uid: string }[]
> => {
  const docRef = collection(FIREBASE_DB, "users");
  const snapshot = await getDocs(docRef);
  const locationUserPairs: { location: Location; uid: string }[] = [];
  snapshot.forEach((doc) => {
    const user = doc.data() as User;
    if (user.isInSession == true) {
      const { location, uid } = user;
      if (location != null && uid != null) {
        locationUserPairs.push({ location, uid });
      }
    }
  });
  return locationUserPairs;
};
// Fetch all users who are in session
export const fetchActiveUsers = async (): Promise<User[]> => {
  const docRef = collection(FIREBASE_DB, "users");
  const snapshot = await getDocs(docRef);
  const users: Array<User> = [];
  snapshot.forEach((user) => {
    if (user.data().isInSession === true) {
      users.push(user.data() as User);
    }
  });
  return users;
};

// A function that adds a new cheerer to a session being referred to
export const incrementNumberOfCheerers = async (uid: string): Promise<void> => {
  // uid -> owner of the marker being clicked
  // curUserId -> the person who clicked on the marker
  // Logic: in uid's session, we add curUserId
  const db = FIREBASE_DB;
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const curUserId = currentUser!.uid;

  try {
    // Get the user document
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error(`User with ID ${uid} does not exist.`);
    }

    const userData = userDocSnap.data();
    if (userData.onGoingSession.cheerers.includes(curUserId)) {
      return;
    }
    const newCheerers = [...userData.onGoingSession.cheerers, curUserId];

    const onGoingSession = userData?.onGoingSession || {};
    const currentNumberOfCheerers = onGoingSession.numberOfCheerers || 0;
    const updatedNumberOfCheerers = currentNumberOfCheerers + 1;

    // Update the user document with the incremented value
    await updateDoc(userDocRef, {
      "onGoingSession.numberOfCheerers": updatedNumberOfCheerers,
      "onGoingSession.cheerers": newCheerers,
    });

    console.log(`Successfully incremented numberOfCheerers for user ${uid}.`);
  } catch (error) {
    console.error(
      `Error incrementing numberOfCheerers for user ${uid}:`,
      error
    );
  }
};

export const createChatRoom = async (
  userId1: string,
  userId2: string
): Promise<string> => {
  try {
    const chatRoomCollectionRef = collection(FIREBASE_DB, "chatRooms");
    const documentId = generateUUID();
    const chatRoom: ChatRoom = {
      id: documentId,
      ownerIds: [userId1, userId2],
      lastChangeTime: Date.now(),
      lastMessage: null,
    };
    const chatRoomRef = doc(chatRoomCollectionRef!, documentId);
    await setDoc(chatRoomRef, chatRoom);
    return documentId;
  } catch (error) {
    console.log("error creating group", error);
    return "Error";
  }
};

export const getChatRoomFromUserId = async (
  uid1: string,
  uid2: string
): Promise<string | null> => {
  try {
    const chatRoomCollectionRef = collection(FIREBASE_DB, "chatRooms");
    const q = query(chatRoomCollectionRef);
    const querySnapshot = await getDocs(q);
    const matchingChatRooms = querySnapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.ownerIds.includes(uid1) && data.ownerIds.includes(uid2);
    });

    if (matchingChatRooms.length === 0) {
      return null; // ChatRoom not found, return null
    } else {
      return matchingChatRooms[0].id; // Return the chatRoom ID
    }
  } catch (error) {
    console.log("Error checking chatRoom:", error);
    return null;
  }
};

export const updateUserSetting = async (
  firstName: string,
  lastName: string,
  emoji: string,
  termCourses: string[]
): Promise<void> => {
  try {
    // Combine first name and last name into name
    const name = `${firstName} ${lastName}`;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(FIREBASE_DB, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: name,
        emoji: emoji,
        termCourses: termCourses,
      });
    }
  } catch (error) {
    console.error("Error updating user setting:", error);
    throw error;
  }
};

type ChatRoomFields = Partial<ChatRoom>;
export const updateChatRoomFieldById = async (
  id: string,
  fields: ChatRoomFields
): Promise<void> => {
  try {
    const chatRoomRef = doc(FIREBASE_DB, "chatRooms", id);
    const chatRoomSnapshot = await getDoc(chatRoomRef);
    if (chatRoomSnapshot.exists()) {
      await updateDoc(chatRoomRef, fields);
    } else {
      console.log("ChatRoom not found in Firestore.");
    }
  } catch (error) {
    console.error("Error updating ChatRoom fields:", error);
  }
};

export const getUserById = async (uid: string) => {
  try {
    const db = FIREBASE_DB;
    const userRef = doc(db, "users", uid);

    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const user: User = {
        uid: userData.uid,
        expoToken: userData.expoToken,
        email: userData.email,
        name: userData.name,
        emoji: userData.emoji,
        termCourses: userData.termCourses,
        location: userData.location,
        isInSession: userData.isInSession,
        onGoingSession: userData.onGoingSession,
        program: userData.program,
        yearOfGraduation: userData.yearOfGraduation,
        region: userData.region,
        gender: userData.gender,
        university: userData.university,
        profilePicture: userData.profilePicture,
      };
      return user;
    } else {
      console.log("User data not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

type UserFields = Partial<User>;
export const updateUserFields = async (fields: UserFields): Promise<void> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is logged in");
      return;
    }

    // Check if the user is in session
    const userRef = doc(FIREBASE_DB, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      // Update the fields for the user
      await updateDoc(userRef, fields);
    } else {
      console.log("User not found in Firestore.");
    }
  } catch (error) {
    console.error("Error updating user fields:", error);
  }
};

// Two functions below will be replaced
export async function handleUpload(uri: string) {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();
  const imageRef = ref(getStorage(), `images/${Date.now()}.jpeg`);
  const uploadTask = uploadBytesResumable(imageRef, theBlob);
  const auth = getAuth(); // Get the Firebase Authentication instance
  const user = auth.currentUser; // Get the currently logged-in user
  if (!user) {
    console.log("No user is logged in");
    return;
  }
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // ...existing code for state change events
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      // Handle successful uploads on complete
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);

        // Update the user's profilePicture field with the reference to the uploaded image
        const userDocRef = doc(FIREBASE_DB, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            profilePicture: downloadURL,
          });
          console.log("Profile picture reference updated successfully");
        } else {
          console.log("User document does not exist");
        }
      });
    }
  );
}
