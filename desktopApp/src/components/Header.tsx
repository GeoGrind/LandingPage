import { Link } from 'react-router-dom';
import firebase, { FIREBASE_AUTH } from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { stopSessionOfCurrentUser } from 'utils/db';
import styles from './Header.module.scss';
import icon from '../../assets/956fd6.png';

function Header() {
  const auth = getAuth();

  const [isLoggedin, setIsLoggedIn] = useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      // ...
    } else {
      setIsLoggedIn(false);
      // User is signed out
      // ...
    }
  });
  return (
    <header className={styles.Header}>
      <div className={styles.Header__container}>
        <div className={styles.Header__container__inner}>
          <div className={styles.Header__container__inner__logo}>
            <Link to="/home">
              <img
                className={styles.Header__logo}
                src={icon}
                height={40}
                alt="Logo"
              />
            </Link>
          </div>
          <div className={styles.Header__container__inner__nav}>
            <Link
              className={styles.Header__container__inner__nav__item}
              to="/home"
            >
              Home
            </Link>
            {/* {currentUserInSession ? ( */}
            <div className={styles.Header__container__inner__nav}>
              <button
                className={styles.Header__container__inner__nav__item}
                type="button"
                onClick={stopSessionOfCurrentUser}
              >
                Stop Session
              </button>
            </div>
            {/* ) : ( */}
            <div className={styles.Header__container__inner__nav}>
              <Link
                className={styles.Header__container__inner__nav__item}
                to="/createsession"
              >
                Create Session
              </Link>
            </div>
            {/* )} */}
          </div>

          <div className={styles.Header__container__inner__utility}>
            {isLoggedin ? (
              <Link
                className={styles.Header__container__inner__utility__item}
                to="/account"
              >
                Account
              </Link>
            ) : (
              <Link
                className={styles.Header__container__inner__utility__item}
                to="/login"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
