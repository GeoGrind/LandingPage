import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAppContext } from 'context/AppContext';
import { useAuthContext } from 'context/AuthContext';
import { FIREBASE_AUTH } from '../../../../firebase';
import styles from './Login.module.scss';
import FormItem from '../FormItem/FormItem';
import icon from '../../../../../assets/956fd6.png';
import FormButton from '../FormButton/FormButton';

function Login() {
  const { setShowLogin, setShowSignUp } = useAppContext();
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.Login}>
      <div className={styles.Login__left}>
        <div className={styles.Login__header}>
          Welcome!
          <button type="button" onClick={() => setShowLogin(false)}>
            CLOSE LOGIn
          </button>
        </div>
        <img
          className={styles.Login__logo}
          src={icon}
          height={250}
          width={250}
          alt="Logo"
        />
        <div className={styles.Login__left__footer}>
          No account?{' '}
          <button
            type="button"
            className={styles.link}
            onClick={() => {
              setShowLogin(false);
              setShowSignUp(true);
            }}
          >
            Create one
          </button>
        </div>
      </div>

      <div className={styles.Login__right}>
        <div className={styles.Login__right__content}>
          <strong className={styles.Login__header}>Log in</strong>
        </div>
        <div className={styles.Login__form}>
          <FormItem label="Email" onChange={setEmail} />
          <FormItem label="Password" onChange={setPassword} />
          <FormButton
            label="Log in"
            onClick={() => {
              login(email, password);
            }}
          />
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
