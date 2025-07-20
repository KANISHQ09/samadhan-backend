// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtVgpVJCVv0qOm8jticFYHrcZKvcK41to",
  authDomain: "samadhan-8e4fd.firebaseapp.com",
  projectId: "samadhan-8e4fd",
  storageBucket: "samadhan-8e4fd.firebasestorage.app",
  messagingSenderId: "750324158063",
  appId: "1:750324158063:web:9096ac17f04b0c512d479a",
  measurementId: "G-S70Z7EK0ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };