// components/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyD8CSO-zgBpUW1uTTFPd8CcHy_dSHTbY3k",
  authDomain: "iotproject-5d691.firebaseapp.com",
  databaseURL: "https://iotproject-5d691-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iotproject-5d691",
  storageBucket: "iotproject-5d691.firebasestorage.app",
  messagingSenderId: "1048550354404",
  appId: "1:1048550354404:web:b62bdd2bc4fb3948bd6bf1",
  measurementId: "G-TJGYFCW3GZ"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);