import { User } from 'types/user.type';
import { useEffect } from 'react';
import { useAuthContext } from 'context/AuthContext';
import logo from '../../../../../assets/956fd6.png';
import styles from './SingleMessage.module.scss';

interface ISingleMessageProps {
  message: string;
  senderId: string;
}

function SingleMessage({ message, senderId }: ISingleMessageProps) {
  // const ref = useRef();
  const { currentUser } = useAuthContext();
  useEffect(() => {
    // ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    // <div ref={ref} className={styles[`SingleMessage--${messageClass}`]}>

    senderId === currentUser?.uid ? ( // TODO:: REFACTOR THIS LATER!!!
      <div className={styles.SingleMessage__sent}>
        <img src={logo} alt="Profile" height={20} />
        <div className={styles.SingleMessage__sent__content}>{message}</div>
      </div>
    ) : (
      <div className={styles.SingleMessage}>
        <img src={logo} alt="Profile" height={20} />
        <div className={styles.SingleMessage__content}>{message}</div>
      </div>
    )
  );
}

export default SingleMessage;
