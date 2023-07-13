import { FIREBASE_DB } from '../../FirebaseConfig';
import { doc, setDoc, getDocs } from 'firebase/firestore';
import { LocationObject, requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot } from "firebase/firestore";
import { User, Location } from "../types"

export const getUserLocationAndStoreInDb = async () => {
  try {
    const auth = getAuth(); // Get the Firebase Authentication instance
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      console.log("No user is logged in");
      return;
    }
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log("Please grant location permissions");
      return;
    }
    const currentLocation: LocationObject = await getCurrentPositionAsync({});
    const userRef = doc(FIREBASE_DB, 'users', user.uid);
    await setDoc(userRef, { location: { longitude: currentLocation.coords.longitude, latitude: currentLocation.coords.latitude } }, { merge: true });
    console.log("Location updated successfully");
  } catch (error) {
    console.log("Error retrieving user location:", error);
  }
};

export const getAllLocations = async (): Promise<Location[]> => {
  const docRef = collection(FIREBASE_DB, 'users');
  const snapshot = await getDocs(docRef);
  
  const locations: Location[] = [];

  snapshot.forEach((doc) => {
    const user = doc.data() as User;
    const { location } = user;
    locations.push(location);
  });
  console.log(locations)
  return locations;
};