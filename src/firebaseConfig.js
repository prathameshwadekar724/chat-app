import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC0i1l_lUrPZTG5zihmwPEqwD2Iut4qb_8",
  authDomain: "chat-app-8f0ac.firebaseapp.com",
  projectId: "chat-app-8f0ac",
  storageBucket: "chat-app-8f0ac.firebasestorage.app",
  messagingSenderId: "30033144275",
  appId: "1:30033144275:web:f519256d2e1897209a2726"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();