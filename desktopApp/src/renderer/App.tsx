import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRooms from 'components/ChatRooms/ChatRooms';
import Sidebar from 'components/Sidebar/Sidebar';
import Home from '../components/Home';
import './App.module.scss';
import Account from '../components/Authentication/Account/Account';

export default function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chats" element={<ChatRooms />} />
      </Routes>
    </Router>
    // </AuthContextProvider>
  );
}
