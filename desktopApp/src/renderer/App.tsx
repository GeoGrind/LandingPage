import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import CreateSession from 'components/CreateSession/CreateSession';
import Home from '../components/Home';
// import styles from './App.module.scss';
import './App.module.scss';
import Account from '../components/Authentication/Account/Account';

export default function App() {
  return (
    <Router>
      {/* <Home /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/createsession" element={<CreateSession />} />
      </Routes>
    </Router>
  );
}
