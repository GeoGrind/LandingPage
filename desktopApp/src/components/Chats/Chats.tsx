import { Link } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { FIREBASE_DB } from 'firebase';
import { Chat } from 'types/chat.type';
import { useAuthContext } from 'context/AuthContext';
import styles from './Chats.module.scss';
import SingleChat from './SingleChat/SingleChat';

// interface IChatsProps {}
// function Chats({}: IChatsProps) {
function Chats() {
  const { currentUser } = useAuthContext();

  const [chats, setChats] = useState<Array<Chat>>([]);
  const [curChatRoomId, setCurChatRoomId] = useState<string>('');

  useEffect(() => {
    if (!currentUser) return;
    const getChats = () => {
      const chatRoomsRef = collection(FIREBASE_DB, `chatRooms`);
      const q = query(chatRoomsRef); // TODO: order by what?

      const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
        const newChats: Array<Chat> = firebaseDoc.docs
          .map((doc: any) => {
            const data = doc.data();
            return {
              id: data.id,
              ownerIds: data.ownerIds,
              lastChangeTime: data.lastChangeTime,
            };
          })
          .filter((chatRoom: Chat) => {
            return chatRoom.ownerIds.includes(currentUser.uid);
          });
        setChats(newChats);
      });
      return () => {
        unsubscribe();
      };
    };
    getChats();
  }, [currentUser]);

  return (
    <div className={styles.Chats}>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].lastChangeTime - a[1].lastChangeTime)
        .map((chat) => (
          <button
            type="button"
            className={styles.Chats__user}
            key={chat[1].id}
            onClick={() => {
              setCurChatRoomId(chat[1].id);
            }}
            // onClick={() => handleSelect(chat[1].userInfo)} // test
          >
            <div className="userChatInfo">
              {/* <span>{chat[1].ownerIds[0]}</span> */}
              <span>{currentUser.username}</span>
              {/* <p>{chat[1].lastMessage?.text}</p> */}
            </div>
          </button>
        ))}
      <SingleChat chatRoomId={curChatRoomId} />

      <Link className={styles.Header__container__inner__nav__item} to="/">
        Home
      </Link>
    </div>
  );
}

export default Chats;
