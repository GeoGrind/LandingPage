import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB6NXVw0aowHlBu9yC0FEDzsB7Oph-WPco',
  authDomain: 'foobar-testing-43480.firebaseapp.com',
  projectId: 'foobar-testing-43480',
  storageBucket: 'foobar-testing-43480.appspot.com',
  messagingSenderId: '476983559491',
  appId: '1:476983559491:web:0df4413f71f3f320691bf6',
  measurementId: 'G-5ZE6YMNP79',
};
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
