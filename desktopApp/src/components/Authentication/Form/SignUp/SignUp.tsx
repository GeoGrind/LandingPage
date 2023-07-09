import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../firebase';
import styles from './SignUp.module.scss';
import FormItem from '../FormItem/FormItem';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
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
      <h2 className={styles.SignUp__title}>Sign Up</h2>
      <div className={styles.SignUp__form}>
        <FormItem label="email" onChange={setEmail} />

        <FormItem label="password" onChange={setPassword} />
      </div>

      <button
        className={styles.SignUp__button}
        type="button"
        onClick={onSubmit}
      >
        Sign Up
      </button>

      <p className={styles.SignUp__switchForm}>
        Already Have an account?{' '}
        <NavLink className={styles.SignUp__switchForm__link} to="/login">
          Log in
        </NavLink>
      </p>
    </div>
  );
}

export default SignUp;
