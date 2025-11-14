import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_URL } from '../config/api';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import * as Notifications from 'expo-notifications';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (user) {
      connectSocket();
      startLocationTracking();
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const connectSocket = () => {
    try {
      const socketUrl = API_URL.replace('/api', '');
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        if (location && user) {
          newSocket.emit('register-location', {
            userId: user.id,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
        }
      });

      newSocket.on('connect_error', (error) => {
        console.warn('Socket connection error:', error.message);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      newSocket.on('sos-alert', async (alertData) => {
        try {
          // Show notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'SOS Alert',
              body: `${alertData.userName} needs help nearby!`,
              data: alertData
            },
            trigger: null
          });
        } catch (error) {
          console.error('Notification error:', error);
        }
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Socket setup error:', error);
    }
  };

  const startLocationTracking = async () => {
    try {
      // Check if location services are enabled
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
        maximumAge: 60000
      });
      setLocation(currentLocation);
      updateLocationOnServer(currentLocation);
    } catch (error) {
      console.error('Location error:', error);
      // Try to get last known location as fallback
      try {
        const lastLocation = await Location.getLastKnownPositionAsync();
        if (lastLocation) {
          setLocation(lastLocation);
          updateLocationOnServer(lastLocation);
        }
      } catch (fallbackError) {
        console.error('Fallback location error:', fallbackError);
      }
    }
  };

  const updateLocationOnServer = async (loc) => {
    if (!user) return;

    try {
      await axios.post(`${API_URL}/users/location`, {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });

      if (socket && socket.connected) {
        socket.emit('register-location', {
          userId: user.id,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });
      }
    } catch (error) {
      console.error('Update location error:', error);
    }
  };

  const sendSOS = async () => {
    if (!location || !user) {
      return { success: false, error: 'Location not available' };
    }

    try {
      const response = await axios.post(`${API_URL}/sos/alert`, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send SOS'
      };
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        sendSOS,
        updateLocation: startLocationTracking
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

