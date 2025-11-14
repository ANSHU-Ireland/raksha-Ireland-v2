import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const counties = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Derry',
  'Donegal', 'Down', 'Dublin', 'Fermanagh', 'Galway', 'Kerry',
  'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford',
  'Louth', 'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon',
  'Sligo', 'Tipperary', 'Tyrone', 'Waterford', 'Westmeath',
  'Wexford', 'Wicklow'
];

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    county: '',
    email: ''
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.sex || !formData.county || !formData.email) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        'Registration successful! Please wait for admin approval. You will receive an email when approved.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Error', result.error || 'Registration failed');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Raksha Ireland</Text>
        <Text style={styles.subtitle}>Emergency SOS System</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
        />

        <View style={styles.sexContainer}>
          <TouchableOpacity
            style={[
              styles.sexButton,
              styles.sexButtonLeft,
              formData.sex === 'Male' && styles.sexButtonActive
            ]}
            onPress={() => setFormData({ ...formData, sex: 'Male' })}
          >
            <Text style={[
              styles.sexButtonText,
              formData.sex === 'Male' && styles.sexButtonTextActive
            ]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexButton,
              styles.sexButtonMiddle,
              formData.sex === 'Female' && styles.sexButtonActive
            ]}
            onPress={() => setFormData({ ...formData, sex: 'Female' })}
          >
            <Text style={[
              styles.sexButtonText,
              formData.sex === 'Female' && styles.sexButtonTextActive
            ]}>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexButton,
              styles.sexButtonRight,
              formData.sex === 'Other' && styles.sexButtonActive
            ]}
            onPress={() => setFormData({ ...formData, sex: 'Other' })}
          >
            <Text style={[
              styles.sexButtonText,
              formData.sex === 'Other' && styles.sexButtonTextActive
            ]}>Other</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.countyContainer}>
          <ScrollView style={styles.countyScroll}>
            {counties.map((county) => (
              <TouchableOpacity
                key={county}
                style={[
                  styles.countyButton,
                  formData.county === county && styles.countyButtonActive
                ]}
                onPress={() => setFormData({ ...formData, county })}
              >
                <Text style={[
                  styles.countyButtonText,
                  formData.county === county && styles.countyButtonTextActive
                ]}>{county}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  content: {
    padding: 32,
    paddingTop: 64
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
  sexContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sexButton: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  sexButtonLeft: {
    marginRight: 4
  },
  sexButtonMiddle: {
    marginHorizontal: 4
  },
  sexButtonRight: {
    marginLeft: 4
  },
  sexButtonActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a'
  },
  sexButtonText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'System'
  },
  sexButtonTextActive: {
    color: '#ffffff'
  },
  countyContainer: {
    maxHeight: 200,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  countyScroll: {
    padding: 8
  },
  countyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 4
  },
  countyButtonActive: {
    backgroundColor: '#1a1a1a'
  },
  countyButtonText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'System'
  },
  countyButtonTextActive: {
    color: '#ffffff'
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

