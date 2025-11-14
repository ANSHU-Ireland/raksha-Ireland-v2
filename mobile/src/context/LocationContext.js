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
    const socketUrl = API_URL.replace('/api', '');
    const newSocket = io(socketUrl, {
      transports: ['websocket'],
      reconnection: true
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      if (location) {
        newSocket.emit('register-location', {
          userId: user.id,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      }
    });

    newSocket.on('sos-alert', async (alertData) => {
      // Show notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'SOS Alert',
          body: `${alertData.userName} needs help nearby!`,
          data: alertData
        },
        trigger: null
      });
    });

    setSocket(newSocket);
  };

  const startLocationTracking = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      setLocation(currentLocation);
      updateLocationOnServer(currentLocation);
    } catch (error) {
      console.error('Location error:', error);
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

