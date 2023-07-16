import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH } from '../../../firebase';
import styles from './Account.module.scss';
import FormItem from '../Form/FormItem/FormItem';
import { signOut } from 'firebase/auth';

function Account() {
  const navigate = useNavigate();

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

  return (
    <div className={styles.Account}>
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
