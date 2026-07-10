import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDC6boaWXEYNNoWMDl8IHZK1ayYPxHhNEc",
  authDomain: "global-jersey-store.firebaseapp.com",
  projectId: "global-jersey-store",
  storageBucket: "global-jersey-store.firebasestorage.app",
  messagingSenderId: "145387602454",
  appId: "1:145387602454:web:5b91159ab966911d9e2b37",
  measurementId: "G-JS0M4H3DHW",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
