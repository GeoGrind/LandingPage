import { FIREBASE_DB } from 'firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Session } from 'types/session.type';
import { User } from 'types/user.type';

interface IChatContext {
  currentChatRoomId: string | null;
  setCurrentChatRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  likeSession: (currentUser: User, sessionUser: User) => Promise<void>;
}

export const ChatContext = createContext<IChatContext>({
  currentChatRoomId: null,
  setCurrentChatRoomId: () => {},
  likeSession: async () => {},
});

function ChatContextProvider({ children }: any) {
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  );

  const likeSession = useCallback(
    async (currentUser: User, sessionUser: User): Promise<void> => {
      try {
        const userRef = doc(collection(FIREBASE_DB, 'users'), sessionUser.uid);

        const newLikers = [
          ...(sessionUser.session?.likers || []),
          currentUser.uid,
        ];
        const newNumberOfLikers =
          (sessionUser.session?.numberOfLikers || 0) + 1;

        await updateDoc(userRef, {
          'session.numberOfLikers': newNumberOfLikers,
          'session.likers': newLikers,
        });
        console.log('liked!');
      } catch (error) {
        console.error('Error liking: ', error);
      }
    },
    []
  );

  const returnValue = useMemo(
    () => ({
      currentChatRoomId,
      setCurrentChatRoomId,
      likeSession,
    }),
    [currentChatRoomId, setCurrentChatRoomId, likeSession]
  );

  return (
    <ChatContext.Provider value={returnValue}>{children}</ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error('something went wrong!');
  }
  return context;
};

export default ChatContextProvider;
