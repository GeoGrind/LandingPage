import { User } from 'types/user.type';
import styles from './Sidebar.module.scss';

interface ISidebarProps {
  activeUsers: Array<User>;
}

function Sidebar({ activeUsers }: ISidebarProps) {
  return (
    <div className={styles.Sidebar}>
      <div className={styles.Sidebar__search}>searchbar</div>
      <div className={styles.Sidebar__activeUsersList}>
        {activeUsers.map(
          (user) =>
            user.location && (
              <div className={styles.sidebar__activeUsersList__item}>
                {user.username}
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Sidebar;
