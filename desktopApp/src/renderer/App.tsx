import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Chats from 'components/Chats/Chats';
import Home from '../components/Home';
import './App.module.scss';

import Account from '../components/Authentication/Account/Account';
import Sidebar from 'components/Sidebar/Sidebar';

export default function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </Router>
    // </AuthContextProvider>
  );
}
