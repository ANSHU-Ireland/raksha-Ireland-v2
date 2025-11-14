import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function SetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(route.params?.email || '');
  const [token, setToken] = useState(route.params?.token || '');
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetPassword = async () => {
    if (!email || !token || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await setPassword(email, token, password);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        'Password set successfully! You can now login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to set password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Password</Text>
        <Text style={styles.subtitle}>Create a secure password for your account</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!route.params?.email}
        />

        <TextInput
          style={styles.input}
          placeholder="Token"
          placeholderTextColor="#999"
          value={token}
          onChangeText={setToken}
          editable={!route.params?.token}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min 6 characters)"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPasswordValue}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Set Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 32,
    paddingTop: 64,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 48,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    fontFamily: 'System'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'System',
    textAlign: 'center'
  },
  form: {
    width: '100%'
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontFamily: 'System'
  },
  button: {
    height: 56,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System'
  }
});

