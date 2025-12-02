// ================== Firebase App 1  ==================
// Ky app përdoret për Login
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig1 = {
  apiKey: "AIzaSyB7Wk5ebmL22kThHcIHt6bUNNL5B4o6wqQ",
  authDomain: "loginsignupauth-bd332.firebaseapp.com",
  projectId: "loginsignupauth-bd332",
  storageBucket: "loginsignupauth-bd332.firebasestorage.app",
  messagingSenderId: "235621972828",
  appId: "1:235621972828:web:fb409fd9ccbfdfb319df99"
};

const app1 = getApps().length === 0 ? initializeApp(firebaseConfig1, 'app1') : getApp('app1');


let auth1;
try{
if (!getApps().some(app => app.name === 'app1')) {
  // Nëse nuk ekziston app, inicializo auth
  auth1 = initializeAuth(app1, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  auth1 = getAuth(app1);
}
}catch{
  const app1 = getApps().length === 0 ? initializeApp(firebaseConfig1, 'app1') : getApp('app1');
}

// Firestore
const db1 = getFirestore(app1);
export { auth1, db1 };





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



// ================== Firebase App 3  ==================

const firebaseConfig3 = {
  apiKey: "AIzaSyDTBKMwDWZbj0rzc8CL4zVz2BVOvIUHk6E",
  authDomain: "app-login-e5a16.firebaseapp.com",
  projectId: "app-login-e5a16",
  storageBucket: "app-login-e5a16.firebasestorage.app",
  messagingSenderId: "1085626687454",
  appId: "1:1085626687454:web:4582d8bead95581a52074f"
};


// Initialize Firebase
const app3 = initializeApp(firebaseConfig3);

// Auth (duhet patjetër ky version në Expo!)
const auth3 = initializeAuth(app3, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Firestore
const db3 = getFirestore(app3);

export { app3, auth3, db3 };
