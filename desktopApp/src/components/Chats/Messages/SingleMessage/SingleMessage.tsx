import { User } from 'types/user.type';
import { useEffect } from 'react';
import logo from '../../../../../assets/956fd6.png';
import styles from './SingleMessage.module.scss';

interface ISingleMessageProps {
  curUser: User;
  message: string;
  senderId: string;
}

function SingleMessage({ curUser, message, senderId }: ISingleMessageProps) {
  // const ref = useRef();

  useEffect(() => {
    // ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  return (
    // <div ref={ref} className={styles[`SingleMessage--${messageClass}`]}>

    senderId === curUser.uid ? ( // TODO:: REFACTOR THIS LATER!!!
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
