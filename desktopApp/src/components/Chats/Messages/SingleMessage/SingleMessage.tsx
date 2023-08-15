import { User } from 'types/user.type';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { getUserById } from 'utils/db';
import styles from './SingleMessage.module.scss';

interface ISingleMessageProps {
  message: string;
  senderId: string;
}

function SingleMessage({ message, senderId }: ISingleMessageProps) {
  const [sender, setSender] = useState<User | null>(null);
  // const ref = useRef();
  const { currentUser } = useAuthContext();
  useEffect(() => {
    const getMessageSender = async () => {
      const user = await getUserById(senderId);
      setSender(user);
    };

    // ref.current?.scrollIntoView({ behavior: 'smooth' }); // TODO: auto scroll?
    getMessageSender();
  }, [message, senderId]);

  return (
    // <div ref={ref} className={styles[`SingleMessage--${messageClass}`]}>

    senderId === currentUser?.uid ? ( // TODO:: REFACTOR THIS LATER!!!, on message send buffers the photourl
      <div className={styles.SingleMessage__sent}>
        <img src={sender?.photoUrl} alt="Profile" height={20} />
        <div className={styles.SingleMessage__sent__content}>{message}</div>
      </div>
    ) : (
      <div className={styles.SingleMessage}>
        <img src={sender?.photoUrl} alt="Profile" height={20} />
        <div className={styles.SingleMessage__content}>{message}</div>
      </div>
    )
  );
}

export default SingleMessage;
