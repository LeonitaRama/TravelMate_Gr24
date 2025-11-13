import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGjNECD4-5vbbb5pul3gqmcSvmT4OhUMA0",
  authDomain: "myreactnativeapp-def5a.firebaseapp.com",
  projectId: "myreactnativeapp-def5a",
  storageBucket: "myreactnativeapp-def5a.appspot.com",
  messagingSenderId: "519217992001",
  appId: "1:519217992001:web:0b999d48921c54bcb5d1c0",
  measurementId: "G-4JNW53JVGL",
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app)