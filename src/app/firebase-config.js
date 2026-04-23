import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
export const db = getFirestore(app);
