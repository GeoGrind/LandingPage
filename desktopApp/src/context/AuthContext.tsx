import React, {
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
  updateProfile,
} from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from 'firebase';
import { User } from 'types/user.type';
import { getCurrentUser } from 'utils/db';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAppContext } from './AppContext';

interface IAuthContext {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => any;
  logout: () => void;
  updateCurrentUser: (data: any) => void;
  upload: (
    file: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  setCurrentUser: () => {},
  login: () => {},
  logout: () => {},
  updateCurrentUser: () => {},
  upload: () => {},
});

function AuthContextProvider({ children }: any) {
  const { setShowLogin } = useAppContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  const upload = useCallback(
    async (
      file: any,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!FIREBASE_AUTH.currentUser) {
        return;
      }
      const fileRef = ref(
        FIREBASE_STORAGE,
        `${FIREBASE_AUTH.currentUser.uid}.png`
      );
      setLoading(true);
      await uploadBytes(fileRef, file);
      const profilePicture = await getDownloadURL(fileRef);
      updateCurrentUser({ profilePicture }); // for firestore
      updateProfile(FIREBASE_AUTH.currentUser, { photoURL: profilePicture }); // for auth
      getCurrentUser(setCurrentUser); // updates the cur user, need to update logic
      setLoading(false);
    },
    [updateCurrentUser]
  );

  const returnValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      login,
      logout,
      updateCurrentUser,
      upload,
    }),
    [currentUser, setCurrentUser, login, logout, updateCurrentUser, upload]
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
