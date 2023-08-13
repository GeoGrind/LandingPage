import { useEffect, useState } from 'react';
import { Chat } from 'types/chat.type';
import { useAuthContext } from 'context/AuthContext';
import { getUserById } from 'utils/db';
import { User } from 'types/user.type';
import { useChatContext } from 'context/ChatContext';
import styles from './ChatSelector.module.scss';

interface IChatSelectorProps {
  chat: Chat;
}

function ChatSelector({ chat }: IChatSelectorProps) {
  const { currentUser } = useAuthContext();
  const { setCurrentChatId } = useChatContext();
  const [userToSelect, setUserToSelect] = useState<User | null>(null);

  useEffect(() => {
    const getSelectedUser = async () => {
      if (currentUser === null) {
        return;
      }
      if (chat.ownerIds[0] === currentUser.uid) {
        setUserToSelect(await getUserById(chat.ownerIds[1]));
      } else {
        setUserToSelect(await getUserById(chat.ownerIds[0]));
      }
    };

    getSelectedUser();
  }, [chat.ownerIds, currentUser]);

  if (!userToSelect) {
    return null;
  }

  return (
    <div className={styles.ChatSelector}>
      <button
        type="button"
        className={styles.ChatSelector__button}
        key={userToSelect.uid}
        onClick={() => {
          setCurrentChatId(chat.id);
        }}
      >
        {userToSelect.username}
      </button>
    </div>
  );
}

export default ChatSelector;
