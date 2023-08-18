import React, { useState, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAppContext } from 'context/AppContext';
import { useAuthContext } from 'context/AuthContext';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FIREBASE_AUTH } from '../../../../firebase';
import styles from './Login.module.scss';
import FormItem from '../FormItem/FormItem';
import icon from '../../../../../assets/956fd6.png';
import FormButton from '../FormButton/FormButton';
import FormPassword from '../FormItem/FormPassword/FormPassword';

function Login() {
  const { setShowLogin, setShowSignUp } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const manageErrors = () => {
    switch (error) {
      case 'auth/wrong-password':
        return 'Wrong password!';
      case 'auth/user-not-found':
        return 'Sorry, we cannot find your account.';
      default:
        return 'Invalid Email/Password';
    }
  };

  const onLogin = useCallback(
    (e) => {
      e.preventDefault();
      signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
        .then((userCredential) => {
          // Signed in
          const { user } = userCredential;
          setShowLogin(false);
          return '';
        })
        .catch((err) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          console.log(errorMessage);
          setError(errorCode);
          return '';
        });
      setError('');
    },
    [email, password, setShowLogin]
  );

  return (
    <div className={styles.Login}>
      <div className={styles.Login__left}>
        <div className={styles.leftheader}>
          <IconButton
            className={styles.closeButton}
            onClick={() => {
              setShowLogin(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <img
          className={styles.Login__logo}
          src={icon}
          height={250}
          width={250}
          alt="Logo"
        />
      </div>

      <div className={styles.Login__right}>
        <header className={styles.rightHeader}>
          Don't have an account?
          <button
            type="button"
            className={styles.link}
            onClick={() => {
              setShowSignUp(true);
              setShowLogin(false);
            }}
          >
            Sign Up
          </button>
        </header>

        <div className={styles.Login__rightContent}>
          <strong className={styles.Login__header}>Log in</strong>

          <div className={styles.Login__form}>
            <FormItem
              errors={!!error.length}
              label="Email"
              placeholder="Enter your email"
              onChange={setEmail}
            />

            <FormPassword
              errors={!!error.length}
              label="Password"
              placeholder="Enter your password"
              onChange={setPassword}
            />
            {error.length > 0 && (
              <div className={styles.Login__error}>{manageErrors()}</div>
            )}
            <FormButton label="Log in" onClick={onLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
