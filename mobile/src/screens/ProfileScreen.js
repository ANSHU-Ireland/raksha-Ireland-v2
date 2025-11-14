import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      setProfile(response.data.user);
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile?.name || user?.name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile?.email || user?.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{profile?.age}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Sex</Text>
          <Text style={styles.value}>{profile?.sex}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>County</Text>
          <Text style={styles.value}>{profile?.county || user?.county}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{profile?.status}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  header: {
    padding: 32,
    paddingTop: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'System'
  },
  content: {
    padding: 32
  },
  field: {
    marginBottom: 32,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'System'
  },
  value: {
    fontSize: 18,
    color: '#1a1a1a',
    fontFamily: 'System'
  }
});

