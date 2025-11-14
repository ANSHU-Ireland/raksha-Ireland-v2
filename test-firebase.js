// Firebase Connection Test
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Testing Firebase Connection...');

// Test 1: Firebase App Initialization
try {
  console.log('✅ Firebase app initialized successfully');
  console.log('📱 Project ID:', app.options.projectId);
} catch (error) {
  console.error('❌ Firebase app initialization failed:', error);
}

// Test 2: Firestore Connection
try {
  await setDoc(doc(db, 'test', 'connection'), {
    message: 'Firebase connection test',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
  console.log('✅ Firestore connection successful');
} catch (error) {
  console.error('❌ Firestore connection failed:', error);
  console.log('🔍 Make sure Firestore is enabled in Firebase Console');
}

console.log('🚀 Firebase setup test completed!');
console.log('📝 Next steps:');
console.log('   1. Enable Authentication in Firebase Console');
console.log('   2. Create Firestore Database in Firebase Console');
console.log('   3. Enable Cloud Messaging in Firebase Console');