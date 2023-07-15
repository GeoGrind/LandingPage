// import { doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { collection, onSnapshot, updateDoc } from 'firebase/firestore';
// import { FIREBASE_DB } from '../firebase';
// import { User, Location, Session } from '../types';

// // export const getUserLocationAndStoreInDb = async () => {
// //   try {
// //     const auth = getAuth(); // Get the Firebase Authentication instance
// //     const user = auth.currentUser; // Get the currently logged-in user
// //     if (!user) {
// //       console.log("No user is logged in");
// //       return;
// //     }
// //     // Before trying to get the location, check if the user is in session
// //     const { status } = await requestForegroundPermissionsAsync();
// //     if (status !== 'granted') {
// //       console.log("Please grant location permissions");
// //       return;
// //     }
// //     const currentLocation: LocationObject = await getCurrentPositionAsync({});
// //     const userRef = doc(FIREBASE_DB, 'users', user.uid);
// //     await setDoc(userRef, { location: { longitude: currentLocation.coords.longitude, latitude: currentLocation.coords.latitude } }, { merge: true });
// //   } catch (error) {
// //     console.log("Error retrieving user location:", error);
// //   }
// // };
// export const getUserLocationAndStoreInDb = async () => {
//   try {
//     const auth = getAuth(); // Get the Firebase Authentication instance
//     const user = auth.currentUser; // Get the currently logged-in user
//     if (!user) {
//       console.log('No user is logged in');
//       return;
//     }

//     // Check if the user is in session
//     const userRef = doc(FIREBASE_DB, 'users', user.uid);
//     const userSnapshot = await getDoc(userRef);
//     if (!userSnapshot.exists()) {
//       console.log('User document does not exist');
//       return;
//     }
//     const userData = userSnapshot.data();
//     if (!userData || !userData.isInSession) {
//       return;
//     }

//     // Before trying to get the location, check if the user has granted location permissions
//     const { status } = await requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Please grant location permissions');
//       return;
//     }

//     // Get the current location
//     const currentLocation: LocationObject = await getCurrentPositionAsync({});
//     const { longitude, latitude } = currentLocation.coords;

//     // Update the user's location in the database
//     await setDoc(
//       userRef,
//       { location: { longitude, latitude } },
//       { merge: true }
//     );

//     console.log('User location stored in the database');
//   } catch (error) {
//     console.log('Error retrieving user location:', error);
//   }
// };
// // Fetch the location of the users whose isINSession is true
// export const fetchAllLocations = async (): Promise<Location[]> => {
//   const docRef = collection(FIREBASE_DB, 'users');
//   const snapshot = await getDocs(docRef);
//   const locations: Location[] = [];
//   snapshot.forEach((doc) => {
//     const user = doc.data() as User;
//     if (user.isInSession == true) {
//       const { location } = user;
//       if (location != null) {
//         locations.push(location);
//       }
//     }
//   });
//   return locations;
// };
// // Negete the session status
// export const changeCurrentUserInSessionStatus = async (): Promise<void> => {
//   const auth = getAuth();
//   const currentUser = auth.currentUser;
//   if (currentUser) {
//     const userId = currentUser.uid;
//     const usersCollection = collection(FIREBASE_DB, 'users');
//     try {
//       const querySnapshot = await getDocs(usersCollection);
//       querySnapshot.forEach(async (docSnapshot) => {
//         const user = docSnapshot.data() as User;
//         if (user.uid === userId) {
//           const docRef = doc(usersCollection, docSnapshot.id);
//           await updateDoc(docRef, {
//             isInSession: !user.isInSession,
//           });
//           return;
//         }
//       });
//     } catch (error) {
//       console.log('Error changing user in session status:', error);
//     }
//   } else {
//     console.log('No signed-in user');
//   }
// };

// export const updateSession = async (session: Session) => {
//   try {
//     const auth = getAuth(); // Get the Firebase Authentication instance
//     const user = auth.currentUser; // Get the currently logged-in user
//     if (!user) {
//       return;
//     }
//     const userRef = doc(FIREBASE_DB, 'users', user.uid);
//     await updateDoc(userRef, { onGoingSession: session });
//     await updateDoc(userRef, { isInSession: true });
//     console.log("Updated user's onGoingSession field with the new session");
//   } catch (error) {
//     console.log("Error updating user's onGoingSession:", error);
//   }
// };

// export const logOutCleanUp = async () => {
//   try {
//     const auth = getAuth(); // Get the Firebase Authentication instance
//     const user = auth.currentUser; // Get the currently logged-in user
//     if (!user) {
//       return;
//     }
//     const userRef = doc(FIREBASE_DB, 'users', user.uid);
//     await updateDoc(userRef, { location: null });
//     await updateDoc(userRef, { onGoingSession: null });
//     await updateDoc(userRef, { isInSession: false });
//   } catch (error) {
//     console.log('Error in logout clean up:', error);
//   }
// };
