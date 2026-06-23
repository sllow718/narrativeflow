// Firebase configuration for NarrativeFlow analytics
// Values are loaded from environment variables via Vite (import.meta.env)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PLACEHOLDER",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "PLACEHOLDER",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "PLACEHOLDER",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "PLACEHOLDER",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "PLACEHOLDER",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "PLACEHOLDER",
};

let db = null;

export function getDb() {
  if (!db) {
    throw new Error("Firestore not initialized. Call initFirebase() first.");
  }
  return db;
}

export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  return db;
}

export default firebaseConfig;
