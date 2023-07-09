import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import styles from './Login.module.scss';
import FormItem from '../FormItem/FormItem';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        navigate('/home');
        console.log(user);
        return null;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const forgotPassword = () => {
    return null;
  };

  return (
    <div className={styles.Login}>
      <h2 className={styles.Login__title}>Login</h2>
      <div className={styles.Login__form}>
        <FormItem label="email" onChange={setEmail} />

        <FormItem label="password" onChange={setPassword} />
      </div>
      <a className={styles.Login__forgotPassword} href="a.com">
        Forgot password?
      </a>

      <button className={styles.Login__button} type="button" onClick={onLogin}>
        Log in
      </button>

      <div className={styles.Login__external}>
        <p>Or Continue with: (add google/other logins later)</p>
      </div>

      <p className={styles.Login__switchForm}>
        No account?{' '}
        <NavLink className={styles.Login__switchForm__link} to="/signup">
          Create one
        </NavLink>
      </p>
    </div>
  );
}

export default Login;
