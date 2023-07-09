import { MemoryRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Header from 'components/Header';
import Login from '../components/Authentication/Login/Login';
import SignUp from '../components/Authentication/SignUp/SignUp';
import Home from '../components/Home/Home';
// import styles from './App.module.scss';
import './App.module.scss';

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
