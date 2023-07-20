import {
  collection,
  doc,
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
export const dontUse = 2; // prevents eslint error exporting one thing, will export more util later
