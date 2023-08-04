import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { getCurrentUser, stopSessionOfCurrentUser } from 'utils/db';
import { User } from 'types/user.type';
import styles from './Header.module.scss';
import icon from '../../assets/956fd6.png';

interface IHeaderProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: () => Promise<void>;
}
function Header({ setShowLogin, setShowSignUp, fetchData }: IHeaderProps) {
  const auth = getAuth();

  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [curUser, setCurUser] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('AUTH STATE CHANGED!!');
      if (user) {
        setIsLoggedIn(true);
        getCurrentUser(setCurUser);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // ...
      } else {
        setIsLoggedIn(false);
        // User is signed out
        // ...
      }
    });
  });

  const authOptions =
    curUser && (curUser as User).session ? (
      <div className={styles.Header__container__inner__nav}>
        <button
          className={styles.Header__container__inner__nav__item}
          type="button"
          onClick={stopSessionOfCurrentUser}
        >
          Stop Session
        </button>
      </div>
    ) : (
      <div className={styles.Header__container__inner__nav}>
        <Link
          className={styles.Header__container__inner__nav__item}
          to="/createsession"
        >
          Create Session
        </Link>
      </div>
    );

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
            {curUser && authOptions}
          </div>

          <div className={styles.Header__container__inner__utility}>
            <button
              className={styles.Header__container__inner__utility__item}
              onClick={() => {
                alert('fetched data');
                fetchData();
              }}
              type="button"
            >
              FETCH DATA
            </button>
            {isLoggedin ? (
              <Link
                className={styles.Header__container__inner__utility__item}
                to="/account"
              >
                Account
              </Link>
            ) : (
              <>
                <button
                  className={styles.Header__container__inner__utility__item}
                  onClick={() => {
                    setShowLogin(true);
                  }}
                  type="button"
                >
                  login
                </button>

                <button
                  className={styles.Header__container__inner__utility__item}
                  onClick={() => {
                    setShowSignUp(true);
                  }}
                  type="button"
                >
                  signup
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
