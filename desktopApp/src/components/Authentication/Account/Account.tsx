import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User } from 'types/user.type';
import { Location } from 'types/location.type';
import { getCurrentUser } from 'utils/db';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../../firebase';
import styles from './Account.module.scss';
import FormItem from '../Form/FormItem/FormItem';

function Account() {
  const navigate = useNavigate();
  const [curUser, setCurUser] = useState<User | undefined>(undefined);
  // const [username, setUsername] = useState(curUser.name);
  const [username, setUsername] = useState('my username');
  // const [program, setProgram] = useState(curUser.program);
  const [program, setProgram] = useState('my program');
  const [email, setEmail] = useState('');

  const handleLogout = () => {
    signOut(FIREBASE_AUTH)
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
  useEffect(() => {
    getCurrentUser(setCurUser);
  }, []);

  const accountPage = curUser && (
    <div>
      <div className={styles.Account__picture}>
        {/* insert pfp here */}
        {curUser.profilePicture}
      </div>
      <FormItem
        label="Username"
        placeholder={curUser.username}
        onChange={setUsername}
      />
      {/* <FormItem
        label="Email"
        // placeholder={curUser.name}
        placeholder={curUser.email}
        onChange={setEmail}
      /> */}
      <FormItem
        label="Program"
        // placeholder={curUser.program}
        placeholder="My Program"
        onChange={setProgram}
      />
      isInSession: {curUser.isInSession ? 'yeah' : 'nope'}
      <br />
      Session: {curUser.onGoingSession?.course}
      <br />
      course: {curUser.onGoingSession?.course}
      <br />
      startTime: {curUser.onGoingSession?.startTime}
      <br />
      <br />
      sessionStartLocationLong:{' '}
      {curUser.onGoingSession?.sessionStartLocation?.longitude}
      <br />
      sessionStartLocationLat:{' '}
      {curUser.onGoingSession?.sessionStartLocation?.latitude}
      <br />
    </div>
  );

  return (
    <div className={styles.Account}>
      {accountPage}
      <button
        className={styles.Header__container__inner__utility}
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default Account;
