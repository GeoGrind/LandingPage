import { User } from 'types/user.type';
import { Popup } from 'react-leaflet';
import styles from './MapPopup.module.scss';
import icon from '../../../../assets/956fd6.png';
import messageIcon from '../../../../assets/messageIcon.png';

interface IMapPopupProps {
  user: User;
}

function MapPopup({ user }: IMapPopupProps) {
  if (!user.session) {
    return null;
  }
  const profilePicture = user.session.isPrivate ? (
    <img src={icon} height={35} alt="Profile" /> // replace with some default pfp
  ) : (
    <div>
      INSERT PROFILE PICTURE HERE SOMEHOW, add button to go to profile in
      future? (look up fire storage later)
    </div>
  );

  return (
    <Popup className={styles.MapPopup}>
      <div className={styles.MapPopup__container}>
        <div className={styles.MapPopup__container__top}>
          <div className={styles.MapPopup__container__top__left}>
            <div className={styles.MapPopup__container__top__left__profile}>
              {profilePicture}
            </div>
            <div className={styles.MapPopup__container__top__left__course}>
              {user.session.course}
            </div>
          </div>
          <div className={styles.MapPopup__container__top__right}>
            <div className={styles.MapPopup__container__top__right__username}>
              {user.username}
            </div>
            <div
              className={styles.MapPopup__container__top__right__description}
            >
              {user.session.description}
            </div>
          </div>
        </div>
        <div className={styles.MapPopup__container__bottom}>
          <button
            className={styles.MapPopup__container__bottom__button}
            type="button"
            onClick={() => alert('you hit message')}
          >
            <img src={messageIcon} height={17} alt="message" />
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default MapPopup;
