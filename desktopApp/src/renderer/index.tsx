import { createRoot } from 'react-dom/client';
import AuthContextProvider from 'context/AuthContext';
import ChatContextProvider from 'context/ChatContext';
import App from './App';
import AppContextProvider from 'context/AppContext';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <AppContextProvider>
    <AuthContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthContextProvider>
  </AppContextProvider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
