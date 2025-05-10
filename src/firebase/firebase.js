import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
});

const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Debug mode for development
if (import.meta.env.DEV) {
  window.localStorage.setItem("firebase:debug", "*");
}

export { app, db, auth, storage, googleProvider };
