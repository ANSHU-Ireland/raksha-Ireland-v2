// Native Module Polyfills - Load this before any other imports
// This prevents TurboModuleRegistry.getEnforcing crashes

import { TurboModuleRegistry } from 'react-native';

// Store original getEnforcing function
const originalGetEnforcing = TurboModuleRegistry.getEnforcing;

// Override getEnforcing to handle missing modules gracefully
TurboModuleRegistry.getEnforcing = function(name) {
  try {
    return originalGetEnforcing.call(this, name);
  } catch (error) {
    // Handle specific missing modules
    if (name === 'RNEdgeToEdge') {
      console.warn(`Missing native module: ${name} - Using polyfill`);
      return {
        setStatusBarStyle: () => {},
        setNavigationBarStyle: () => {},
        setBackgroundColor: () => {},
        setSystemUIOverlayStyle: () => {},
        getSystemUIOverlayStyle: () => ({}),
        isAvailable: () => false,
      };
    }
    
    if (name === 'RNCAsyncStorage') {
      console.warn(`Missing native module: ${name} - Using polyfill`);
      return {
        getItem: (key) => Promise.resolve(null),
        setItem: (key, value) => Promise.resolve(),
        removeItem: (key) => Promise.resolve(),
        mergeItem: (key, value) => Promise.resolve(),
        clear: () => Promise.resolve(),
        getAllKeys: () => Promise.resolve([]),
        multiGet: (keys) => Promise.resolve(keys.map(k => [k, null])),
        multiSet: (keyValuePairs) => Promise.resolve(),
        multiRemove: (keys) => Promise.resolve(),
        multiMerge: (keyValuePairs) => Promise.resolve(),
      };
    }
    
    // For other missing modules, log warning and return empty object
    console.warn(`Missing native module: ${name} - Using empty polyfill`);
    return {};
  }
};

console.log('✅ Native module polyfills loaded successfully');