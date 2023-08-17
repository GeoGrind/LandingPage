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
import SingleChatRoom from './SingleChatRoom/SingleChatRoom';
import ChatRoomSelector from './ChatRoomSelector/ChatRoomSelector';

function ChatRooms() {
  const { contentStyles } = useAppContext();
  const { currentUser } = useAuthContext();
  const { currentChatRoomId } = useChatContext();
  const [chatRooms, setChatRooms] = useState<Array<ChatRoom>>([]);

  useEffect(() => {
    if (!currentUser) return;
    const getChatRooms = () => {
      const chatRoomsRef = collection(FIREBASE_DB, `chatRooms`);
      const q = query(chatRoomsRef); // TODO: order by what?

      const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
        const newChatRooms: Array<ChatRoom> = firebaseDoc.docs
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
        setChatRooms(newChatRooms);
      });
      return () => {
        unsubscribe();
      };
    };
    getChatRooms();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className={styles.ChatRooms} style={contentStyles}>
      <div className={styles.ChatRooms__left}>
        <div className={styles.ChatRooms__left__top}>Messages</div>
        {Object.entries(chatRooms)
          ?.sort((a, b) => b[1].lastChangeTime - a[1].lastChangeTime)
          .map((chatRoom) => {
            return <ChatRoomSelector chatRoom={chatRoom[1]} />;
          })}
      </div>

      {currentChatRoomId ? (
        <SingleChatRoom />
      ) : (
        <div className={styles.ChatRooms__placeholder}>select a chat</div> // replace with empty chat or smth
      )}
    </div>
  );
}

export default ChatRooms;
