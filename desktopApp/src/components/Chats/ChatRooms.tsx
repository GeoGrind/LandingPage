import { useEffect, useState } from 'react';
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { FIREBASE_DB } from 'firebase';
import { ChatRoom } from 'types/chatroom.type';
import { useAuthContext } from 'context/AuthContext';
import { useChatContext } from 'context/ChatContext';
import { useAppContext } from 'context/AppContext';
import styles from './ChatRooms.module.scss';
import SingleChat from './SingleChatRoom/SingleChatRoom';
import ChatSelector from './ChatRoomSelector/ChatRoomSelector';

function Chats() {
  const { contentStyles } = useAppContext();
  const { currentUser } = useAuthContext();
  const { currentChatId } = useChatContext();
  const [chats, setChats] = useState<Array<ChatRoom>>([]);

  useEffect(() => {
    if (!currentUser) return;
    const getChats = () => {
      const chatRoomsRef = collection(FIREBASE_DB, `chatRooms`);
      const q = query(chatRoomsRef); // TODO: order by what?

      const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
        const newChats: Array<ChatRoom> = firebaseDoc.docs
          .map((doc: any) => {
            const data = doc.data();
            return {
              id: data.id,
              ownerIds: data.ownerIds,
              lastChangeTime: data.lastChangeTime,
            };
          })
          .filter((chatRoom: ChatRoom) => {
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
    <div className={styles.Chats} style={contentStyles}>
      <div className={styles.Chats__left}>
        <div className={styles.Chats__left__top}>Messages</div>
        {Object.entries(chats)
          ?.sort((a, b) => b[1].lastChangeTime - a[1].lastChangeTime)
          .map((chatRoom) => {
            return <ChatSelector chatRoom={chatRoom[1]} />;
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
