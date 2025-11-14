import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import AsyncStorage from '../utils/SafeAsyncStorage';

class FirebaseAuthService {
  // User Authentication
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: userData.name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        name: userData.name,
        phone: userData.phone,
        emergencyContact: userData.emergencyContact,
        isApproved: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Store token locally
      const token = await user.getIdToken();
      await AsyncStorage.setItem('firebaseToken', token);
      await AsyncStorage.setItem('userId', user.uid);

      return { user, success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is approved
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userDoc.data();
      if (!userData.isApproved) {
        throw new Error('Account pending approval from admin');
      }

      // Store token locally
      const token = await user.getIdToken();
      await AsyncStorage.setItem('firebaseToken', token);
      await AsyncStorage.setItem('userId', user.uid);

      return { user: userData, success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove(['firebaseToken', 'userId']);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async updateUserPassword(newPassword) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');
      
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  }

  // User Profile Management
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // SOS Alert Management
  async sendSOSAlert(alertData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const sosAlert = {
        userId: user.uid,
        userName: user.displayName,
        location: alertData.location,
        timestamp: serverTimestamp(),
        status: 'active',
        message: alertData.message || 'Emergency SOS Alert',
        type: 'sos'
      };

      const docRef = await addDoc(collection(db, 'sosAlerts'), sosAlert);
      
      // Update user's last SOS time
      await updateDoc(doc(db, 'users', user.uid), {
        lastSOSTime: serverTimestamp()
      });

      return { alertId: docRef.id, success: true };
    } catch (error) {
      console.error('Send SOS alert error:', error);
      throw error;
    }
  }

  async cancelSOSAlert(alertId) {
    try {
      await updateDoc(doc(db, 'sosAlerts', alertId), {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Cancel SOS alert error:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeToSOSAlerts(userLocation, radius = 3000, callback) {
    try {
      // Note: For production, you'd want to use GeoHash or similar for efficient geo queries
      const alertsRef = collection(db, 'sosAlerts');
      const q = query(
        alertsRef,
        where('status', '==', 'active')
      );

      return onSnapshot(q, (snapshot) => {
        const alerts = [];
        snapshot.forEach((doc) => {
          const alert = { id: doc.id, ...doc.data() };
          
          // Calculate distance (simple implementation)
          if (alert.location && userLocation) {
            const distance = this.calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              alert.location.latitude,
              alert.location.longitude
            );
            
            if (distance <= radius) {
              alert.distance = distance;
              alerts.push(alert);
            }
          }
        });
        
        callback(alerts);
      });
    } catch (error) {
      console.error('Subscribe to SOS alerts error:', error);
      throw error;
    }
  }

  // Utility methods
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  async getAuthToken() {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return await AsyncStorage.getItem('firebaseToken');
    } catch (error) {
      console.error('Get auth token error:', error);
      return null;
    }
  }
}

export default new FirebaseAuthService();