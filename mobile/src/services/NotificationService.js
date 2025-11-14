import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase.config';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '../utils/SafeAsyncStorage';

class NotificationService {
  constructor() {
    this.initializeNotifications();
  }

  async initializeNotifications() {
    try {
      // Configure notification handling
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      // Request permissions
      await this.requestPermissions();
      
      // Get and store FCM token
      await this.getFCMToken();
      
      // Set up notification listeners
      this.setupNotificationListeners();
    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  }

  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Notification permission denied');
      }

      return finalStatus;
    } catch (error) {
      console.error('Request notification permissions error:', error);
      throw error;
    }
  }

  async getFCMToken() {
    try {
      let token;

      if (Platform.OS === 'web' && messaging) {
        // Web FCM token
        token = await getToken(messaging, {
          vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY
        });
      } else {
        // Mobile Expo push token
        const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
        });
        token = pushToken;
      }

      if (token) {
        await AsyncStorage.setItem('pushToken', token);
        console.log('Push token:', token);
      }

      return token;
    } catch (error) {
      console.error('Get FCM token error:', error);
      throw error;
    }
  }

  setupNotificationListeners() {
    try {
      // Notification received while app is foregrounded
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
        this.handleNotificationReceived(notification);
      });

      // User tapped on notification
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response:', response);
        this.handleNotificationResponse(response);
      });

      // FCM message listener (web only)
      if (Platform.OS === 'web' && messaging) {
        onMessage(messaging, (payload) => {
          console.log('FCM message received:', payload);
          this.handleFCMMessage(payload);
        });
      }
    } catch (error) {
      console.error('Setup notification listeners error:', error);
    }
  }

  handleNotificationReceived(notification) {
    const { data } = notification.request.content;
    
    if (data?.type === 'sos_alert') {
      // Handle SOS alert notification
      this.handleSOSAlert(data);
    } else if (data?.type === 'approval_status') {
      // Handle approval status notification
      this.handleApprovalStatus(data);
    }
  }

  handleNotificationResponse(response) {
    const { data } = response.notification.request.content;
    
    // Navigate to appropriate screen based on notification type
    if (data?.type === 'sos_alert') {
      // Navigate to SOS alerts screen or map
      console.log('Navigate to SOS alert:', data);
    } else if (data?.type === 'approval_status') {
      // Navigate to profile or login screen
      console.log('Navigate to approval status:', data);
    }
  }

  handleFCMMessage(payload) {
    // Handle FCM message for web
    const { notification, data } = payload;
    
    // Display notification
    this.displayLocalNotification({
      title: notification.title,
      body: notification.body,
      data: data
    });
  }

  handleSOSAlert(data) {
    // Play alert sound, vibrate, show emergency notification
    this.playEmergencyAlert();
    
    // Trigger app-specific SOS alert handling
    if (this.onSOSAlert) {
      this.onSOSAlert(data);
    }
  }

  handleApprovalStatus(data) {
    // Handle user approval status changes
    if (this.onApprovalStatusChange) {
      this.onApprovalStatusChange(data);
    }
  }

  async playEmergencyAlert() {
    try {
      // Vibrate for emergency
      if (Platform.OS !== 'web') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🚨 Emergency Alert',
            body: 'SOS alert in your area',
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null, // Show immediately
        });
      }
    } catch (error) {
      console.error('Play emergency alert error:', error);
    }
  }

  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Send local notification error:', error);
    }
  }

  async displayLocalNotification({ title, body, data }) {
    try {
      await this.sendLocalNotification(title, body, data);
    } catch (error) {
      console.error('Display local notification error:', error);
    }
  }

  // Event handlers (to be set by the app)
  setSOSAlertHandler(handler) {
    this.onSOSAlert = handler;
  }

  setApprovalStatusHandler(handler) {
    this.onApprovalStatusChange = handler;
  }

  async getStoredPushToken() {
    try {
      return await AsyncStorage.getItem('pushToken');
    } catch (error) {
      console.error('Get stored push token error:', error);
      return null;
    }
  }

  async clearStoredToken() {
    try {
      await AsyncStorage.removeItem('pushToken');
    } catch (error) {
      console.error('Clear stored token error:', error);
    }
  }
}

export default new NotificationService();