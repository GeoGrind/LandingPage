import { useState } from 'react';
import { User } from 'types/user.type';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB } from 'firebase';
import { v4 as uuid } from 'uuid';
import { Message } from 'types/message.type';
import { updateChatRoomLastChangeTime } from 'utils/db';
import styles from './Input.module.scss';

interface IInputProps {
  curUser: User;
  chatRoomId: string;
}

function Input({ curUser, chatRoomId }: IInputProps) {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (text.length === 0) return;
    const msgCollectionRef = collection(
      FIREBASE_DB,
      `chatRooms/${chatRoomId}/messages`
    );
    const messageId = uuid();
    const newMessage: Message = {
      id: messageId,
      createdAt: Date.now(),
      message: text,
      senderId: curUser.uid,
    };
    const messageRef = doc(msgCollectionRef!, messageId);
    await setDoc(messageRef, newMessage);
    await updateChatRoomLastChangeTime(chatRoomId);
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
