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
  const { currentChatRoomId } = useChatContext();
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const messagesRef = collection(
      FIREBASE_DB,
      `chatRooms/${currentChatRoomId}/messages`
    );
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (firebaseDoc: DocumentData) => {
      const newMessages: Message[] = firebaseDoc.docs.map((doc: any) => {
        const data = doc.data();
        return {
          author: data.author,
          createdAt: data.createdAt || 0,
          id: doc.id,
          text: data.text || '',
          type: data.type,
        };
      });
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [currentChatRoomId]);

  return (
    <div className={styles.Messages}>
      {messages.map((m) => (
        <SingleMessage key={m.id} text={m.text} author={m.author} />
      ))}
    </div>
  );
}

export default Messages;
