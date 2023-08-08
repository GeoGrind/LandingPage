import React from 'react';
import { stopSessionOfCurrentUser } from 'utils/db';
import { User } from 'types/user.type';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from 'firebase';
import styles from './Header.module.scss';

interface IHeaderProps {
  curUser: User | undefined;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateSession: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: () => Promise<void>;
}
function Header({
  curUser,
  setShowLogin,
  setShowSignUp,
  setShowCreateSession,
  fetchData,
}: IHeaderProps) {
  const handleLogout = () => {
    // copied from account.tsx, refactor later
    signOut(FIREBASE_AUTH)
      .then(() => {
        // Sign-out successful.
        console.log('Signed out successfully');
        return null;
      })
      .catch((error) => {
        console.log('there is an error:', error);
        // An error happened.
      });
  };

  const authOptions = (
    <>
      <button
        className={styles.Header__container__inner__item}
        type="button"
        onClick={handleLogout}
      >
        <LogoutIcon />
        logout
      </button>
      <button
        className={styles.Header__container__inner__item}
        onClick={() => {
          alert('fetched data');
          fetchData();
        }}
        type="button"
      >
        <RefreshIcon />
        refresh
      </button>
      {curUser && (curUser as User).session ? (
        <button
          className={styles.Header__container__inner__item}
          type="button"
          onClick={stopSessionOfCurrentUser}
        >
          <RemoveIcon />
          Stop Session
        </button>
      ) : (
        <button
          className={styles.Header__container__inner__item}
          onClick={() => {
            setShowCreateSession(true);
          }}
          type="button"
        >
          <AddIcon />
          Create Session
        </button>
      )}
    </>
  );

  const unAuthOptions = (
    <button
      className={styles.Header__container__inner__item}
      onClick={() => {
        setShowLogin(true);
      }}
      type="button"
    >
      <LoginIcon />
      login / signup
    </button>
  );

  return (
    <header className={styles.Header}>
      <div className={styles.Header__container}>
        <div className={styles.Header__container__inner}>
          {curUser ? authOptions : unAuthOptions}
        </div>
      </div>
    </header>
  );
}

export default Header;
