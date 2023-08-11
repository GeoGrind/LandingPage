import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuthContext } from 'context/AuthContext';
import { FIREBASE_AUTH } from '../../../firebase';
import styles from './Account.module.scss';
import FormItem from '../Form/FormItem/FormItem';

// interface IAccountProps {
// }

// function Account({}: IAccountProps) {
function Account() {
  // cur user is currently not working (not being passed in)
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser?.username);
  const [yearOfGraduation, setYearOfGraduation] = useState(
    currentUser?.yearOfGraduation
  );
  const [university, setUniversity] = useState(currentUser?.university);
  const [program, setProgram] = useState(currentUser?.program);
  const [termCourses, setTermCourses] = useState(currentUser?.termCourses);
  const [bio, setBio] = useState(currentUser?.bio);

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

  const accountPage = currentUser && (
    <div>
      <FormItem
        label="Username"
        placeholder={currentUser.username}
        onChange={setUsername}
      />
      <FormItem
        label="Program"
        placeholder={currentUser.program}
        onChange={setProgram}
      />
      <br />
      Session: {currentUser.session?.course}
      <br />
      course: {currentUser.session?.course}
      <br />
      startTime: {currentUser.session?.startTime}
      <br />
      <br />
      sessionStartLocationLong: {currentUser.session?.location.longitude}
      <br />
      sessionStartLocationLat: {currentUser.session?.location.latitude}
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
