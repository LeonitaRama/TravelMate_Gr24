
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBRYFOfXjWbw-P4lJei_94A7_J7lGW5yLs",
  authDomain: "travelmate-92c3b.firebaseapp.com",
  projectId: "travelmate-92c3b",
  storageBucket: "travelmate-92c3b.firebasestorage.app",
  messagingSenderId: "1060318263491",
  appId: "1:1060318263491:web:c9a216af909d75bdde0a76",
  measurementId: "G-Z2YK3W17HX",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
