import React, { createContext, useContext, useMemo, useState } from 'react';

interface IChatContext {
  currentChatRoomId: string | null;
  setCurrentChatRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatContext = createContext<IChatContext>({
  currentChatRoomId: null,
  setCurrentChatRoomId: () => {},
});

function ChatContextProvider({ children }: any) {
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  );

  const returnValue = useMemo(
    () => ({
      currentChatRoomId,
      setCurrentChatRoomId,
    }),
    [currentChatRoomId, setCurrentChatRoomId]
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
