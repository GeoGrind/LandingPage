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
import { FIREBASE_AUTH } from 'firebase';
import { User } from 'types/user.type';
import { getCurrentUser } from 'utils/db';
import { useAppContext } from './AppContext';

interface IAuthContext {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => any;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  setCurrentUser: () => {},
  login: () => {},
  logout: () => {},
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

  const returnValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      login,
      logout,
    }),
    [currentUser, setCurrentUser, login, logout]
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
