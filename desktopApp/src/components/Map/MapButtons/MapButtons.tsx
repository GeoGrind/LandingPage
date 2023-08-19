import { User } from 'types/user.type';
import { useAuthContext } from 'context/AuthContext';
import { getCurrentUser, stopSessionOfCurrentUser } from 'utils/db';
import { useAppContext } from 'context/AppContext';
import styles from './MapButtons.module.scss';
import stopSessionIcon from '../../../../assets/stopSessionIcon.svg';
import startSessionIcon from '../../../../assets/startSessionIcon.svg';

function MapButtons() {
  const { currentUser, setCurrentUser } = useAuthContext();
  const { setShowCreateSession } = useAppContext();

  return (
    <div className={styles.MapButtons}>
      {currentUser && (currentUser as User).session ? (
        <button
          className={styles.MapButtons__button}
          type="button"
          onClick={() => {
            stopSessionOfCurrentUser();
            getCurrentUser(setCurrentUser); // TODO: rename/refactor this method later
          }}
        >
          <img src={stopSessionIcon} height={120} alt="Start Session" />
        </button>
      ) : (
        <button
          className={styles.MapButtons__button}
          onClick={() => {
            setShowCreateSession(true);
          }}
          type="button"
        >
          <img src={startSessionIcon} height={120} alt="Start Session" />
        </button>
      )}
    </div>
  );
}

export default MapButtons;
