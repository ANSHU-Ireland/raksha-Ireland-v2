# Raksha Ireland - Emergency SOS System

A minimalist emergency SOS system for mobile (iOS & Android) with an admin web panel. Users can send SOS alerts by holding a button for 3 seconds, which notifies nearby users within a 3km radius.

## Features

- **Mobile App (React Native)**: Cross-platform app for iOS and Android
- **Admin Panel (Next.js)**: Web-based admin interface for user approvals
- **Backend API (Node.js/Express)**: RESTful API with Socket.IO for real-time alerts
- **Location-based Alerts**: SOS alerts sent to users within 3km radius
- **User Approval System**: Admin approval required before users can access the app
- **Low Bandwidth Optimized**: Minimal data transfer, efficient API design
- **Minimalist Design**: Clean, simple UI with maximum 2-3 colors

## Project Structure

```
.
├── backend/          # Node.js/Express API server
├── mobile/           # React Native mobile app
├── admin/            # Next.js admin panel
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
APP_URL=http://localhost:3001

# Optional: Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@raksha.ie
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:3000`

**Default Admin Credentials:**
- Email: `admin@raksha.ie`
- Password: `admin123`

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/config/api.js` if needed (defaults to `http://localhost:3000/api`)

4. Start Expo:
```bash
npm start
```

5. Scan QR code with Expo Go app (iOS) or Expo Go (Android)

**Note:** For physical devices, update the API URL to your computer's IP address (e.g., `http://192.168.1.100:3000/api`)

### Admin Panel Setup

1. Navigate to admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

The admin panel will run on `http://localhost:3000` (or next available port)

## User Flow

1. **Registration**: User installs app and fills registration form (name, age, sex, county, email)
2. **Admin Approval**: Admin reviews and approves/rejects user in admin panel
3. **Password Setup**: Approved user receives email with link to set password
4. **Login**: User logs in with email and password
5. **SOS Alert**: User holds SOS button for 3 seconds to send alert
6. **Notification**: Nearby users (within 3km) receive real-time SOS alert

## Technology Stack

- **Backend**: Node.js, Express, SQLite, Socket.IO, Nodemailer
- **Mobile**: React Native, Expo, Socket.IO Client
- **Admin**: Next.js, React
- **Database**: SQLite (can be easily migrated to PostgreSQL/MySQL)

## Design Principles

- **Minimalism**: Maximum 2-3 colors (#1a1a1a, #666, #ffffff)
- **Generous Spacing**: Minimum 32px padding/margins
- **Clean Typography**: System fonts (Inter/SF Pro)
- **Simple Geometry**: Basic shapes, no unnecessary elements
- **Low Bandwidth**: Optimized API responses, minimal data transfer

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/set-password` - Set password after approval
- `POST /api/auth/admin/login` - Admin login

### Users
- `GET /api/users/profile` - Get user profile
- `POST /api/users/location` - Update user location

### SOS
- `POST /api/sos/alert` - Send SOS alert
- `GET /api/sos/recent` - Get recent alerts

### Admin
- `GET /api/admin/pending-users` - Get pending users
- `GET /api/admin/users` - Get all users
- `POST /api/admin/approve-user/:userId` - Approve user
- `POST /api/admin/reject-user/:userId` - Reject user
- `GET /api/admin/stats` - Get statistics

## Development Notes

- The app uses Socket.IO for real-time SOS alerts
- Location is updated every 30 seconds when app is active
- Email service is optional - if not configured, emails are logged to console
- Database is SQLite for simplicity - can be migrated to production database
- All API responses are optimized for low bandwidth

## Production Deployment

1. **Backend**: Deploy to services like Heroku, Railway, or AWS
2. **Mobile**: Build with Expo EAS Build for iOS and Android
3. **Admin**: Deploy Next.js app to Vercel or similar
4. **Database**: Migrate to PostgreSQL or MySQL for production
5. **Email**: Configure proper SMTP service (SendGrid, AWS SES, etc.)
6. **Security**: Update JWT_SECRET and use environment variables

## Future Development Plans

### UI/UX Enhancement Plan

#### Mobile App UI Improvements
1. **SOS Button Enhancement**
   - Add visual feedback during 3-second hold (progress ring/circle)
   - Implement haptic feedback at key intervals (1s, 2s, 3s)
   - Add countdown animation/text during hold
   - Visual confirmation when SOS is sent (success animation)

2. **Onboarding Flow**
   - Welcome screen with app purpose explanation
   - Permission request screens (location, notifications) with clear explanations
   - Tutorial overlay for first-time users showing SOS button usage

3. **Alert Management**
   - In-app notification center for received SOS alerts
   - Map view showing SOS alert locations
   - Ability to mark alerts as "responded" or "acknowledged"
   - Alert history screen

4. **Profile & Settings**
   - Edit profile information
   - Notification preferences
   - Location sharing toggle
   - Emergency contacts section
   - App version and about information

5. **Visual Polish**
   - Loading states with skeleton screens
   - Smooth transitions between screens
   - Error states with helpful messages
   - Empty states with illustrations
   - Consistent iconography using SF Symbols (iOS) / Material Icons (Android)

6. **Accessibility**
   - VoiceOver/TalkBack support
   - High contrast mode support
   - Larger text support
   - Color-blind friendly design

#### Admin Panel UI Improvements
1. **Dashboard Enhancements**
   - Interactive charts for statistics (Chart.js or Recharts)
   - Real-time SOS alert feed
   - Map visualization of active users and alerts
   - Activity timeline

2. **User Management**
   - Advanced filtering and search
   - Bulk actions (approve/reject multiple users)
   - User activity logs
   - Export user data (CSV/Excel)

3. **Alert Management**
   - Real-time alert monitoring
   - Alert details with map view
   - Response tracking
   - Alert analytics

4. **UI Components**
   - Toast notifications for actions
   - Modal dialogs for confirmations
   - Data tables with sorting/pagination
   - Responsive design improvements

### Firebase Integration Plan

#### Phase 1: Authentication Migration
1. **Replace Current Auth with Firebase Auth**
   - Install Firebase SDK in mobile app and admin panel
   - Migrate user authentication to Firebase Authentication
   - Implement email/password authentication
   - Add password reset functionality via Firebase
   - Maintain admin authentication separately or use Firebase Custom Claims

2. **User Management**
   - Store user profile data in Firestore
   - Sync with existing database structure
   - Implement real-time user status updates

#### Phase 2: Firestore Database Migration
1. **Database Structure**
   - Create Firestore collections:
     - `users` - User profiles and information
     - `sos_alerts` - SOS alert records
     - `admins` - Admin user accounts
     - `settings` - App configuration
   
2. **Data Migration**
   - Export existing SQLite data
   - Transform and import to Firestore
   - Set up proper indexes for queries
   - Implement data validation rules

3. **Real-time Updates**
   - Replace Socket.IO with Firestore real-time listeners
   - Implement real-time SOS alert notifications
   - Real-time location updates using Firestore

#### Phase 3: Firebase Cloud Functions
1. **Backend Logic Migration**
   - Move Express API routes to Cloud Functions
   - Implement HTTP-triggered functions for API endpoints
   - Set up authentication middleware for functions

2. **Background Jobs**
   - Email sending via Cloud Functions
   - Location-based alert matching
   - Data cleanup and maintenance tasks
   - Analytics and reporting

#### Phase 4: Firebase Services Integration
1. **Cloud Messaging (FCM)**
   - Replace Socket.IO notifications with FCM
   - Implement push notifications for SOS alerts
   - Background notification handling
   - Notification channels and priorities

2. **Firebase Storage**
   - Store user profile pictures (if added)
   - Store emergency documents
   - Optimize image uploads and caching

3. **Firebase Analytics**
   - Track app usage and user behavior
   - Monitor SOS alert patterns
   - Performance monitoring
   - Crash reporting

4. **Firebase Hosting (Optional)**
   - Host admin panel on Firebase Hosting
   - Custom domain setup
   - CDN benefits

#### Phase 5: Security & Performance
1. **Security Rules**
   - Set up Firestore security rules
   - Implement proper access controls
   - Protect sensitive user data

2. **Performance Optimization**
   - Implement data pagination
   - Optimize queries with proper indexes
   - Cache frequently accessed data
   - Implement offline support

### Web Hosting Plan (Admin Panel)

#### Option 1: Vercel (Recommended)
1. **Setup Steps**
   - Connect GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Set build command: `npm run build`
   - Set output directory: `.next`
   - Configure custom domain (optional)

2. **Configuration**
   - Add `NEXT_PUBLIC_API_URL` environment variable
   - Set up production API URL
   - Configure automatic deployments from main branch
   - Enable preview deployments for PRs

3. **Benefits**
   - Free tier available
   - Automatic SSL certificates
   - Global CDN
   - Easy rollback capabilities

#### Option 2: Netlify
1. **Setup Steps**
   - Connect repository to Netlify
   - Configure build settings
   - Set environment variables
   - Deploy

2. **Configuration**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Environment variables setup

#### Option 3: Firebase Hosting
1. **Setup Steps**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Initialize Firebase in admin directory
   - Build Next.js app: `npm run build && npm run export`
   - Deploy: `firebase deploy`

2. **Configuration**
   - Configure `firebase.json` for Next.js
   - Set up rewrites for client-side routing
   - Configure environment variables

#### Option 4: AWS Amplify
1. **Setup Steps**
   - Connect repository to AWS Amplify
   - Configure build settings
   - Set environment variables
   - Deploy

### App Store & Play Store Deployment Plan

#### iOS App Store Deployment

1. **Prerequisites**
   - Apple Developer Account ($99/year)
   - Mac computer for building
   - Xcode installed
   - App Store Connect account setup

2. **Preparation Steps**
   - Update `app.json` with proper app information:
     - App name, description, keywords
     - Bundle identifier (already set: `ie.raksha.app`)
     - Version and build numbers
     - App icons and splash screens
     - Privacy policy URL
   
3. **Build Process with Expo EAS**
   ```bash
   # Install EAS CLI
   npm install -g eas-cli
   
   # Login to Expo
   eas login
   
   # Configure EAS
   eas build:configure
   
   # Build for iOS
   eas build --platform ios
   ```

4. **App Store Connect Setup**
   - Create app in App Store Connect
   - Fill in app information:
     - Name: "Raksha Ireland"
     - Category: Medical/Health & Fitness
     - Age rating: 4+ (or appropriate)
     - Privacy policy URL
     - Support URL
     - App description and screenshots
   - Set up pricing (Free)
   - Configure App Store listing

5. **Submission Process**
   - Upload build via EAS Submit or Xcode
   - Complete App Store Connect information
   - Submit for review
   - Respond to review feedback if needed

6. **Required Assets**
   - App icon (1024x1024px)
   - Screenshots for different device sizes:
     - iPhone 6.7" (1290x2796px)
     - iPhone 6.5" (1284x2778px)
     - iPhone 5.5" (1242x2208px)
   - App preview videos (optional)
   - Privacy policy document

#### Google Play Store Deployment

1. **Prerequisites**
   - Google Play Developer Account ($25 one-time fee)
   - Google account

2. **Preparation Steps**
   - Update `app.json` with Android-specific info:
     - Package name (already set: `ie.raksha.app`)
     - Version code and version name
     - App icons and adaptive icons
     - Permissions justification

3. **Build Process with Expo EAS**
   ```bash
   # Build for Android
   eas build --platform android
   
   # Or build Android App Bundle (recommended)
   eas build --platform android --type app-bundle
   ```

4. **Google Play Console Setup**
   - Create app in Google Play Console
   - Fill in store listing:
     - App name: "Raksha Ireland"
     - Short description (80 chars)
     - Full description (4000 chars)
     - Category: Medical/Health & Fitness
     - Content rating questionnaire
     - Privacy policy URL
   - Set up app content:
     - Age rating
     - Target audience
     - Content guidelines compliance

5. **Submission Process**
   - Upload AAB (Android App Bundle) file
   - Complete store listing
   - Set up pricing (Free)
   - Create release notes
   - Submit for review

6. **Required Assets**
   - App icon (512x512px)
   - Feature graphic (1024x500px)
   - Screenshots:
     - Phone (16:9 or 9:16)
     - Tablet (7" and 10")
   - Privacy policy document

#### Post-Deployment

1. **Monitoring**
   - Set up crash reporting (Firebase Crashlytics)
   - Monitor app analytics
   - Track user feedback and ratings
   - Monitor API performance

2. **Updates**
   - Use EAS Update for over-the-air updates (JavaScript changes)
   - Submit new builds for native changes
   - Maintain version history
   - Test updates thoroughly before release

3. **Maintenance**
   - Regular security updates
   - Bug fixes and improvements
   - Feature additions
   - Compliance with store policies

## License

Free to use - Emergency SOS System

