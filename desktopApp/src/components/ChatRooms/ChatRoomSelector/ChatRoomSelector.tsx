import { useEffect, useState } from 'react';
import { ChatRoom } from 'types/chatroom.type';
import { useAuthContext } from 'context/AuthContext';
import { getUserById } from 'utils/db';
import { User } from 'types/user.type';
import { useChatContext } from 'context/ChatContext';
import styles from './ChatRoomSelector.module.scss';

interface IChatRoomSelectorProps {
  chatRoom: ChatRoom;
}

function ChatRoomSelector({ chatRoom }: IChatRoomSelectorProps) {
  const { currentUser } = useAuthContext();
  const { setCurrentChatRoomId } = useChatContext();
  const [userToSelect, setUserToSelect] = useState<User | null>(null);

  useEffect(() => {
    const getSelectedUser = async () => {
      if (currentUser === null) {
        return;
      }
      if (chatRoom.ownerIds[0] === currentUser.uid) {
        setUserToSelect(await getUserById(chatRoom.ownerIds[1]));
      } else {
        setUserToSelect(await getUserById(chatRoom.ownerIds[0]));
      }
    };

    getSelectedUser();
  }, [chatRoom.ownerIds, currentUser]);

  if (!userToSelect) {
    return null;
  }

  return (
    <div className={styles.ChatRoomSelector}>
      <button
        type="button"
        className={styles.ChatRoomSelector__button}
        key={userToSelect.uid}
        onClick={() => {
          setCurrentChatRoomId(chatRoom.id);
        }}
      >
        {userToSelect.username}
      </button>
    </div>
  );
}

export default ChatRoomSelector;
