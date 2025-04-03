// src/firebase.js
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBf5TxBqa8rNynUQnFMpzAWjPzhOlvucYs",
    authDomain: "z5vdot.firebaseapp.com",
    projectId: "z5vdot",
    storageBucket: "z5vdot.firebasestorage.app",
    messagingSenderId: "254452151648",
    appId: "1:254452151648:web:826a7891e2e31a94451a05"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
