// Safe AsyncStorage implementation for Firebase auth persistence
// This prevents TurboModuleRegistry crashes during development builds
const createSafeAsyncStorage = () => {
  return {
    getItem: async (key) => {
      try {
        const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorageModule.getItem(key);
      } catch (error) {
        console.warn('Firebase AsyncStorage getItem failed:', error.message);
        // Fallback to in-memory storage
        if (global.__FIREBASE_STORAGE__) {
          return global.__FIREBASE_STORAGE__[key] || null;
        }
        return null;
      }
    },
    
    setItem: async (key, value) => {
      try {
        const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorageModule.setItem(key, value);
      } catch (error) {
        console.warn('Firebase AsyncStorage setItem failed:', error.message);
        // Fallback to in-memory storage
        if (!global.__FIREBASE_STORAGE__) {
          global.__FIREBASE_STORAGE__ = {};
        }
        global.__FIREBASE_STORAGE__[key] = value;
      }
    },
    
    removeItem: async (key) => {
      try {
        const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorageModule.removeItem(key);
      } catch (error) {
        console.warn('Firebase AsyncStorage removeItem failed:', error.message);
        // Fallback to in-memory storage
        if (global.__FIREBASE_STORAGE__) {
          delete global.__FIREBASE_STORAGE__[key];
        }
      }
    }
  };
};

export default createSafeAsyncStorage();