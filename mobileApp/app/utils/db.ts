import { FIREBASE_DB } from '../../FirebaseConfig';
import { doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { LocationObject, requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, updateDoc } from "firebase/firestore";
import { User, Location, Session } from "../types"



// export const getUserLocationAndStoreInDb = async () => {
//   try {
//     const auth = getAuth(); // Get the Firebase Authentication instance
//     const user = auth.currentUser; // Get the currently logged-in user
//     if (!user) {
//       console.log("No user is logged in");
//       return;
//     }
//     // Before trying to get the location, check if the user is in session
//     const { status } = await requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log("Please grant location permissions");
//       return;
//     }
//     const currentLocation: LocationObject = await getCurrentPositionAsync({});
//     const userRef = doc(FIREBASE_DB, 'users', user.uid);
//     await setDoc(userRef, { location: { longitude: currentLocation.coords.longitude, latitude: currentLocation.coords.latitude } }, { merge: true });
//   } catch (error) {
//     console.log("Error retrieving user location:", error);
//   }
// };
export const getUserLocationAndStoreInDb = async () => {
  try {
    const auth = getAuth(); // Get the Firebase Authentication instance
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      console.log("No user is logged in");
      return;
    }

    // Check if the user is in session
    const userRef = doc(FIREBASE_DB, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      console.log("User document does not exist");
      return;
    }
    const userData = userSnapshot.data();
    if (!userData || !userData.isInSession) {
      return;
    }

    // Before trying to get the location, check if the user has granted location permissions
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log("Please grant location permissions");
      return;
    }

    // Get the current location
    const currentLocation: LocationObject = await getCurrentPositionAsync({});
    const { longitude, latitude } = currentLocation.coords;

    // Update the user's location in the database
    await setDoc(userRef, { location: { longitude, latitude } }, { merge: true });

    console.log("User location stored in the database");
  } catch (error) {
    console.log("Error retrieving user location:", error);
  }
};
// Fetch the location of the users whose isINSession is true
export const fetchAllLocations = async (): Promise<Location[]> => {
  const docRef = collection(FIREBASE_DB, 'users');
  const snapshot = await getDocs(docRef);
  const locations: Location[] = [];
  snapshot.forEach((doc) => {
    const user = doc.data() as User;
    if (user.isInSession == true) {
      const { location } = user;
      if (location != null) {
        locations.push(location);
      }
    }
  });
  return locations;
};
// Negete the session status
export const changeCurrentUserInSessionStatus = async (): Promise<void> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userId = currentUser.uid;
    const usersCollection = collection(FIREBASE_DB, 'users');
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
      console.log('Error changing user in session status:', error);
    }
  } else {
    console.log('No signed-in user');
  }
};

export const updateSession = async (session: Session) => {
  try {
    const auth = getAuth(); // Get the Firebase Authentication instance
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      return;
    }
    const userRef = doc(FIREBASE_DB, 'users', user.uid);
    await updateDoc(userRef, { onGoingSession: session });
    await updateDoc(userRef, { isInSession: true });
  } catch (error) {
    console.log("Error updating user's onGoingSession:", error);
  }
};

export const logOutCleanUp = async () => {
  try {
    const auth = getAuth(); // Get the Firebase Authentication instance
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      return;
    }
    const userRef = doc(FIREBASE_DB, 'users', user.uid);
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
  const imageRef = ref(getStorage(), 'images');
  const uploadTask = uploadBytesResumable(imageRef, theBlob);
  const auth = getAuth(); // Get the Firebase Authentication instance
  const user = auth.currentUser; // Get the currently logged-in user
  if (!user) {
    console.log("No user is logged in");
    return;
  }
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // ...existing code for state change events
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      // Handle successful uploads on complete
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log('File available at', downloadURL);
        
        // Update the user's profilePicture field with the reference to the uploaded image
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            profilePicture: downloadURL,
          });
          console.log('Profile picture reference updated successfully');
        } else {
          console.log('User document does not exist');
        }
      });
    }
  );
}

export const fetchProfilePictureFromFirestore = async () => {
  const auth = getAuth(); // Get the Firebase Authentication instance
  const user = auth.currentUser;
  if (!user) {
    console.log('Failed to fetch profile picture');
    return null;
  }

  try {
    const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const profilePicture = userData.profilePicture;

      return profilePicture;
    } else {
      console.log('User document does not exist');
      return null;
    }
  } catch (error) {
    console.log('Error fetching profile picture:', error);
    return null;
  }
};