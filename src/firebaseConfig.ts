import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfF3LMsVPentkNqrunmbty8lLuRegub-Q",
  authDomain: "minstagram1.firebaseapp.com",
  projectId: "minstagram1",
  storageBucket: "minstagram1.appspot.com",
  messagingSenderId: "331555873109",
  appId: "1:331555873109:web:0a7db8571af2f95e384fdc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the initialized services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
