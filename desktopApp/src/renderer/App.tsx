import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Chats from 'components/Chats/Chats';
import Home from '../components/Home';
import './App.module.scss';

// eslint-disable-next-line import/order
// import Sidebar from 'components/Sidebar/Sidebar';
import Account from '../components/Authentication/Account/Account';
import Sidebar from 'components/Sidebar/Sidebar';

// const testUser: User = {
//   uid: '123',
//   email: 'legitemail@uwaterloo.ca',
//   username: 'pewdiepie',
//   yearOfGraduation: 2026,
//   university: 'University of Waterloo',
//   program: 'Math',
//   termCourses: ['CS 135'],
//   bio: 'I am pewdiepie',
//   session: null,
// };

export default function App() {
  return (
    <Router>
      {/* <Home /> */}
      {/* <Sidebar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </Router>
    // </AuthContextProvider>
  );
}
