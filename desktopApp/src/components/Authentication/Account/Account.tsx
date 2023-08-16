/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import { useAppContext } from 'context/AppContext';
import { useForm, useFieldArray } from 'react-hook-form';
import styles from './Account.module.scss';

function Account() {
  const { currentUser, updateCurrentUser, upload } = useAuthContext();
  const { contentStyles } = useAppContext();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      yearOfGraduation: currentUser?.yearOfGraduation,
      university: currentUser?.university,
      program: currentUser?.program,
      bio: currentUser?.bio,
      termCourses: currentUser?.termCourses,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'termCourses',
  });
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
      <form className={styles.Account__form} onSubmit={handleSubmit(onSubmit)}>
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
        <label>Email</label>
        <input
          className={styles.Account__form__input}
          type="text"
          placeholder="Email"
          value={currentUser.email}
          disabled
        />
        <label>Username</label>
        <input
          className={styles.Account__form__input}
          type="text"
          placeholder="Username"
          {...register('username')}
        />

        <label>Year of Graduation</label>

        <input
          className={styles.Account__form__input}
          type="number"
          placeholder="Year of Graduation"
          {...register('yearOfGraduation', { max: 3000, min: 2000 })}
        />

        <label>University</label>
        <select {...register('university')}>
          <option value="University of Waterloo">University of Waterloo</option>
        </select>
        <label>Program</label>

        <select {...register('program')}>
          <option value="Mathematics">Mathematics</option>
        </select>
        <label>Bio</label>
        <input
          className={styles.Account__form__input}
          defaultValue={currentUser.bio}
          type="text"
          placeholder="bio"
          {...register('bio')}
        />

        <ul>
          <label>Term Courses</label>
          {fields.map((item, index) => {
            return (
              <li key={item.id}>
                <input
                  defaultValue={currentUser.termCourses[index]}
                  {...register(`termCourses.${index}` as const, {
                    required: true,
                  })}
                />
                <button type="button" onClick={() => remove(index)}>
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => {
            append('');
          }}
        >
          Add course
        </button>
        <div className={styles.Account__form__save}>
          <button
            className={styles['Account__form__save--button']}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
      SESSION
    </div>
  );
}

export default Account;
