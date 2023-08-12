import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUser } from 'utils/db';
import { User } from 'types/user.type';
import { FIREBASE_AUTH } from '../../../../firebase';
import styles from './SignUp.module.scss';
import FormItem from '../FormItem/FormItem';
import FormButton from '../FormButton/FormButton';
import icon from '../../../../../assets/956fd6.png';

function isUwaterlooEmail(email: string) {
  return email.endsWith('@uwaterloo.ca');
}

interface ISignUpProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

function SignUp({ setShowLogin, setShowSignUp }: ISignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<Array<string>>([]);

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // call function to check all errors here
    if (!isUwaterlooEmail(email)) {
      setErrors([...errors, 'Invalid UWaterloo Email']);
      console.log('imposter::', email);
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
        email: response.user.email || '',
        username,
        yearOfGraduation: 2026,
        university: 'University of Waterloo',
        program: 'math',
        termCourses: [],
        bio: 'dummy bio',
        session: null,
      };

      await createUser(user);
      setShowSignUp(false);
    } catch {
      console.log(e);
    }
  };

  return (
    <div className={styles.SignUp}>
      <div className={styles.SignUp__left}>
        <div className={styles.SignUp__header}>
          Welcome!
          <button type="button" onClick={() => setShowSignUp(false)}>
            CLOSE SIGNUP
          </button>
        </div>
        <img
          className={styles.SignUp__logo}
          src={icon}
          height={250}
          width={250}
          alt="Logo"
        />
        <div className={styles.SignUp__left__footer}>
          Already have an account?{' '}
          <button
            type="button"
            className={styles.link}
            onClick={() => {
              setShowSignUp(false);
              setShowLogin(true);
            }}
          >
            Log in
          </button>
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
          {errors.length > 0 && <div>ur Mom</div>}
        </div>

        <div className={styles.SignUp__right__bottom}>Change Later</div>
      </div>
    </div>
  );
}
export default SignUp;
