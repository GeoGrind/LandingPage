import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import styles from './SingleChat.module.scss';

function SingleChat() {
  return (
    <div className={styles.SingleChat}>
      <div className={styles.SingleChat__username}>
        placeholder for other user?
      </div>
      <Messages />
      <Input />
    </div>
  );
}

export default SingleChat;
