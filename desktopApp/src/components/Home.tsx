import { useCallback, useEffect, useState } from 'react';
import { User } from 'types/user.type';
import { fetchActiveUsers } from 'utils/db';
import { useAuthContext } from 'context/AuthContext';
import styles from './Home.module.scss';
import Map from './Map/Map';
import Sidebar from './Sidebar/Sidebar';
import Login from './Authentication/Form/Login/Login';
import SignUp from './Authentication/Form/SignUp/SignUp';
import Header from './Header/Header';
import CreateSession from './CreateSession/CreateSession';
import { useAppContext } from 'context/AppContext';
import MapButtons from './Map/MapButtons/MapButtons';

function Home() {
  const {
    setActiveUsers,
    showLogin,
    showSignUp,
    showCreateSession,
    contentStyles,
  } = useAppContext();

  const fetchData = useCallback(async () => {
    const users = await fetchActiveUsers();
    setActiveUsers(users);
  }, [setActiveUsers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={styles.Home} style={contentStyles}>
      <Header fetchData={fetchData} />
      {showLogin && <Login />}
      {showSignUp && <SignUp />}
      {showCreateSession && <CreateSession />}

      <MapButtons />
      <Map />
    </div>
  );
}

export default Home;
