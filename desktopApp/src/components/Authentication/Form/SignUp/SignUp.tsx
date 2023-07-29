import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUser } from 'utils/db';
import { FIREBASE_AUTH } from '../../../../firebase';
import styles from './SignUp.module.scss';
import FormItem from '../FormItem/FormItem';
import FormButton from '../FormButton/FormButton';
import icon from '../../../../../assets/956fd6.png';
import { User } from 'types/user.type';

function isUwaterlooEmail(email: string) {
  return (email.endsWith('@uwaterloo.ca'));
}

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<Array<string>>([]);

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // call function to check all errors here
    if (!isUwaterlooEmail(email)) { 
      setErrors([...errors, 'Invalid UWaterloo Email']);
      console.log('inposter! ' + email);
      return; 
    }

    e.preventDefault();
    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user: User = {
        uid: response.user.uid,
        username: username,
        email: response.user.email || '',
        location: null,
        isInSession: false,
        onGoingSession: null,
        profilePicture: null,
      };

      console.log("The username is: " + username);
      await createUser(user);
      navigate('/login');
    } catch {
      console.log(e);
    }
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
          <FormItem label="Username" onChange={setUsername} />
          <FormItem label="Email" onChange={setEmail} />
          <FormItem label="Password" onChange={setPassword} />
          <FormButton label="Sign Up" onClick={onSubmit} />
          { errors.length>0 && <div>ur Mom</div>}
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
