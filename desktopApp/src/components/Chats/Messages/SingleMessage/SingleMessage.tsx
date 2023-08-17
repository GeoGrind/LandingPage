import { User } from 'types/user.type';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { getUserById } from 'utils/db';
import styles from './SingleMessage.module.scss';

interface ISingleMessageProps {
  text: string;
  author: any; // todo: maybe change type
}

function SingleMessage({ text, author }: ISingleMessageProps) {
  const [sender, setSender] = useState<User | null>(null);
  // const ref = useRef();
  const { currentUser } = useAuthContext();
  useEffect(() => {
    const getMessageSender = async () => {
      const user = await getUserById(author.id);
      setSender(user);
    };

    // ref.current?.scrollIntoView({ behavior: 'smooth' }); // TODO: auto scroll?
    getMessageSender();
  }, [text, author]);

  return (
    // <div ref={ref} className={styles[`SingleMessage--${messageClass}`]}>

    author.id === currentUser?.uid ? ( // TODO:: REFACTOR THIS LATER!!!, on message send buffers the photourl
      <div className={styles.SingleMessage__sent}>
        <img src={sender?.profilePicture} alt="Profile" height={20} />
        <div className={styles.SingleMessage__sent__content}>{text}</div>
      </div>
    ) : (
      <div className={styles.SingleMessage}>
        <img src={sender?.profilePicture} alt="Profile" height={20} />
        <div className={styles.SingleMessage__content}>{text}</div>
      </div>
    )
  );
}

export default SingleMessage;
