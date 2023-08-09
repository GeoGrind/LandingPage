import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CreateSession from 'components/CreateSession/CreateSession';
import Chats from 'components/Chats/Chats';
import Home from '../components/Home';
import './App.module.scss';
import Account from '../components/Authentication/Account/Account';

// eslint-disable-next-line import/order
import { User } from 'types/user.type'; // delete after you refactor

const testUser: User = {
  uid: '123',
  email: 'legitemail@uwaterloo.ca',
  username: 'pewdiepie',
  yearOfGraduation: 2026,
  university: 'University of Waterloo',
  program: 'Math',
  termCourses: ['CS 135'],
  bio: 'I am pewdiepie',
  session: null,
};

export default function App() {
  return (
    <Router>
      {/* <Home /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account curUser={testUser} />} />
        <Route path="/chats" element={<Chats curUser={testUser} />} />
      </Routes>
    </Router>
  );
}
