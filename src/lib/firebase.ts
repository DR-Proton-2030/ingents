import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGwTxi0AELPsq7llIAG8WPPNrampJ_6Xk",
  authDomain: "ingents.firebaseapp.com",
  projectId: "ingents",
  storageBucket: "ingents.firebasestorage.app",
  messagingSenderId: "422444521404",
  appId: "1:422444521404:web:80fb69c88ea042c022bdb9",
  measurementId: "G-RPRPMRCE2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional, check if supported)
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
