// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqORAckUgiwnkX1yTIAeK5mBP5M4wUHx0",
  authDomain: "chatapp2143.firebaseapp.com",
  projectId: "chatapp2143",
  storageBucket: "chatapp2143.appspot.com",
  messagingSenderId: "89178422738",
  appId: "1:89178422738:web:72ff6f6651c826d5095c0b",
  measurementId: "G-V38272KCHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);