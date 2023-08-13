import { User } from 'types/user.type';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAuthContext } from 'context/AuthContext';
import { useAppContext } from 'context/AppContext';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './Sidebar.module.scss';
import logo from '../../../assets/956fd6.png';
import discoveryIcon from '../../../assets/discoveryIcon.svg';
import chatsIcon from '../../../assets/chatsIcon.svg';
import profileIcon from '../../../assets/profileIcon.svg';
import Discovery from './Discovery/Discovery';

function Sidebar() {
  const navigate = useNavigate();
  const {
    activeUsers,
    setShowLogin,
    showExpandedSidebar,
    setShowExpandedSidebar,
  } = useAppContext();
  const { currentUser, logout } = useAuthContext();
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState<boolean>(false);

  if (currentUser === null) {
    return (
      <div className={styles.Sidebar}>
        <Link to="/" className={styles.Sidebar__logo}>
          <img src={logo} height={35} alt="Logo" />
          App Name
        </Link>
        <div className={styles.Sidebar__top}>
          <button
            className={styles.Sidebar__item}
            onClick={() => {
              setShowLogin(true);
            }}
            type="button"
          >
            <LoginIcon />
            login / signup
          </button>
        </div>
      </div>
    );
  }

  if (!showExpandedSidebar) {
    return (
      <div className={styles.Sidebar__collapsed}>
        <Link to="/" className={styles.Sidebar__logo}>
          <img src={logo} height={35} alt="Logo" />
        </Link>
        <div className={styles.Sidebar__top}>
          <div className={styles.Sidebar__item}>
            <img
              src={discoveryIcon}
              height={33}
              alt="Discovery"
              className={styles.Sidebar__item__logo}
            />
          </div>

          <Link to="/chats" className={styles.Sidebar__item}>
            <img
              src={chatsIcon}
              height={30}
              alt="Chats"
              className={styles.Sidebar__item__logo}
            />
          </Link>
          <Link to="/account" className={styles.Sidebar__item}>
            <img
              src={profileIcon}
              height={30}
              alt="Profile"
              className={styles.Sidebar__item__logo}
            />
          </Link>
        </div>
        <div className={styles.Sidebar__bottom}>
          <button
            className={styles.Sidebar__item}
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogoutIcon className={styles.Sidebar__item__logo} />
          </button>
          <button
            type="button"
            className={styles.Sidebar__toggle}
            onClick={() => {
              setShowExpandedSidebar(true);
            }}
          >
            <ChevronRightIcon className={styles.Sidebar__toggle__icon} />
          </button>
        </div>
      </div>
    );
  }
  const discovery = (
    <div className={styles.Sidebar__discovery}>
      <input
        className={styles.Sidebar__discovery__input}
        placeholder="Search"
      />
      <div className={styles.Sidebar__discovery__activeUsersList}>
        {activeUsers.map(
          (user) =>
            user.session?.location && (
              <div className={styles.Sidebar__discovery__activeUsersList__item}>
                {user.username}, {user.session.course}
                <br />
                {user.session.description}
              </div>
            )
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.Sidebar}>
      <Link to="/" className={styles.Sidebar__logo}>
        <img src={logo} height={35} alt="Logo" />
        App Name
      </Link>
      <div className={styles.Sidebar__top}>
        <button
          type="button"
          className={styles.Sidebar__item}
          onClick={() => {
            setIsDiscoveryOpen(!isDiscoveryOpen);
          }}
        >
          <img
            src={discoveryIcon}
            height={33}
            alt="Discovery"
            className={styles.Sidebar__item__logo}
          />
          Discovery
          {isDiscoveryOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </button>
        {isDiscoveryOpen ? <Discovery /> : null}
        <Link to="/chats" className={styles.Sidebar__item}>
          <img
            src={chatsIcon}
            height={30}
            alt="Chats"
            className={styles.Sidebar__item__logo}
          />
          Chats
        </Link>
        <Link to="/account" className={styles.Sidebar__item}>
          <img
            src={profileIcon}
            height={30}
            alt="Profile"
            className={styles.Sidebar__item__logo}
          />
          Profile
        </Link>
      </div>

      <div className={styles.Sidebar__bottom}>
        <button
          className={styles.Sidebar__item}
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogoutIcon className={styles.Sidebar__item__logo} />
          logout
        </button>
        <button
          type="button"
          className={styles.Sidebar__toggle}
          onClick={() => {
            setShowExpandedSidebar(false);
          }}
        >
          <ChevronLeftIcon className={styles.Sidebar__toggle__icon} />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
