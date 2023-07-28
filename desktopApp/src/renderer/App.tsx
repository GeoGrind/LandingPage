import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Header from 'components/Header';
import CreateSession from 'components/CreateSession/CreateSession';
import Login from '../components/Authentication/Form/Login/Login';
import SignUp from '../components/Authentication/Form/SignUp/SignUp';
import Home from '../components/Home';
// import styles from './App.module.scss';
import './App.module.scss';
import Account from '../components/Authentication/Account/Account';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/createsession" element={<CreateSession />} />
      </Routes>
    </Router>
  );
}
