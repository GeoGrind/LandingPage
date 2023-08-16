import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  FIREBASE_API_KEY_LOCAL,
  FIREBASE_AUTH_DOMAIN_LOCAL,
  FIREBASE_PROJECT_ID_LOCAL,
  FIREBASE_STORAGE_BUCKET_LOCAL,
  FIREBASE_MESSAGING_SENDER_ID_LOCAL,
  FIREBASE_APP_ID_LOCAL,
  FIREBASE_API_KEY_FLIGHT,
  FIREBASE_AUTH_DOMAIN_FLIGHT,
  FIREBASE_PROJECT_ID_FLIGHT,
  FIREBASE_STORAGE_BUCKET_FLIGHT,
  FIREBASE_MESSAGING_SENDER_ID_FLIGHT,
  FIREBASE_APP_ID_FLIGHT,
} from "@env";

console.log(process.env.npm_config_name);
let firebaseConfig;
const isProduction = process.env.NODE_ENV === "production";
if (process.env.npm_config_name === "flight" || isProduction) {
  firebaseConfig = {
    apiKey: FIREBASE_API_KEY_FLIGHT,
    authDomain: FIREBASE_AUTH_DOMAIN_FLIGHT,
    projectId: FIREBASE_PROJECT_ID_FLIGHT,
    storageBucket: FIREBASE_STORAGE_BUCKET_FLIGHT,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID_FLIGHT,
    appId: FIREBASE_APP_ID_FLIGHT,
  };
} else {
  firebaseConfig = {
    apiKey: FIREBASE_API_KEY_LOCAL,
    authDomain: FIREBASE_AUTH_DOMAIN_LOCAL,
    projectId: FIREBASE_PROJECT_ID_LOCAL,
    storageBucket: FIREBASE_STORAGE_BUCKET_LOCAL,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID_LOCAL,
    appId: FIREBASE_APP_ID_LOCAL,
  };
}

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
