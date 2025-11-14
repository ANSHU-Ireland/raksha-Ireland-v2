import Constants from 'expo-constants';

// Get API URL from environment or config
const getApiUrl = () => {
  // Check for environment variable first (for production builds)
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }
  
  // Check for process.env (EAS build)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Development fallback - use your computer's IP for physical devices
  // For Android emulator, use 10.0.2.2 instead of localhost
  // For iOS simulator, localhost works
  // For physical devices, replace with your computer's IP address
  // Example: 'http://192.168.1.100:3000/api'
  if (__DEV__) {
    // Try to detect platform and use appropriate URL
    const platform = Constants.platform?.ios ? 'ios' : 'android';
    
    // IMPORTANT: For Android physical device, uncomment and set your IP:
    // const PHYSICAL_DEVICE_IP = '192.168.1.100'; // Replace with your computer's IP
    // if (platform === 'android') {
    //   return `http://${PHYSICAL_DEVICE_IP}:3000/api`;
    // }
    
    if (platform === 'android') {
      // For Android emulator, use 10.0.2.2
      // For physical device, uncomment above and set your IP
      return 'http://10.0.2.2:3000/api'; // Android emulator
    }
    return 'http://localhost:3000/api'; // iOS simulator or web
  }
  
  // Production fallback
  return 'https://your-production-api.com/api';
};

export const API_URL = getApiUrl();

// Log API URL in development for debugging
if (__DEV__) {
  console.log('API URL:', API_URL);
}

export default API_URL;

