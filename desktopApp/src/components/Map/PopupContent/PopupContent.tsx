import { Link } from 'react-router-dom';
import firebase, { FIREBASE_AUTH } from 'firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import {
  getCurrentUser,
  getUserByUid,
  stopSessionOfCurrentUser,
} from 'utils/db';
import styles from './PopupContent.module.scss';
import { User } from 'types/user.type';

interface IPopupContentProps {
  user: User;
}

function PopupContent({ user }: IPopupContentProps) {
  return (
    <div className={styles.PopupContent}>
      <div className={styles.PopupContent__username}>{user.email}</div>
      <button
        className={styles.Header__container__inner__nav__item}
        type="button"
        onClick={() => alert('test')}
      >
        test 123
      </button>
    </div>
  );
}

export default PopupContent;
