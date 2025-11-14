// For Firebase JS SDK v9+
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';
// Use safe AsyncStorage wrapper to prevent native module crashes
import AsyncStorage from './SafeAsyncStorage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVSgLaHBAkiNXzh3pMnZH5jzfWF3_4MFk",
  authDomain: "raksha-ireland-d8840.firebaseapp.com",
  projectId: "raksha-ireland-d8840",
  storageBucket: "raksha-ireland-d8840.firebasestorage.app",
  messagingSenderId: "389947725848",
  appId: "1:389947725848:web:cc454e803f39147d5ff06d",
  measurementId: "G-0SK2JRMNGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (only on web)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize FCM (only on web/admin)
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app);
}

export { auth, db, messaging, analytics };
export default app;