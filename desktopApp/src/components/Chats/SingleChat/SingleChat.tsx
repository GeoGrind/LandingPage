import { User } from 'types/user.type';
import { useAuthContext } from 'context/AuthContext';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import styles from './SingleChat.module.scss';

interface ISingleChatProps {
  chatRoomId: string;
}

function SingleChat({ chatRoomId }: ISingleChatProps) {
  const { currentUser } = useAuthContext();
  return (
    <div className={styles.SingleChat}>
      <div className={styles.SingleChat__username}>
        <span>{currentUser?.username}</span>
      </div>
      <Messages chatRoomId={chatRoomId} />
      <Input chatRoomId={chatRoomId} />
    </div>
  );
}

export default SingleChat;
