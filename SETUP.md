# Raksha Ireland v2 - Complete Setup Guide

## 🚀 Quick Start

This project includes a React Native mobile app, Next.js admin panel, and Node.js backend with Firebase integration, ready for App Store and Play Store deployment.

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- EAS CLI
- Firebase account
- Apple Developer account (for iOS)
- Google Play Developer account (for Android)

## 📱 Mobile App Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
npm install -g @expo/cli eas-cli
```

### 2. Configure Firebase
```bash
# Copy environment template
cp ../.env.example .env

# Edit .env with your Firebase configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase configs
```

### 3. Update EAS Configuration
Edit `eas.json`:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

### 4. Development
```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
```

### 5. Build for Production
```bash
# Login to Expo
expo login

# Build for both platforms
npm run build:all

# Or build individually
npm run build:android
npm run build:ios
```

### 6. Submit to App Stores
```bash
# Submit to Google Play
npm run submit:android

# Submit to App Store (requires Apple Developer account)
npm run submit:ios
```

## 🖥️ Admin Panel Setup

### 1. Install Dependencies
```bash
cd admin
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your configurations
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_API_URL=your_backend_url
```

### 3. Development
```bash
npm run dev        # Start development server
```

### 4. Build and Deploy
```bash
npm run build      # Build for production
npm run export     # Export static files

# Deploy options
npm run deploy:firebase   # Deploy to Firebase Hosting
npm run deploy:vercel     # Deploy to Vercel
npm run deploy:netlify    # Deploy to Netlify
```

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit with your configurations
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### 3. Development
```bash
npm start          # Start development server
npm run dev        # Start with nodemon
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable Authentication, Firestore, and Messaging

### 2. Configure Authentication
1. Enable Email/Password authentication
2. Add authorized domains for your app

### 3. Set up Firestore
1. Create Firestore database
2. Set up security rules
3. Create initial collections: `users`, `sosAlerts`

### 4. Configure Messaging
1. Generate VAPID key for web push
2. Add to environment variables

## 📦 Deployment

### Mobile App Deployment

#### iOS App Store
1. Enroll in Apple Developer Program
2. Create App Store Connect app
3. Configure app metadata
4. Submit via EAS: `npm run submit:ios`

#### Google Play Store
1. Create Google Play Developer account
2. Create app in Google Play Console
3. Configure app details
4. Submit via EAS: `npm run submit:android`

### Admin Panel Deployment

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run deploy:firebase
```

#### Vercel
```bash
npm install -g vercel
vercel login
npm run deploy:vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify login
npm run deploy:netlify
```

### Backend Deployment

#### Heroku
```bash
# Install Heroku CLI
heroku create raksha-backend
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
railway login
railway init
railway up
```

## 🔐 Security Configuration

### Environment Variables

#### Mobile App (.env)
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
EXPO_PUBLIC_API_URL=
```

#### Admin Panel (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_API_URL=
```

#### Backend (.env)
```
PORT=3000
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
JWT_SECRET=
```

## 📱 App Store Requirements

### iOS App Store
- App icons (1024x1024)
- Screenshots for all device sizes
- App description and keywords
- Privacy policy URL
- Support URL
- Age rating

### Google Play Store
- Feature graphic (1024x500)
- Screenshots
- App description
- Content rating
- Privacy policy

## 🚨 Features

### Mobile App
- ✅ Emergency SOS button (3-second hold)
- ✅ Location-based alerts (3km radius)
- ✅ Push notifications
- ✅ User registration with admin approval
- ✅ Firebase authentication
- ✅ Offline support
- ✅ Background location tracking

### Admin Panel
- ✅ User management
- ✅ User approval system
- ✅ SOS alert monitoring
- ✅ Analytics dashboard
- ✅ Real-time updates
- ✅ Export data functionality

### Backend
- ✅ RESTful API
- ✅ Socket.IO for real-time communication
- ✅ Firebase integration
- ✅ Location-based queries
- ✅ Push notification service
- ✅ User authentication middleware

## 📞 Support

For support and issues:
1. Check the README files in each directory
2. Review Firebase documentation
3. Check Expo documentation for mobile issues
4. Contact the development team

## 🔄 CI/CD

GitHub Actions workflows are configured for:
- Automatic admin panel deployment
- Mobile app building
- Backend testing

Make sure to set up the following GitHub secrets:
- `EXPO_TOKEN`
- `FIREBASE_TOKEN`
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- All Firebase environment variables

---

## 📋 Checklist for App Store Submission

### Pre-submission
- [ ] Test app thoroughly on physical devices
- [ ] Ensure all Firebase services are properly configured
- [ ] Add proper app icons and splash screens
- [ ] Test push notifications
- [ ] Verify location permissions work correctly
- [ ] Test SOS functionality end-to-end
- [ ] Ensure admin panel is deployed and accessible

### iOS App Store
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Create App Store Connect app
- [ ] Add app metadata and screenshots
- [ ] Configure App Store Connect with EAS
- [ ] Submit for review

### Google Play Store
- [ ] Create Google Play Developer account ($25 one-time)
- [ ] Create app in Google Play Console
- [ ] Upload APK/AAB via EAS
- [ ] Fill in store listing details
- [ ] Submit for review

Ready to deploy! 🚀