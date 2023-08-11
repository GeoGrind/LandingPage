import { createContext, useContext, useMemo, useState } from 'react';
import { User } from 'types/user.type';

interface IAppContext {
  activeUsers: Array<User>;
  setActiveUsers: React.Dispatch<React.SetStateAction<Array<User>>>;
}

export const AppContext = createContext<IAppContext>({
  activeUsers: [],
  setActiveUsers: () => {},
});

function AppContextProvider({ children }: any) {
  const [activeUsers, setActiveUsers] = useState<Array<User>>([]);

  const returnValue = useMemo(
    () => ({
      activeUsers,
      setActiveUsers,
    }),
    [activeUsers, setActiveUsers]
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
