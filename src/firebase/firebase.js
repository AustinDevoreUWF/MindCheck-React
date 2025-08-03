import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyA7Zj04vOOif_dMcKzLg1_59GXEKuARPvk",
  authDomain: "mind-check-5cb95.firebaseapp.com",
  projectId: "mind-check-5cb95",
  storageBucket: "mind-check-5cb95.firebasestorage.app",
  messagingSenderId: "72720386520",
  appId: "1:72720386520:web:c30530a5f010b06a734aad"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export const auth = getAuth(app);
export { db };

onAuthStateChanged(auth, (user)=>{
  if(!user){
    signInAnonymously(auth).catch((error)=>{
      console.error("Anonymous sign-in failed: ", error);
    });
  }
});