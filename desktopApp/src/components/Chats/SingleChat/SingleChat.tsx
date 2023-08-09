import { User } from 'types/user.type';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import styles from './SingleChat.module.scss';

interface ISingleChatProps {
  curUser: User;
  chatRoomId: string;
}

function SingleChat({ curUser, chatRoomId }: ISingleChatProps) {
  return (
    <div className={styles.SingleChat}>
      <div className={styles.SingleChat__username}>
        <span>{curUser.username}</span>
      </div>
      <Messages curUser={curUser} chatRoomId={chatRoomId} />
      <Input curUser={curUser} chatRoomId={chatRoomId} />
    </div>
  );
}

export default SingleChat;
