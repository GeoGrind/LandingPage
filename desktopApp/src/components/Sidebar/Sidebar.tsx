import { User } from 'types/user.type';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './Sidebar.module.scss';
import logo from '../../../assets/956fd6.png';
import discoveryIcon from '../../../assets/discoveryIcon.svg';
import chatsIcon from '../../../assets/chatsIcon.svg';
import profileIcon from '../../../assets/profileIcon.svg';

interface ISidebarProps {
  curUser: User | undefined;
  activeUsers: Array<User>;
}

function Sidebar({ curUser, activeUsers }: ISidebarProps) {
  const [isSideBarExpanded, setIsSideBarExpanded] = useState<boolean>(true);

  if (!isSideBarExpanded) {
    return (
      <div className={styles.Sidebar__minimized}>
        <button
          type="button"
          onClick={() => {
            setIsSideBarExpanded(true);
          }}
        >
          SHOW THE SIDEBAR
        </button>
      </div>
    );
  }

  if (curUser === undefined) {
    return (
      <div className={styles.Sidebar}>
        <Link to="/" className={styles.Sidebar__logo}>
          <img src={logo} height={35} alt="Logo" />
          App Name
        </Link>
        <div className={styles.Sidebar__items}>Login or Signup for more!</div>
        <button
          type="button"
          className={styles.Sidebar__toggle}
          onClick={() => {
            setIsSideBarExpanded(false);
          }}
        >
          <ChevronLeftIcon className={styles.Sidebar__toggle__icon} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.Sidebar}>
      <Link to="/" className={styles.Sidebar__logo}>
        <img src={logo} height={35} alt="Logo" />
        App Name
      </Link>
      <div className={styles.Sidebar__items}>
        <div className={styles.Sidebar__items__item}>
          <img
            src={discoveryIcon}
            height={40}
            alt="Logo"
            className={styles.Sidebar__items__item__logo}
          />
          Discovery
        </div>

        <div className={styles.Sidebar__items__item}>
          <div className={styles.Sidebar__search}>
            <input
              className={styles.Sidebar__search__input}
              placeholder="Search"
            />
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
        </div>

        <Link to="/chats" className={styles.Sidebar__items__item}>
          <img
            src={chatsIcon}
            height={35}
            alt="Chats"
            className={styles.Sidebar__items__item__logo}
          />
          Chats
        </Link>
        <Link to="/account" className={styles.Sidebar__items__item}>
          <img
            src={profileIcon}
            height={35}
            alt="Profile"
            className={styles.Sidebar__items__item__logo}
          />
          Profile
        </Link>
      </div>

      <button
        type="button"
        className={styles.Sidebar__toggle}
        onClick={() => {
          setIsSideBarExpanded(false);
        }}
      >
        <ChevronLeftIcon className={styles.Sidebar__toggle__icon} />
      </button>
    </div>
  );
}

export default Sidebar;
