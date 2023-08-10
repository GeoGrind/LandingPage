import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from 'firebase';
import { User } from 'types/user.type';
import { getCurrentUser, getUserObjectFromUserAuth } from 'utils/db';

interface IAuthContext {
  currentUser: User | null;
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: null,
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

  const returnValue = useMemo(
    () => ({
      currentUser,
    }),
    [currentUser]
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
