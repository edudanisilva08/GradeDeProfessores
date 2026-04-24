import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTLtqd75G0XWB5pD9xybX-3AHAPoufUOg",
  authDomain: "khronotec-c21fa.firebaseapp.com",
  projectId: "khronotec-c21fa",
  storageBucket: "khronotec-c21fa.firebasestorage.app",
  messagingSenderId: "224344007832",
  appId: "1:224344007832:web:61349f8019f3f595659ced",
  measurementId: "G-5G9WFPL7L7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
export const db = getFirestore(app);