import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBCByzuFU0mrWPbT7jExCA9hPSOSSpfKm8',
  authDomain: 'developmentdatabase-b3fbc.firebaseapp.com',
  projectId: 'developmentdatabase-b3fbc',
  storageBucket: 'developmentdatabase-b3fbc.appspot.com',
  messagingSenderId: '304443000712',
  appId: '1:304443000712:web:ec63f5f33d885979c85c3d',
  measurementId: 'G-FWH0BYC07S',
};
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);