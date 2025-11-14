import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import * as Notifications from 'expo-notifications';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.5;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { location, sendSOS, updateLocation } = useLocation();
  const [pressing, setPressing] = useState(false);
  const [pressStartTime, setPressStartTime] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    updateLocation();
    const interval = setInterval(() => {
      updateLocation();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const alertData = notification.request.content.data;
        if (alertData) {
          Alert.alert(
            'SOS Alert',
            `${alertData.userName} needs help nearby!`,
            [
              { text: 'OK' }
            ]
          );
        }
      }
    );

    return () => subscription.remove();
  }, []);

  const handlePressIn = () => {
    setPressing(true);
    setPressStartTime(Date.now());
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const handlePressOut = () => {
    setPressing(false);
    setPressStartTime(null);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleLongPress = async () => {
    if (!location) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    const result = await sendSOS();
    if (result.success) {
      Alert.alert(
        'SOS Sent',
        `Your SOS alert has been sent to ${result.notifiedUsers} nearby users.`
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to send SOS');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileLink}>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Hold the button for 3 seconds to send SOS
        </Text>

        <TouchableOpacity
          style={styles.sosButtonContainer}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onLongPress={handleLongPress}
          delayLongPress={3000}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.sosButton,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim
              }
            ]}
          >
            <Text style={styles.sosButtonText}>SOS</Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            {location
              ? `Location: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
              : 'Getting location...'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 32
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'System'
  },
  profileLink: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'System'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
    fontFamily: 'System'
  },
  sosButtonContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sosButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#e0e0e0'
  },
  sosButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'System'
  },
  locationInfo: {
    marginTop: 48,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System'
  },
  logoutButton: {
    padding: 16,
    alignItems: 'center'
  },
  logoutText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System'
  }
});

