import React, { useContext } from 'react';
import { getCurrentUser, stopSessionOfCurrentUser } from 'utils/db';
import { User } from 'types/user.type';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from 'firebase';
import { useAuthContext } from 'context/AuthContext';
import styles from './Header.module.scss';
import { useAppContext } from 'context/AppContext';

interface IHeaderProps {
  fetchData: () => Promise<void>;
}
function Header({ fetchData }: IHeaderProps) {
  const { currentUser, setCurrentUser } = useAuthContext();
  const { setShowCreateSession } = useAppContext();

  const authOptions = (
    <>
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
      {currentUser && (currentUser as User).session ? (
        <button
          className={styles.Header__container__inner__item}
          type="button"
          onClick={() => {
            stopSessionOfCurrentUser();
            getCurrentUser(setCurrentUser); // TODO: rename/refactor this method later
          }}
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

  return (
    <header className={styles.Header}>
      <div className={styles.Header__container}>
        <div className={styles.Header__container__inner}>
          {currentUser && authOptions}
        </div>
      </div>
    </header>
  );
}

export default Header;
