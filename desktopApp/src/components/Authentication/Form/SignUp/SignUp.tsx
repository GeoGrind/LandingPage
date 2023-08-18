import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUser } from 'utils/db';
import { User } from 'types/user.type';
import { useAppContext } from 'context/AppContext';
import { FIREBASE_AUTH } from '../../../../firebase';
import styles from './SignUp.module.scss';
import FormItem from '../FormItem/FormItem';
import FormPassword from '../FormItem/FormPassword/FormPassword';
import FormButton from '../FormButton/FormButton';
import icon from '../../../../../assets/956fd6.png';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

function isValidEmail(email: string) {
  return (
    email.endsWith('@uwaterloo.ca') ||
    email.endsWith('@mail.utoronto.ca') ||
    email.endsWith('@student.ubc.ca') ||
    email.endsWith('@mail.mcgill.ca') ||
    email.endsWith('@ualberta.ca') ||
    email.endsWith('@mcmaster.ca') ||
    email.endsWith('@uottawa.ca') ||
    email.endsWith('@uwo.ca') ||
    email.endsWith('@queensu.ca') ||
    email.endsWith('@ucalgary.ca')
  );
}

function isValidUsername(username: string) {
  return username.length > 0;
}

function isInvalidPass(p: string) {
  if (p.length < 6) {
    return 'Your password must be at least 6 characters.';
  }
  if (p.search(/[a-z]/i) < 0) {
    return 'Your password must contain at least one letter.';
  }
  if (p.search(/[0-9]/) < 0) {
    return 'Your password must contain at least one digit.';
  }
  return '';
}

function SignUp() {
  const { setShowLogin, setShowSignUp } = useAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [university, setUniversity] = useState('');
  const [yearOfGraduation, setYearOfGraduation] = useState('');
  const [program, setProgram] = useState('');

  const [usernameErrors, setusernameErrors] = useState<Array<string>>([]);
  const [passwordErrors, setpasswordErrors] = useState<Array<string>>([]);
  const [emailErrors, setemailErrors] = useState<Array<string>>([]);

  const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // check all errors here
    setusernameErrors([]);
    setemailErrors([]);
    setpasswordErrors([]);
    setemailErrors([]);
    let validForm = true;
    if (!isValidEmail(email)) {
      setemailErrors((emailErrors) => [
        ...emailErrors,
        'Invalid university Email Address.',
      ]);
      console.log('imposter email: ', email);
      validForm = false;
    }
    let passwordError: string = isInvalidPass(password);
    if (passwordError) {
      setpasswordErrors((passwordErrors) => [...passwordErrors, passwordError]);
      validForm = false;
    }
    if (!isValidUsername(username)) {
      setusernameErrors((usernameErrors) => [
        ...usernameErrors,
        'Invalid username.',
      ]);
      validForm = false;
    }
    if (validForm === false) {
      if (!usernameErrors.length) {
      }
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user: User = {
        uid: response.user.uid,
        expoToken: null, // todo: sync with justin to do this logic
        email: response.user.email || '',
        username,
        emoji: '',
        termCourses: [],
        session: null,
        program: 'mathematics',
        yearOfGraduation: 2026,
        university: 'University of Waterloo',
        profilePicture:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png',
      };
      console.log('creating user');

      await createUser(user);
      setShowSignUp(false);
    } catch {
      console.log(e);
    }
  };

  {
    /* <div className={styles.SignUp__left__footer}>
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
</div> */
  }

  return (
    <div className={styles.SignUp}>
      <div className={styles.SignUp__left}>
        <header className={styles.leftheader}>
          <IconButton
            className={styles.closeButton}
            onClick={() => {
              setShowSignUp(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </header>
        <img
          className={styles.SignUp__logo}
          src={icon}
          height={250}
          width={250}
          alt="Logo"
        />
      </div>

      <div className={styles.SignUp__right}>
        <header className={styles.rightHeader}>
          Already a Member?
          <button
            type="button"
            className={styles.link}
            onClick={() => {
              setShowSignUp(false);
              setShowLogin(true);
            }}
          >
            Log In
          </button>
        </header>

        <div className={styles.SignUp__rightContent}>
          <div>
            <div>
              <strong className={styles.SignUp__header}>
                Create Your Account
              </strong>
            </div>
            <div className={styles.SignUp__form}>
              <FormItem
                label="Username"
                errors={!usernameErrors.length ? false : true}
                placeholder={'Create Your Username'}
                onChange={setUsername}
              />
              <div className={styles.SignUp__error}>
                {usernameErrors.length > 0 && usernameErrors[0]}
              </div>

              <FormItem
                label="Email"
                errors={!usernameErrors.length ? false : true}
                placeholder={'Your Email Address'}
                onChange={setEmail}
              />
              <div className={styles.SignUp__error}>
                {emailErrors.length > 0 && emailErrors[0]}
              </div>

              <FormPassword
                label="Password"
                errors={!usernameErrors.length ? false : true}
                placeholder={'Create Your Password'}
                onChange={setPassword}
              />
              <div className={styles.SignUp__error}>
                {passwordErrors.length > 0 && passwordErrors[0]}
              </div>
              <FormButton label="Sign Up" onClick={onSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
