import React, { useEffect, useState } from 'react';
import FormItem from 'components/Authentication/Form/FormItem/FormItem';
import FormButton from 'components/Authentication/Form/FormButton/FormButton';
import { createSession, fetchActiveUsers, getCurrentUser } from 'utils/db';
import { Session } from 'types/session.type';
import { Location } from 'types/location.type';
import { useAuthContext } from 'context/AuthContext';
import { useAppContext } from 'context/AppContext';
import styles from './CreateSession.module.scss';
import icon from '../../../assets/956fd6.png';

function CreateSession() {
  const { currentUser, setCurrentUser } = useAuthContext();
  const { setActiveUsers, setShowCreateSession } = useAppContext();

  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          label: 'test 1234',
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      });
    } else {
      alert('unable to get position');
    }
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();

    alert(
      `location: ${location?.label} ${location?.longitude}  ${location?.latitude}`
    );
    const sessionLocation = location || {
      label: 'dummy label 123',
      latitude: 48.8566,
      longitude: 2.3522,
    };
    const session: Session = {
      course,
      startTime: Date.now(),
      isPrivate,
      location: sessionLocation,
      description,
    };

    await createSession(session);
    getCurrentUser(setCurrentUser);
    const users = await fetchActiveUsers();
    setActiveUsers(users);
    setShowCreateSession(false);
  };

  return (
    <div className={styles.CreateSession}>
      <div className={styles.CreateSession__left}>
        <div className={styles.CreateSession__header}>
          Welcome!
          <button type="button" onClick={() => setShowCreateSession(false)}>
            CLOSE CREATE SESSION
          </button>
        </div>
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
          {/* <FormButton
            label="Set Location"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  alert('got position');
                  setLocation({
                    label: 'test 123',
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                  });
                });
              } else {
                alert('unable to get position');
              }
            }}
          /> */}
          {/* <FormItem label="Privacy" onChange={setIsPrivate} /> */}
          <FormButton label="Create" onClick={onCreate} />
        </div>
      </div>
    </div>
  );
}

export default CreateSession;
