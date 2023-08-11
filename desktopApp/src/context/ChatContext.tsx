import { createContext, useContext, useMemo, useState } from 'react';

interface IChatContext {
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatContext = createContext<IChatContext>({
  currentChatId: null,
  setCurrentChatId: () => {},
});

function ChatContextProvider({ children }: any) {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const returnValue = useMemo(
    () => ({
      currentChatId,
      setCurrentChatId,
    }),
    [currentChatId, setCurrentChatId]
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
