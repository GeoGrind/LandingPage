import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from 'firebase';
import styles from './Header.module.scss';
import icon from '../../assets/icon.png';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate('/');
        console.log('Signed out successfully');
        return null;
      })
      .catch((error) => {
        console.log('there is an error:', error);
        // An error happened.
      });
  };
  return (
    <div className={styles.Header}>
      <Link to="/home">
        <img className={styles.Header__logo} src={icon} alt="Logo" />
      </Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign up</Link>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Header;
