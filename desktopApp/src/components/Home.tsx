import { useEffect, useState } from 'react';
import { User } from 'types/user.type';
import { fetchActiveUsers } from 'utils/db';
import styles from './Home.module.scss';
import Map from './Map/Map';
import Sidebar from './Sidebar/Sidebar';
import Login from './Authentication/Form/Login/Login';
import SignUp from './Authentication/Form/SignUp/SignUp';
import Header from './Header';

function Home() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [showSignUp, setShowSignUp] = useState<boolean>(true);
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
        fetchData={fetchData}
      />
      {showLogin && <Login setShowLogin={setShowLogin} />}
      {showSignUp && <SignUp setShowSignUp={setShowSignUp} />}
      <Map activeUsers={activeUsers} />
      <Sidebar activeUsers={activeUsers} />
    </div>
  );
}

export default Home;
