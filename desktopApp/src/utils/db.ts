import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { User } from 'types/user.type';
import { Session } from 'types/session.type';
import { Location } from 'types/location.type';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';

export const fetchActiveUsers = async (): Promise<User[]> => {
  const docRef = collection(FIREBASE_DB, 'users');
  const snapshot = await getDocs(docRef);
  const users: Array<User> = [];
  snapshot.forEach((user) => {
    if (user.data().isInSession === true) {
      users.push(user.data() as User);
    }
  });
  return users;
};

export const createSession = async (course: string, location: Location) => {
  try {
    if (!FIREBASE_AUTH.currentUser) {
      return;
    }
    const session: Session = {
      course,
      startTime: Date.now(),
      isVisible: true,
      sessionStartLocation: location,
      numberOfCheerers: 0,
      cheerers: [],
    };
    const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
    await updateDoc(userRef, { onGoingSession: session });
    await updateDoc(userRef, { isInSession: true });
    await updateDoc(userRef, { location });
  } catch (error) {
    console.log("Erorr updating user's session:", error);
  }
};

export const createUser = async (user: User) => {
  try {
    await setDoc(doc(FIREBASE_DB, 'users', user.uid), user);
  } catch (error) {
    console.log('Error creating user:', error);
  }
};

export const stopSessionOfCurrentUser = async () => {
  try {
    if (!FIREBASE_AUTH.currentUser) {
      return;
    }
    const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
    await updateDoc(userRef, { location: null });
    await updateDoc(userRef, { onGoingSession: null });
    await updateDoc(userRef, { isInSession: false });
  } catch (error) {
    console.log('Error in logout clean up:', error);
  }
};

// export const currentUserInSession = (user: any): Promise<boolean> => {
//   try {
//     if (!FIREBASE_AUTH.currentUser) {
//       return;
//     }
//     const userDocRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
//     const userDoc = await getDoc(userDocRef);

//     if (userDoc.exists()) {
//       return userDoc.data().isInSession;
//     }
//   } catch (error) {
//     console.log('error in getting user');
//   }
// };
