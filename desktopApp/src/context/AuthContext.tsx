import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from 'firebase';
import { User } from 'types/user.type';
import { getCurrentUser } from 'utils/db';
import { useAppContext } from './AppContext';
import { collection, doc, updateDoc } from 'firebase/firestore';

interface IAuthContext {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => any;
  logout: () => void;
  updateCurrentUser: (data: any) => void;
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  setCurrentUser: () => {},
  login: () => {},
  logout: () => {},
  updateCurrentUser: () => {},
});

function AuthContextProvider({ children }: any) {
  const { setShowLogin } = useAppContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  console.log('IN AUTH CONTEXT, USER IS', currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        getCurrentUser(setCurrentUser); // TODO: rename/refactor this method later
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback((email: string, password: string) => {
    signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        setShowLogin(false);
        return 'asdf';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        return 'login error';
      });
  }, []);

  const logout = useCallback(() => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        // Sign-out successful.
        console.log('Signed out successfully');
        return null;
      })
      .catch((error) => {
        console.log('there is an error:', error);
        // An error happened.
      });
  }, []);

  const updateCurrentUser = useCallback(async (data: any) => {
    try {
      if (!FIREBASE_AUTH.currentUser) {
        return;
      }
      const userRef = doc(
        collection(FIREBASE_DB, 'users'),
        FIREBASE_AUTH.currentUser.uid
      );
      await updateDoc(userRef, data);
      getCurrentUser(setCurrentUser); // TODO: rename/refactor this method later
      console.log(`User updated successfully.`);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }, []);

  const returnValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      login,
      logout,
      updateCurrentUser,
    }),
    [currentUser, setCurrentUser, login, logout, updateCurrentUser]
  );

  return (
    <AuthContext.Provider value={returnValue}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('something went wrong!');
  }
  return context;
};

export default AuthContextProvider;
