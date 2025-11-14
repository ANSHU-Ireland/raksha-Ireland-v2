import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

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

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Messaging (only in browser)
export const messaging = typeof window !== 'undefined' && isSupported() ? getMessaging(app) : null;

// Initialize Analytics (only in browser and when supported)
export const analytics = typeof window !== 'undefined' && isAnalyticsSupported() ? getAnalytics(app) : null;

export default app;