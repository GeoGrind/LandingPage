import { User } from 'types/user.type';
import { Popup } from 'react-leaflet';
import styles from './MapPopup.module.scss';

interface IMapPopupProps {
  user: User;
}

function MapPopup({ user }: IMapPopupProps) {
  return (
    <Popup className={styles.MapPopup}>
      <div className={styles.MapPopup__username}>{user.username}</div>
      <div className={styles.MapPopup__description}>
        {user.onGoingSession?.description}
      </div>
      <button
        className={styles.MapPopup__button}
        type="button"
        onClick={() => alert('test')}
      >
        session info
      </button>
    </Popup>
  );
}

export default MapPopup;
