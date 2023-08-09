import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FIREBASE_DB } from 'firebase';
import { Message } from 'types/message.type';
import { User } from 'types/user.type';
import SingleMessage from './SingleMessage/SingleMessage';
import styles from './Messages.module.scss';

interface IMessagesProps {
  curUser: User;
  chatRoomId: string;
}
function Messages({ curUser, chatRoomId }: IMessagesProps) {
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const messagesRef = collection(
      FIREBASE_DB,
      `chatRooms/${chatRoomId}/messages`
    );
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
      const newMessages: Message[] = firebaseDoc.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt || 0,
          message: data.message || '',
          senderId: data.senderId || '',
        };
      });
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [chatRoomId]);

  return (
    <div className={styles.Messages}>
      {messages.map((m) => (
        <SingleMessage
          key={m.id}
          curUser={curUser}
          message={m.message}
          senderId={m.senderId}
        />
      ))}
    </div>
  );
}

export default Messages;
