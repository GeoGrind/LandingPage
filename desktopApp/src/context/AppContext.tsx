import React, { createContext, useContext, useMemo, useState } from 'react';
import { User } from 'types/user.type';

interface IAppContext {
  activeUsers: Array<User>;
  setActiveUsers: React.Dispatch<React.SetStateAction<Array<User>>>;
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  showSignUp: boolean;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateSession: boolean;
  setShowCreateSession: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<IAppContext>({
  activeUsers: [],
  setActiveUsers: () => {},
  showLogin: false,
  setShowLogin: () => {},
  showSignUp: false,
  setShowSignUp: () => {},
  showCreateSession: false,
  setShowCreateSession: () => {},
});

function AppContextProvider({ children }: any) {
  const [activeUsers, setActiveUsers] = useState<Array<User>>([]);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showCreateSession, setShowCreateSession] = useState<boolean>(false);

  const returnValue = useMemo(
    () => ({
      activeUsers,
      setActiveUsers,
      showLogin,
      setShowLogin,
      showSignUp,
      setShowSignUp,
      showCreateSession,
      setShowCreateSession,
    }),
    [
      activeUsers,
      setActiveUsers,
      showLogin,
      setShowLogin,
      showSignUp,
      setShowSignUp,
      showCreateSession,
      setShowCreateSession,
    ]
  );

  return (
    <AppContext.Provider value={returnValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('something went wrong!');
  }
  return context;
};

export default AppContextProvider;
