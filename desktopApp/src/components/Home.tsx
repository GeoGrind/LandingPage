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
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showCreateSession, setShowCreateSession] = useState<boolean>(false);

  const { activeUsers, setActiveUsers } = useAppContext();

  const fetchData = async () => {
    const users = await fetchActiveUsers();
    setActiveUsers(users);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.Home}>
      <Header
        setShowLogin={setShowLogin}
        setShowSignUp={setShowSignUp}
        setShowCreateSession={setShowCreateSession}
        fetchData={fetchData}
      />
      {showLogin && (
        <Login setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
      )}
      {showSignUp && (
        <SignUp setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
      )}
      {showCreateSession && (
        <CreateSession setShowCreateSession={setShowCreateSession} />
      )}
      <Map />
    </div>
  );
}

export default Home;
