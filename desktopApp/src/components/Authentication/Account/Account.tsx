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
      <br />
      Session: {curUser.session?.course}
      <br />
      course: {curUser.session?.course}
      <br />
      startTime: {curUser.session?.startTime}
      <br />
      <br />
      sessionStartLocationLong: {curUser.session?.location.longitude}
      <br />
      sessionStartLocationLat: {curUser.session?.location.latitude}
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
