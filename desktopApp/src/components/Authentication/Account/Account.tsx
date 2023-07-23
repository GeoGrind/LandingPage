import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User } from 'types/user.type';
import { Location } from 'types/location.type';
import { getCurrentUser } from 'utils/db';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../../firebase';
import styles from './Account.module.scss';

function Account() {
  const navigate = useNavigate();
  const [curUser, setCurUser] = useState<User | undefined>(undefined);

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

  return (
    <div className={styles.Account}>
      <button
        className={styles.Header__container__inner__utility}
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>

      {curUser && (
        <div>
          profilePicture: {curUser.profilePicture}
          <br />
          User Properties: uid: {curUser.uid}
          <br />
          email: {curUser.email}
          <br />
          isInSession: {curUser.isInSession}
          <br />
          Session: {curUser.onGoingSession?.course}
          <br />
          course: {curUser.onGoingSession?.course}
          <br />
          startTime: {curUser.onGoingSession?.startTime}
          <br />
          isVisible: {curUser.onGoingSession?.isVisible}
          <br />
          sessionStartLocationLong:{' '}
          {curUser.onGoingSession?.sessionStartLocation?.longitude}
          <br />
          sessionStartLocationLat:{' '}
          {curUser.onGoingSession?.sessionStartLocation?.latitude}
          <br />
          numberOfCheerers: {curUser.onGoingSession?.numberOfCheerers}
          <br />
          cheerers: to add
        </div>
      )}
    </div>
  );
}

export default Account;
