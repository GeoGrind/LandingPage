import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase';
import styles from './Login.module.scss';
import FormItem from '../FormItem/FormItem';
import icon from '../../../../../assets/956fd6.png';
import FormButton from '../FormButton/FormButton';

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
      <div className={styles.Login__left}>
        <div className={styles.Login__header}>Welcome!</div>
        <img
          className={styles.Login__logo}
          src={icon}
          height={100}
          alt="Logo"
        />
        <div className={styles.Login__left__footer}>
          No account?{' '}
          <NavLink className={styles.link} to="/signup">
            Create one
          </NavLink>
        </div>
      </div>

      <div className={styles.Login__right}>
        <div className={styles.Login__right__content}>
          <strong className={styles.Login__header}>Log in</strong>
        </div>
        <div className={styles.Login__form}>
          <FormItem label="email" onChange={setEmail} />
          <FormItem label="password" onChange={setPassword} />
          <FormButton label="Log in" onClick={onLogin} />
        </div>

        <div className={styles.Login__right__bottom}>
          Or sign in with
          <div className={styles.Login__social}>Google</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
{
  /* <h2 className={styles.Login__title}>Login</h2>
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
      </p> */
}
