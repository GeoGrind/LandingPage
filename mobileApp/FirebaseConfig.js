"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIREBASE_DB = exports.FIREBASE_AUTH = exports.FIREBASE_APP = void 0;
var app_1 = require("firebase/app");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
// import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } from '@env';
var firebaseConfig = {
    apiKey: "AIzaSyBCByzuFU0mrWPbT7jExCA9hPSOSSpfKm8",
    authDomain: "developmentdatabase-b3fbc.firebaseapp.com",
    projectId: "developmentdatabase-b3fbc",
    storageBucket: "developmentdatabase-b3fbc.appspot.com",
    messagingSenderId: "304443000712",
    appId: "1:304443000712:web:ec63f5f33d885979c85c3d",
    measurementId: "G-FWH0BYC07S"
};
exports.FIREBASE_APP = (0, app_1.initializeApp)(firebaseConfig);
exports.FIREBASE_AUTH = (0, auth_1.getAuth)(exports.FIREBASE_APP);
exports.FIREBASE_DB = (0, firestore_1.getFirestore)(exports.FIREBASE_APP);
