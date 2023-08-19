import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useAuthContext } from 'context/AuthContext';
import styles from './Header.module.scss';

interface IHeaderProps {
  fetchData: () => Promise<void>;
}
function Header({ fetchData }: IHeaderProps) {
  const { currentUser } = useAuthContext();

  const authOptions = (
    <button
      className={styles.Header__container__inner__item}
      onClick={() => {
        // TODO: make animation or smth
        alert('fetched data');
        fetchData();
      }}
      type="button"
    >
      <RefreshIcon />
      refresh
    </button>
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
