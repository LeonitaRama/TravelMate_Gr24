import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGjNeCD4-5vbb5pul3qgmCsVmT4OhlMAo",
  authDomain: "myreactnativeapp-def5a.firebaseapp.com",
  projectId: "myreactnativeapp-def5a",
  storageBucket: "myreactnativeapp-def5a.firebasestorage.app",
  messagingSenderId: "519217992001",
  appId: "1:519217992001:web:0b999d48921c54bcb5d1c0",
  measurementId: "G-4JNW53JVGL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 