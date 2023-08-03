import { useEffect, useState } from 'react';
import { User } from 'types/user.type';
import { fetchActiveUsers } from 'utils/db';
import styles from './Home.module.scss';
import Map from './Map/Map';
import Sidebar from './Sidebar/Sidebar';

function Home() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchActiveUsers();
      setActiveUsers(users);
    };
    fetchData();
    const timer = setInterval(fetchData, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles.Home}>
      <Map activeUsers={activeUsers} />
      <Sidebar activeUsers={activeUsers} />
    </div>
  );
}

export default Home;
