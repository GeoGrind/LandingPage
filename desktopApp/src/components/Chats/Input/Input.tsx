import { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from 'firebase';
import { v4 as uuid } from 'uuid';
import { Message } from 'types/message.type';
import { updateChatRoomLastChangeTime } from 'utils/db';
import { useAuthContext } from 'context/AuthContext';
import { useChatContext } from 'context/ChatContext';
import styles from './Input.module.scss';

function Input() {
  const { currentUser } = useAuthContext();
  const { currentChatId } = useChatContext();
  const [text, setText] = useState('');

  if (!currentChatId) return;

  const handleSend = async () => {
    if (text.length === 0) return;
    const msgCollectionRef = collection(
      FIREBASE_DB,
      `chatRooms/${currentChatId}/messages`
    );
    const messageId = uuid();
    const newMessage: Message = {
      author: { id: currentUser?.uid || '' },
      createdAt: Date.now(),
      id: messageId,
      text,
      type: 'text',
    };
    const messageRef = doc(msgCollectionRef!, messageId);
    await setDoc(messageRef, newMessage);
    await updateChatRoomLastChangeTime(currentChatId);
    setText('');
  };

  return (
    <div className={styles.Input}>
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button className={styles.Input__send} type="button" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

export default Input;
