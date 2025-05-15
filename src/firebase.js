// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnVQC3CCsc75NL2JL-R6DlVBQxIqKN8Fs",
  authDomain: "tis-task-login-firebase.firebaseapp.com",
  projectId: "tis-task-login-firebase",
  storageBucket: "tis-task-login-firebase.appspot.com",
  messagingSenderId: "784990897343",
  appId: "1:784990897343:web:9c09045cc89ac1a6abf20a",
  measurementId: "G-CF5K4FCMSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); 

// Export for use in other files
export { app, analytics, auth, db }; 
