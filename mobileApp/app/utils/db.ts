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
import { v4 as uuidv4 } from "uuid";

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

export const getUserLocationAndStoreInDb =
  async (): Promise<Location | null> => {
    try {
      const location = await getUserLocation();
      if (!location) {
        return null;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.log("No user is logged in");
        return null;
      }

      const userRef = doc(FIREBASE_DB, "users", user.uid);

      const storeUserLocation = async (userRef: any, location: Location) => {
        try {
          await setDoc(userRef, { location }, { merge: true });
          console.log("User location stored in the database");
        } catch (error) {
          console.error("Error storing user location:", error);
        }
      };
      await storeUserLocation(userRef, location);
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

// Negete the session status
export const changeCurrentUserInSessionStatus = async (): Promise<void> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userId = currentUser.uid;
    const usersCollection = collection(FIREBASE_DB, "users");
    try {
      const querySnapshot = await getDocs(usersCollection);
      querySnapshot.forEach(async (docSnapshot) => {
        const user = docSnapshot.data() as User;
        if (user.uid === userId) {
          const docRef = doc(usersCollection, docSnapshot.id);
          await updateDoc(docRef, {
            isInSession: !user.isInSession,
          });
          return;
        }
      });
    } catch (error) {
      console.log("Error changing user in session status:", error);
    }
  } else {
    console.log("No signed-in user");
  }
};

// Assign a session to the currently signed in user
export const updateSession = async (session: Session) => {
  try {
    const auth = getAuth(); // Get the Firebase Authentication instance
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      return;
    }
    const userRef = doc(FIREBASE_DB, "users", user.uid);
    await updateDoc(userRef, { onGoingSession: session });
    await updateDoc(userRef, { isInSession: true });
  } catch (error) {
    console.log("Error updating user's onGoingSession:", error);
  }
};

// Stop the session
export const stopSessionOfCurrentUser = async () => {
  try {
    const auth = getAuth(); // Get the Firebase Authentication instance
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      return;
    }
    const userRef = doc(FIREBASE_DB, "users", user.uid);
    await updateDoc(userRef, { location: null });
    await updateDoc(userRef, { onGoingSession: null });
    await updateDoc(userRef, { isInSession: false });
  } catch (error) {
    console.log("Error in logout clean up:", error);
  }
};

export async function handleUpload(uri: string) {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();
  const imageRef = ref(getStorage(), "images");
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

export const fetchProfilePictureFromFirestore = async () => {
  const auth = getAuth(); // Get the Firebase Authentication instance
  const user = auth.currentUser;
  if (!user) {
    console.log("Failed to fetch profile picture");
    return null;
  }

  try {
    const userDocRef = doc(FIREBASE_DB, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const profilePicture = userData.profilePicture;

      return profilePicture;
    } else {
      console.log("User document does not exist");
      return null;
    }
  } catch (error) {
    console.log("Error fetching profile picture:", error);
    return null;
  }
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
    const db = FIREBASE_DB;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userName1 = await getUserNameFromDB(userId1);
    const userName2 = await getUserNameFromDB(userId2);
    const chatRoomCollectionRef = collection(FIREBASE_DB, "chatRooms");
    const documentId = uuidv4();
    const chatRoom: ChatRoom = {
      id: documentId,
      ownerIds: [userId1, userId2],
      ownerDisplayString: [userName1, userName2],
      lastChangeTime: Date.now(),
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

export const updateUserProfile = async (
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
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getUserNameFromDB = async (uid: string) => {
  try {
    const db = FIREBASE_DB;
    const userRef = doc(db, "users", uid);

    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const userName = userData.name;
      return userName;
    } else {
      console.log("User data not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export async function updateChatRoomLastChangeTime(id: string): Promise<void> {
  const chatRoomRef = doc(collection(FIREBASE_DB, "chatRooms"), id);
  try {
    await updateDoc(chatRoomRef, {
      lastChangeTime: Date.now(),
    });
    console.log(`Document with ID ${id} updated successfully.`);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
