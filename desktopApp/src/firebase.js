// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD8Ejy3NfOq6VOcvCOwfIM2cMCE1dVC6t8',
  authDomain: 'housingscrap.firebaseapp.com',
  projectId: 'housingscrap',
  storageBucket: 'housingscrap.appspot.com',
  messagingSenderId: '356050298812',
  appId: '1:356050298812:web:7b4434b90b1b1752a9edb9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
