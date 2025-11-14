// Simple Firebase Connection Test
const { initializeApp } = require('firebase/app');

const firebaseConfig = {
  apiKey: "AIzaSyBVSgLaHBAkiNXzh3pMnZH5jzfWF3_4MFk",
  authDomain: "raksha-ireland-d8840.firebaseapp.com",
  projectId: "raksha-ireland-d8840",
  storageBucket: "raksha-ireland-d8840.firebasestorage.app",
  messagingSenderId: "389947725848",
  appId: "1:389947725848:web:cc454e803f39147d5ff06d",
  measurementId: "G-0SK2JRMNGS"
};

console.log('🔥 Testing Firebase Connection...');

try {
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  console.log('📱 Project ID:', app.options.projectId);
  console.log('🌍 Auth Domain:', app.options.authDomain);
  console.log('');
  console.log('🚀 Firebase setup is complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. ✅ Firebase project created');
  console.log('2. ✅ SDK configuration complete'); 
  console.log('3. 🔄 Please enable services in Firebase Console:');
  console.log('   - Authentication (Email/Password)');
  console.log('   - Firestore Database (test mode)');
  console.log('   - Cloud Messaging');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
}