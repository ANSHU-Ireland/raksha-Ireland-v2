// Safe AsyncStorage implementation that handles native module crashes
const SafeAsyncStorage = {
  getItem: async (key) => {
    try {
      // Try to use the native module
      const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorageModule.getItem(key);
    } catch (error) {
      console.warn('AsyncStorage getItem failed:', error.message);
      // Fallback to in-memory storage for development
      if (global.__DEV_STORAGE__) {
        return global.__DEV_STORAGE__[key] || null;
      }
      return null;
    }
  },
  
  setItem: async (key, value) => {
    try {
      const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorageModule.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage setItem failed:', error.message);
      // Fallback to in-memory storage for development
      if (!global.__DEV_STORAGE__) {
        global.__DEV_STORAGE__ = {};
      }
      global.__DEV_STORAGE__[key] = value;
      return;
    }
  },
  
  removeItem: async (key) => {
    try {
      const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorageModule.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage removeItem failed:', error.message);
      // Fallback to in-memory storage for development
      if (global.__DEV_STORAGE__) {
        delete global.__DEV_STORAGE__[key];
      }
      return;
    }
  },
  
  multiGet: async (keys) => {
    try {
      const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
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
      const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorageModule.multiSet(keyValuePairs);
    } catch (error) {
      console.warn('AsyncStorage multiSet failed:', error.message);
      // Fallback to in-memory storage
      if (!global.__DEV_STORAGE__) {
        global.__DEV_STORAGE__ = {};
      }
      for (const [key, value] of keyValuePairs) {
        global.__DEV_STORAGE__[key] = value;
      }
      return;
    }
  },
  
  clear: async () => {
    try {
      const AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorageModule.clear();
    } catch (error) {
      console.warn('AsyncStorage clear failed:', error.message);
      global.__DEV_STORAGE__ = {};
      return;
    }
  }
};

export default SafeAsyncStorage;