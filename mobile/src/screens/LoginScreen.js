import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigation.replace('Home');
    } else {
      Alert.alert('Error', result.error || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Raksha Ireland</Text>
        <Text style={styles.subtitle}>Emergency SOS System</Text>
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
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Don't have an account? Register</Text>
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
    fontFamily: 'System'
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
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center'
  },
  linkText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System'
  }
});

