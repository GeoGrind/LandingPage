import { useAuthContext } from 'context/AuthContext';
import { getChatRoomById, getUserById } from 'utils/db';
import { useChatContext } from 'context/ChatContext';
import { useEffect, useState } from 'react';
import { User } from 'types/user.type';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import styles from './SingleChatRoom.module.scss';

function SingleChatRoom() {
  const { currentUser } = useAuthContext();
  const { currentChatId } = useChatContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const getSelectedUser = async () => {
      const chat = await getChatRoomById(currentChatId as string);
      if (chat === null || currentUser === null) {
        return;
      }

      if (chat.ownerIds[0] === currentUser.uid) {
        setSelectedUser(await getUserById(chat.ownerIds[1]));
      } else {
        setSelectedUser(await getUserById(chat.ownerIds[0]));
      }
    };

    getSelectedUser();
  }, [currentChatId, currentUser]);

  if (!selectedUser) {
    return null; // TODO: clean up later
  }
  return (
    <div className={styles.SingleChat}>
      <div className={styles.SingleChat__username}>{selectedUser.username}</div>
      <Messages />
      <Input />
    </div>
  );
}

export default SingleChatRoom;
