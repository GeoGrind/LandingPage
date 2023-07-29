import { User } from 'types/user.type';
import { Popup } from 'react-leaflet';
import styles from './MapPopup.module.scss';

interface IMapPopupProps {
  user: User;
}

function MapPopup({ user }: IMapPopupProps) {
  return (
    <Popup>
      <div className={styles.MapPopup}>
        <div className={styles.MapPopup__username}>{user.email}</div>
        <button
          // className={styles.MapPopup}
          type="button"
          onClick={() => alert('test')}
        >
          test 123
        </button>
      </div>
    </Popup>
  );
}

export default MapPopup;
