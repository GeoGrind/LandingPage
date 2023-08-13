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
import { useChatContext } from 'context/ChatContext';
import SingleMessage from './SingleMessage/SingleMessage';
import styles from './Messages.module.scss';

function Messages() {
  const { currentChatId } = useChatContext();
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const messagesRef = collection(
      FIREBASE_DB,
      `chatRooms/${currentChatId}/messages`
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
  }, [currentChatId]);

  return (
    <div className={styles.Messages}>
      {messages.map((m) => (
        <SingleMessage key={m.id} message={m.message} senderId={m.senderId} />
      ))}
    </div>
  );
}

export default Messages;
