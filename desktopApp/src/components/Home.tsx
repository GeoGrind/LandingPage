import { useEffect, useState } from 'react';
import { User } from 'types/user.type';
import { fetchActiveUsers, getCurrentUser } from 'utils/db';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styles from './Home.module.scss';
import Map from './Map/Map';
import Sidebar from './Sidebar/Sidebar';
import Login from './Authentication/Form/Login/Login';
import SignUp from './Authentication/Form/SignUp/SignUp';
import Header from './Header/Header';

function Home() {
  const auth = getAuth();
  const [curUser, setCurUser] = useState(undefined);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [showLogin, setShowLogin] = useState<boolean>(!!curUser);
  const [showSignUp, setShowSignUp] = useState<boolean>(!!curUser);

  const fetchData = async () => {
    const users = await fetchActiveUsers();
    setActiveUsers(users);
  };
  useEffect(() => {
    fetchData();
    onAuthStateChanged(auth, (user) => {
      console.log('AUTH STATE CHANGED!!');
      if (user) {
        getCurrentUser(setCurUser);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // ...
      } else {
        setCurUser(undefined);
        // User is signed out
        // ...
      }
    });
  }, []);

  return (
    <div className={styles.Home}>
      <Header
        curUser={curUser}
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
