// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuroPCHzCg8KaZcnSrBIkQErCgLP-jlE0",
  authDomain: "my-clitoria-project.firebaseapp.com",
  projectId: "my-clitoria-project",
  storageBucket: "my-clitoria-project.firebasestorage.app",
  messagingSenderId: "288305128169",
  appId: "1:288305128169:web:69a9e36f6c0cc0fdea0678",
  measurementId: "G-HDVVJPYQ2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);