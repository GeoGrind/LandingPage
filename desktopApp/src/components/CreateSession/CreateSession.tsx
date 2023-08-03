import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormItem from 'components/Authentication/Form/FormItem/FormItem';
import FormButton from 'components/Authentication/Form/FormButton/FormButton';
import { createSession } from 'utils/db';
import styles from './CreateSession.module.scss';
import icon from '../../../assets/956fd6.png';
import { Session } from 'types/session.type';

function CreateSession() {
  const navigate = useNavigate();
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  // const [location, setLocation] = useState({ longitude: 0, latitude: 0 });

  const onCreate = async (e) => {
    e.preventDefault();
    const session: Session = {
      course,
      startTime: Date.now(),
      isPrivate,
      location: {
        label: 'dummy label',
        longitude: 48.8566,
        latitude: 2.3522,
      },
      description,
    };
    await createSession(session);
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
          <FormItem label="Course" onChange={setCourse} />
          <FormItem label="Description" onChange={setDescription} />
          {/* <FormItem label="Privacy" onChange={setIsPrivate} /> */}
          <FormButton label="Create" onClick={onCreate} />
        </div>
      </div>
    </div>
  );
}

export default CreateSession;
