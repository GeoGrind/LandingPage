import { Link } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Chats.module.scss';
import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { FIREBASE_DB } from 'firebase';
import { User } from 'types/user.type';
import { Message } from 'types/message.type';
import Chat from './Chat/Chat';

interface IChatsProps {
  curUser: User;
}
function Chats({ curUser }: IChatsProps) {
  const [chats, setChats] = useState<Array<Chat>>([]);

  useEffect(() => {
    const getChats = () => {
      const chatRoomsRef = collection(FIREBASE_DB, `chatRooms`);
      const q = query(chatRoomsRef); // TODO: order by what?

      const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
        const newChats: Array<Chat> = firebaseDoc.docs.map((doc: any) => {
          const data = doc.data();
          return {
            id: data.id,
            ownerIds: data.ownerIds,
            lastChangeTime: data.lastChangeTime,
          };
        });
        setChats(newChats);
      });
      return () => {
        unsubscribe();
      };
    };
    getChats();
  }, [curUser.uid]);

  return (
    <div className={styles.Chats}>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].lastChangeTime - a[1].lastChangeTime)
        .map((chat) => (
          <button
            type="button"
            className={styles.Chats__user}
            key={chat[1].id}
            // onClick={() => handleSelect(chat[1].userInfo)} // test
          >
            <div className="userChatInfo">
              {/* <span>{chat[1].ownerIds[0]}</span> */}
              <span>{curUser.username}</span>
              {/* <p>{chat[1].lastMessage?.text}</p> */}
            </div>
          </button>
        ))}
      <Chat curUser={curUser} chatRoomId={'idk'} />

      <Link className={styles.Header__container__inner__nav__item} to="/">
        Home
      </Link>
    </div>
  );
}

export default Chats;
