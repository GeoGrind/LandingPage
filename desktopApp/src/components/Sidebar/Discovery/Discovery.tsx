import { useAppContext } from 'context/AppContext';
import { createAndSetChatRoom } from 'utils/db';
import { useAuthContext } from 'context/AuthContext';
import { useChatContext } from 'context/ChatContext';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useState } from 'react';
import styles from './Discovery.module.scss';
import messageIcon from '../../../../assets/messageIcon.png';

function Discovery() {
  const { activeUsers } = useAppContext();
  const { setCurrentChatRoomId, likeSession } = useChatContext();
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');

  if (!currentUser) {
    return null;
  }

  const onMessageClick = (uid: string) => {
    createAndSetChatRoom(currentUser.uid, uid, setCurrentChatRoomId);
    navigate('/chats');
    return null;
  };

  const getFilteredUsersInSession = () => {
    return activeUsers.filter((user) => {
      return (
        user.session &&
        user.session.course // filter by course
          .toLowerCase() // non-case sensitive
          .replace(/\s/g, '') // non-whitespace sensitive
          .includes(filter.toLowerCase().replace(/\s/g, ''))
      );
    });
  };

  return (
    <div className={styles.Discovery}>
      <input
        className={styles.Discovery__input}
        type="search"
        placeholder="Search"
        value={filter}
        onChange={(e) => {
          return setFilter(e.target.value);
        }}
      />
      <div className={styles.Discovery__bottom}>
        {getFilteredUsersInSession().map(
          (user) =>
            user.session && (
              <div className={styles.Discovery__item} key={user.uid}>
                <div className={styles.Discovery__item__top}>
                  <img
                    src={user.profilePicture}
                    height={35}
                    width={35}
                    alt="Profile"
                  />
                  <div className={styles.Discovery__item__top__middle}>
                    {user.username}
                    <span id="course">{user.session.course}</span>
                  </div>
                </div>
                {user.session.description}

                <div className={styles.Discovery__buttons}>
                  <button
                    className={styles.Discovery__item__button}
                    type="button"
                    onClick={() => {
                      onMessageClick(user.uid);
                    }}
                  >
                    <img src={messageIcon} height={17} alt="message" />
                  </button>
                  <button
                    className={styles.Discovery__item__button}
                    type="button"
                    onClick={() => {
                      likeSession(currentUser, user);
                    }}
                  >
                    <ThumbUpIcon height={17} />
                  </button>
                </div>
                <div>numbers of likes: {user.session.numberOfLikers}</div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Discovery;
