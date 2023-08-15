/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { useAppContext } from 'context/AppContext';
import { useForm } from 'react-hook-form';
import styles from './Account.module.scss';

function Account() {
  const { currentUser, updateCurrentUser, upload } = useAuthContext();
  const { contentStyles } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
  ); // TODO: replace this later

  useEffect(() => {
    if (currentUser?.photoUrl) {
      setPhotoURL(currentUser.photoUrl);
    }
  }, [currentUser]);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const onSubmit = (data: any) => {
    updateCurrentUser(data);
  };

  if (!currentUser) {
    return null;
  }
  return (
    <div className={styles.Account} style={contentStyles}>
      <div className="fields">
        <input type="file" onChange={handlePhotoChange} />
        <button
          type="button"
          disabled={loading || !photo}
          onClick={() => {
            upload(photo, setLoading);
          }}
        >
          Upload
        </button>
        <img
          src={photoURL}
          height={150}
          width={150}
          alt="Avatar"
          className="avatar"
        />
      </div>
      <form className={styles.Account__form} onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input
          className={styles.Account__form__input}
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
          {...register('username')}
        />
        <label>Year of Graduation</label>

        <input
          className={styles.Account__form__input}
          type="number"
          defaultValue={currentUser.yearOfGraduation}
          placeholder="Year of Graduation"
          {...register('yearOfGraduation', { max: 3000, min: 2000 })}
        />

        <label>University</label>
        <select
          defaultValue={currentUser.university || ''}
          {...register('university')}
        >
          <option value="University of Waterloo">University of Waterloo</option>
        </select>
        <label>Program</label>

        <select defaultValue={currentUser.program} {...register('program')}>
          <option value="Mathematics">Mathematics</option>
        </select>
        <label>Term Courses</label>
        <input
          className={styles.Account__form__input}
          defaultValue={currentUser.termCourses}
          type="text"
          placeholder=""
          {...register('termCourses')}
        />

        <label>Bio</label>
        <input
          className={styles.Account__form__input}
          defaultValue={currentUser.bio}
          type="text"
          placeholder="bio"
          {...register('bio')}
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
