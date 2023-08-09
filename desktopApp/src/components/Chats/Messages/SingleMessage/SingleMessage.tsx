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
  const messageClass = senderId === curUser.uid ? 'sent' : 'received';

  return (
    // <div ref={ref} className={styles[`SingleMessage--${messageClass}`]}>
    <div className={styles[`SingleMessage--${messageClass}`]}>
      <img src={logo} alt="Profile" height={20}/>

      <div className={styles[`SingleMessage--${messageClass}__content`]}>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default SingleMessage;
