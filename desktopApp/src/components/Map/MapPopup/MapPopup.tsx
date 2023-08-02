import { User } from 'types/user.type';
import { Popup } from 'react-leaflet';
import styles from './MapPopup.module.scss';

interface IMapPopupProps {
  user: User;
}

function MapPopup({ user }: IMapPopupProps) {
  return (
    <Popup className={styles.MapPopup}>
      <div className={styles.MapPopup__container}>
        <div className={styles.MapPopup__top}>
          <div className={styles.MapPopup__top__status}>status</div>

          <div className={styles.MapPopup__top__username}>{user.username}</div>
          <div className={styles.MapPopup__top__course}>
            {user.onGoingSession?.course}
          </div>
        </div>
        <div className={styles.MapPopup__description}>
          desc: {user.onGoingSession?.description}
        </div>

        <div className={styles.MapPopup__buttons}>
          <button
            className={styles.MapPopup__button}
            type="button"
            onClick={() => alert('test')}
          >
            session info
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default MapPopup;
