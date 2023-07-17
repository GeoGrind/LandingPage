import { collection, getDocs } from 'firebase/firestore';
import { User } from 'types/user.type';
import { FIREBASE_DB } from '../firebase';

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

export const dontUse = 2; // prevents eslint error exporting one thing, will export more util later