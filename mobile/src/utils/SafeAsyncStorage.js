// Safe AsyncStorage implementation that handles native module crashes
import AsyncStorageModule from '@react-native-async-storage/async-storage';

// Initialize in-memory fallback storage
if (!global.__DEV_STORAGE__) {
  global.__DEV_STORAGE__ = {};
}

const SafeAsyncStorage = {
  getItem: async (key) => {
    try {
      return await AsyncStorageModule.getItem(key);
    } catch (error) {
      console.warn('AsyncStorage getItem failed:', error.message);
      // Fallback to in-memory storage for development
      return global.__DEV_STORAGE__[key] || null;
    }
  },
  
  setItem: async (key, value) => {
    try {
      await AsyncStorageModule.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage setItem failed:', error.message);
      // Fallback to in-memory storage for development
      global.__DEV_STORAGE__[key] = value;
    }
  },
  
  removeItem: async (key) => {
    try {
      await AsyncStorageModule.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage removeItem failed:', error.message);
      // Fallback to in-memory storage for development
      delete global.__DEV_STORAGE__[key];
    }
  },
  
  multiGet: async (keys) => {
    try {
      return await AsyncStorageModule.multiGet(keys);
    } catch (error) {
      console.warn('AsyncStorage multiGet failed:', error.message);
      // Fallback to in-memory storage
      const result = [];
      for (const key of keys) {
        const value = global.__DEV_STORAGE__?.[key] || null;
        result.push([key, value]);
      }
      return result;
    }
  },
  
  multiSet: async (keyValuePairs) => {
    try {
      await AsyncStorageModule.multiSet(keyValuePairs);
    } catch (error) {
      console.warn('AsyncStorage multiSet failed:', error.message);
      // Fallback to in-memory storage
      for (const [key, value] of keyValuePairs) {
        global.__DEV_STORAGE__[key] = value;
      }
    }
  },
  
  clear: async () => {
    try {
      await AsyncStorageModule.clear();
    } catch (error) {
      console.warn('AsyncStorage clear failed:', error.message);
    }
    global.__DEV_STORAGE__ = {};
  }
};

export default SafeAsyncStorage;