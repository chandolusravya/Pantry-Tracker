// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdPXgvIhXDI5UkUJCRQZesw038XDDHZUQ",
  authDomain: "inventory-management-f8284.firebaseapp.com",
  projectId: "inventory-management-f8284",
  storageBucket: "inventory-management-f8284.appspot.com",
  messagingSenderId: "474103485209",
  appId: "1:474103485209:web:dd4b79715d1b678a5dab88",
  measurementId: "G-Q4Z829XWWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}