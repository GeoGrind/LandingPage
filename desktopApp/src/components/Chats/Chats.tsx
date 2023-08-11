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
import { useChatContext } from 'context/ChatContext';

function Chats() {
  const { currentUser } = useAuthContext();
  const [chats, setChats] = useState<Array<Chat>>([]);

  const { currentChatId, setCurrentChatId } = useChatContext();

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

  if (!currentUser) return null;

  return (
    <div className={styles.Chats}>
      <div className={styles.Chats__left}>
        <div className={styles.Chats__left__top}>Messages</div>
        {Object.entries(chats)
          ?.sort((a, b) => b[1].lastChangeTime - a[1].lastChangeTime)
          .map((chat) => {
            return (
              <button
                type="button"
                className={styles.Chats__left__user}
                key={chat[1].id}
                onClick={() => {
                  setCurrentChatId(chat[1].id);
                }}
              >
                {chat[1].id}
              </button>
            );
          })}
      </div>

      {currentChatId ? (
        <SingleChat />
      ) : (
        <div className={styles.Chats__placeholder}>select a chat</div> // replace with empty chat or smth
      )}
    </div>
  );
}

export default Chats;
