import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormItem from 'components/Authentication/Form/FormItem/FormItem';
import FormButton from 'components/Authentication/Form/FormButton/FormButton';
import { createSession } from 'utils/db';
import styles from './CreateSession.module.scss';
import icon from '../../../assets/956fd6.png';

function CreateSession() {
  const navigate = useNavigate();
  const [course, setCourse] = useState('');
  // const [location, setLocation] = useState({ longitude: 0, latitude: 0 });

  const onCreate = async (e) => {
    e.preventDefault();
    await createSession(course, {
      longitude: 48.8566,
      latitude: 2.3522,
    });
    console.log('created session');
    navigate('/home');
  };

  return (
    <div className={styles.CreateSession}>
      <div className={styles.CreateSession__left}>
        <div className={styles.CreateSession__header}>Welcome!</div>
        <img
          className={styles.CreateSession__logo}
          src={icon}
          height={250}
          width={250}
          alt="Logo"
        />
        <div className={styles.CreateSession__left__footer}>Placeholder</div>
      </div>

      <div className={styles.CreateSession__right}>
        <div className={styles.CreateSession__right__content}>
          <strong className={styles.CreateSession__header}>
            Create Session
          </strong>
        </div>
        <div className={styles.CreateSession__form}>
          <FormItem label="course" onChange={setCourse} />
          {/* <FormItem label="location" onChange={setLocation} /> */}
          <FormButton label="Create" onClick={onCreate} />
        </div>
      </div>
    </div>
  );
}

export default CreateSession;
