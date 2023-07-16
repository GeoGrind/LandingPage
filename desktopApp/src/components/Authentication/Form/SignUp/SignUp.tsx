import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../../../firebase';
import styles from './SignUp.module.scss';
import FormItem from '../FormItem/FormItem';
import FormButton from '../FormButton/FormButton';
import icon from '../../../../../assets/956fd6.png';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        console.log(user);
        navigate('/login');
        return null;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  return (
    <div className={styles.SignUp}>
      <div className={styles.SignUp__left}>
        <div className={styles.SignUp__header}>Welcome!</div>
        <img
          className={styles.SignUp__logo}
          src={icon}
          height={250}
          width={250}
          alt="Logo"
        />
        <div className={styles.SignUp__left__footer}>
          Already have an account?{' '}
          <NavLink className={styles.link} to="/login">
            Log in
          </NavLink>
        </div>
      </div>

      <div className={styles.SignUp__right}>
        <div className={styles.SignUp__right__content}>
          <strong className={styles.SignUp__header}>Sign Up</strong>
        </div>
        <div className={styles.SignUp__form}>
          <FormItem label="email" onChange={setEmail} />
          <FormItem label="password" onChange={setPassword} />
          <FormButton label="Sign Up" onClick={onSubmit} />
        </div>

        <div className={styles.SignUp__right__bottom}>
          Or sign up with
          <div className={styles.SignUp__social}>Google</div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
