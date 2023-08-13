import { useEffect, useState } from 'react';
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

function Home() {
  const {
    setActiveUsers,
    showLogin,
    showSignUp,
    showCreateSession,
    contentStyles,
  } = useAppContext();

  const fetchData = async () => {
    const users = await fetchActiveUsers();
    setActiveUsers(users);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.Home} style={contentStyles}>
      <Header fetchData={fetchData} />
      {showLogin && <Login />}
      {showSignUp && <SignUp />}
      {showCreateSession && <CreateSession />}
      <Map />
    </div>
  );
}

export default Home;
