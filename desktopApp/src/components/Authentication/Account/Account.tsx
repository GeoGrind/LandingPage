/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuthContext } from 'context/AuthContext';
import { useAppContext } from 'context/AppContext';
import { useForm } from 'react-hook-form';

import styles from './Account.module.scss';
import FormItem from '../Form/FormItem/FormItem';

function Account() {
  const { contentStyles } = useAppContext();
  const { currentUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser?.username);
  const [yearOfGraduation, setYearOfGraduation] = useState(
    currentUser?.yearOfGraduation
  );
  const [university, setUniversity] = useState(currentUser?.university);
  const [program, setProgram] = useState(currentUser?.program);
  const [termCourses, setTermCourses] = useState(currentUser?.termCourses);
  const [bio, setBio] = useState(currentUser?.bio);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };
  console.log(errors);

  if (!currentUser) {
    return null;
  }
  return (
    <div className={styles.Account} style={contentStyles}>
      <form className={styles.Account__form} onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input
          className={styles.Account__form__input}
          type="text"
          value={currentUser.username}
          placeholder="Username"
          {...register}
        />
        <label>Year of Graduation</label>

        <input
          className={styles.Account__form__input}
          type="number"
          value={currentUser.yearOfGraduation}
          placeholder="Year of Graduation"
          {...register('Year of Graduation', { max: 3000, min: 2000 })}
        />

        <label>University</label>
        <select {...register('University')}>
          <option value="University of Waterloo">University of Waterloo</option>
        </select>
        <label>Program</label>

        <select {...register('Program')}>
          <option value="Mathematics">Mathematics</option>
        </select>
        <label>Term Courses</label>
        <input
          className={styles.Account__form__input}
          type="text"
          placeholder="Term Courses"
          {...register}
        />

        <label>Bio</label>
        <input
          className={styles.Account__form__input}
          value={currentUser.bio}
          type="text"
          placeholder="Bio"
          {...register}
        />

        <div className={styles.Account__form__save}>
          <button
            className={styles['Account__form__save--button']}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Account;
