import Constants from 'expo-constants';

// Change this to your backend URL
export const API_URL = __DEV__ 
  ? (Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api')
  : 'https://your-production-api.com/api';

export default API_URL;

