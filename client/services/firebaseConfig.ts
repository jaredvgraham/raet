// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5HC8h_m_jfYsaBoL2kwWRUeK3jO3dOSI",
  authDomain: "raet-af52c.firebaseapp.com",
  projectId: "raet-af52c",
  storageBucket: "raet-af52c.appspot.com",
  messagingSenderId: "455669783859",
  appId: "1:455669783859:web:b345fd99f0c04300f9b246",
  measurementId: "G-9E7KVCM2TZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export default app;
