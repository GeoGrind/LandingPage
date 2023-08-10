import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { User } from 'types/user.type';
import { Session } from 'types/session.type';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase';

export const fetchActiveUsers = async (): Promise<User[]> => {
  const docRef = collection(FIREBASE_DB, 'users');
  const snapshot = await getDocs(docRef);
  const users: Array<User> = [];
  snapshot.forEach((user) => {
    if (user.data().session !== null) {
      users.push(user.data() as User);
    }
  });
  return users;
};

export const createSession = async (session: Session) => {
  try {
    if (!FIREBASE_AUTH.currentUser) {
      return;
    }
    const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
    await updateDoc(userRef, { session });
    await updateDoc(userRef, { location: session.location });
  } catch (error) {
    console.log("Error updating user's session:", error);
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
    await updateDoc(userRef, { session: null });
  } catch (error) {
    console.log('Error in logout clean up:', error);
  }
};

export const getCurrentUser = async (setUser: any): Promise<void> => {
  try {
    if (!FIREBASE_AUTH.currentUser) {
      return;
    }
    const { uid } = FIREBASE_AUTH.currentUser;

    const usersCollection = collection(FIREBASE_DB, 'users');
    const querySnapshot = await getDocs(usersCollection);
    querySnapshot.forEach(async (docSnapshot) => {
      const user = docSnapshot.data() as User;
      if (user.uid === uid) {
        setUser(user);
      }
    });
  } catch (error) {
    console.log('Error getting user', error);
  }
};

// export const getUserObjectFromUserAuth = async (user: any): Promise<any> => {
//   try {
//     if (!user) {
//       return null;
//     }

//     const usersCollection = collection(FIREBASE_DB, 'users');
//     const querySnapshot = await getDocs(usersCollection);
//     querySnapshot.forEach(async (docSnapshot) => {
//       const userObject = docSnapshot.data() as User;
//       if (userObject.uid === user.uid) {
//         return user;
//       }
//     });
//     return null;
//   } catch (error) {
//     console.log('Error getting user', error);
//   }
// };

export async function updateChatRoomLastChangeTime(id: string): Promise<void> {
  const chatRoomRef = doc(collection(FIREBASE_DB, 'chatRooms'), id);
  try {
    await updateDoc(chatRoomRef, {
      lastChangeTime: Date.now(),
    });
    console.log(`Document with ID ${id} updated successfully.`);
  } catch (error) {
    console.error('Error updating document: ', error);
  }
}
