import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from 'firebase';
import { User } from 'types/user.type';
import { getCurrentUser } from 'utils/db';

interface IAuthContext {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  setCurrentUser: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }: any) {
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

  // const login = useCallback

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
      logout,
    }),
    [currentUser, setCurrentUser, logout]
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
