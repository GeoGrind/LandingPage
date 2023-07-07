import { MemoryRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <div className="menu">
          <Link to="/home">
            <h2>Home</h2>
          </Link>
          <Link to="/login">
            <h2>Login</h2>
          </Link>
          <Link to="/signup">
            <h2>Sign up</h2>
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
