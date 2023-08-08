import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User } from 'types/user.type';
import { Location } from 'types/location.type';
import { getCurrentUser } from 'utils/db';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../../firebase';
import styles from './Account.module.scss';
import FormItem from '../Form/FormItem/FormItem';

interface IAccountProps {
  curUser: User | undefined;
}

function Account({ curUser }: IAccountProps) { // cur user is currently not working (not being passed in)
  const navigate = useNavigate();
  const [username, setUsername] = useState(curUser?.username);
  const [yearOfGraduation, setYearOfGraduation] = useState(
    curUser?.yearOfGraduation
  );
  const [university, setUniversity] = useState(curUser?.university);
  const [program, setProgram] = useState(curUser?.program);
  const [termCourses, setTermCourses] = useState(curUser?.termCourses);
  const [bio, setBio] = useState(curUser?.bio);

  // const [email, setEmail] = useState(''); // shouldnt make this editable

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

  const accountPage = curUser && (
    <div>
      <FormItem
        label="Username"
        placeholder={curUser.username}
        onChange={setUsername}
      />
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
      <Link className={styles.Header__container__inner__nav__item} to="/">
        Home
      </Link>
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
