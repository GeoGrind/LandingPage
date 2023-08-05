import { User } from 'types/user.type';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

interface ISidebarProps {
  activeUsers: Array<User>;
}

function Sidebar({ activeUsers }: ISidebarProps) {
  const [isSideBarExtended, setIsSideBarExtended] = useState<boolean>(true);

  if (!isSideBarExtended) {
    return (
      <div className={styles.Sidebar__minimized}>
        <button
          type="button"
          onClick={() => {
            setIsSideBarExtended(true);
          }}
        >
          SHOW THE SIDEBAR
        </button>
      </div>
    );
  }

  return (
    <div className={styles.Sidebar}>
      <button
        type="button"
        onClick={() => {
          setIsSideBarExtended(false);
        }}
      >
        CLOSE THE SIDEBAR
      </button>
      <div className={styles.Sidebar__search}>searchbar</div>
      <div className={styles.Sidebar__activeUsersList}>
        {activeUsers.map(
          (user) =>
            user.session?.location && (
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
