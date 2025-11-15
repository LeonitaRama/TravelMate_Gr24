import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ================== Firebase App 1 ==================
// Ky app përdoret për login/signup
const firebaseConfig1 = {
  apiKey: "AIzaSyB7Wk5ebmL22kThHcIHt6bUNNL5B4o6wqQ",
  authDomain: "loginsignupauth-bd332.firebaseapp.com",
  projectId: "loginsignupauth-bd332",
  storageBucket: "loginsignupauth-bd332.firebasestorage.app",
  messagingSenderId: "235621972828",
  appId: "1:235621972828:web:fb409fd9ccbfdfb319df99"
};

const app1 = !getApps().some(app => app.name === 'app1') 
    ? initializeApp(firebaseConfig1, 'app1') 
    : getApp('app1');

export const auth1 = getAuth(app1);
export const db1 = getFirestore(app1);


// ================== Firebase App 2 ==================
// Ky app përdoret për Explore / reviews
const firebaseConfig2 = {
  apiKey: "AIzaSyBRYFOfXjWbw-P4lJei_94A7_J7lGW5yLs",
  authDomain: "travelmate-92c3b.firebaseapp.com",
  projectId: "travelmate-92c3b",
  storageBucket: "travelmate-92c3b.appspot.com",
  messagingSenderId: "1060318263491",
  appId: "1:1060318263491:web:c9a216af909d75bdde0a76",
  measurementId: "G-Z2YK3W17HX"
};

const app2 = !getApps().some(app => app.name === 'app2') 
    ? initializeApp(firebaseConfig2, 'app2') 
    : getApp('app2');

export const auth2 = getAuth(app2);
export const db2 = getFirestore(app2);
