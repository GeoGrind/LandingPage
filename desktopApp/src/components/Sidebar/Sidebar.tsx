import { User } from 'types/user.type';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAuthContext } from 'context/AuthContext';
import { useAppContext } from 'context/AppContext';
import styles from './Sidebar.module.scss';
import logo from '../../../assets/956fd6.png';
import discoveryIcon from '../../../assets/discoveryIcon.svg';
import chatsIcon from '../../../assets/chatsIcon.svg';
import profileIcon from '../../../assets/profileIcon.svg';

function Sidebar() {
  const { activeUsers, setActiveUsers } = useAppContext();

  const [isSideBarExpanded, setIsSideBarExpanded] = useState<boolean>(true);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState<boolean>(false);

  const { currentUser } = useAuthContext();
  if (!isSideBarExpanded) {
    return (
      <div className={styles.Sidebar__collapsed}>
        <Link to="/" className={styles.Sidebar__logo}>
          <img src={logo} height={35} alt="Logo" />
        </Link>
        <div className={styles.Sidebar__items__collapsed}>
          <div className={styles.Sidebar__items__item}>
            <img
              src={discoveryIcon}
              height={33}
              alt="Discovery"
              className={styles.Sidebar__items__item__logo}
            />
          </div>

          <Link to="/chats" className={styles.Sidebar__items__item}>
            <img
              src={chatsIcon}
              height={30}
              alt="Chats"
              className={styles.Sidebar__items__item__logo}
            />
          </Link>
          <Link to="/account" className={styles.Sidebar__items__item}>
            <img
              src={profileIcon}
              height={30}
              alt="Profile"
              className={styles.Sidebar__items__item__logo}
            />
          </Link>
        </div>

        <button
          type="button"
          className={styles.Sidebar__toggle__collapsed}
          onClick={() => {
            setIsSideBarExpanded(true);
          }}
        >
          <ChevronRightIcon className={styles.Sidebar__toggle__icon} />
        </button>
      </div>
    );
  }

  if (currentUser === null) {
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
        <button
          type="button"
          className={styles.Sidebar__items__item}
          onClick={() => {
            setIsDiscoveryOpen(!isDiscoveryOpen);
          }}
        >
          <img
            src={discoveryIcon}
            height={33}
            alt="Discovery"
            className={styles.Sidebar__items__item__logo}
          />
          Discovery
          {isDiscoveryOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </button>
        {isDiscoveryOpen ? (
          <div className={styles.Sidebar__discovery}>
            <input
              className={styles.Sidebar__discovery__input}
              placeholder="Search"
            />
            <div className={styles.Sidebar__discovery__activeUsersList}>
              {activeUsers.map(
                (user) =>
                  user.session?.location && (
                    <div
                      className={
                        styles.Sidebar__discovery__activeUsersList__item
                      }
                    >
                      {user.username}, {user.session.course}
                      <br />
                      {user.session.description}
                    </div>
                  )
              )}
            </div>
          </div>
        ) : null}
        <Link to="/chats" className={styles.Sidebar__items__item}>
          <img
            src={chatsIcon}
            height={30}
            alt="Chats"
            className={styles.Sidebar__items__item__logo}
          />
          Chats
        </Link>
        <Link to="/account" className={styles.Sidebar__items__item}>
          <img
            src={profileIcon}
            height={30}
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
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              alert(
                `position is: ${position.coords.latitude}, ${position.coords.longitude}`
              );
            });
          } else {
            alert('unable to get position');
          }
        }}
      >
        get current location
      </button>

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
