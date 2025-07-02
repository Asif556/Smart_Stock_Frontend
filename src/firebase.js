// Firebase configuration
// Add your Firebase config here when ready

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config object goes here
const firebaseConfig = {
  apiKey: "AIzaSyAMpeZ5xu2Jgx16Yk-wJzovchVcKBnBY8w",
  authDomain: "inventory-fe321.firebaseapp.com",
  projectId: "inventory-fe321",
  storageBucket: "inventory-fe321.firebasestorage.app",
  messagingSenderId: "10733735307",
  appId: "1:10733735307:web:d33ecdc4d6cb29353fb38e",
  measurementId: "G-10WQ7XMDBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;