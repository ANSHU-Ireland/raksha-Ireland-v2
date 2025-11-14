# Raksha Ireland Mobile App

React Native mobile application for the Emergency SOS System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `src/config/api.js`:
   - For development: Use your computer's IP address (e.g., `http://192.168.1.100:3000/api`)
   - For production: Use your production API URL

3. Start Expo:
```bash
npm start
```

4. Scan QR code with:
   - **iOS**: Camera app or Expo Go
   - **Android**: Expo Go app

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Features

- User registration with admin approval workflow
- Password setup after approval
- Location tracking
- SOS alert system (hold button for 3 seconds)
- Real-time notifications for nearby SOS alerts
- Profile management

## Permissions

The app requires:
- Location permissions (foreground)
- Push notification permissions

## Notes

- Location is updated every 30 seconds when app is active
- SOS alerts are sent to users within 3km radius
- Uses Socket.IO for real-time communication

