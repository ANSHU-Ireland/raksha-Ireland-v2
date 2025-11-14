# Production Setup Guide

## Backend Production Setup

### 1. Environment Variables

Create a `.env` file in the `backend` directory:

```bash
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters-long
ALLOWED_ORIGINS=https://your-admin-domain.com,https://your-mobile-app-domain.com
APP_URL=https://your-admin-domain.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@raksha.ie
```

### 2. Security Checklist

- [ ] Change JWT_SECRET to a strong random string (minimum 32 characters)
- [ ] Set ALLOWED_ORIGINS to your actual domains (no wildcards in production)
- [ ] Use HTTPS for all connections
- [ ] Set up proper database backups
- [ ] Configure firewall rules
- [ ] Enable rate limiting (consider adding express-rate-limit)
- [ ] Set up monitoring and logging

### 3. Database Migration

For production, consider migrating from SQLite to PostgreSQL or MySQL:

1. Install database driver:
```bash
npm install pg  # for PostgreSQL
# or
npm install mysql2  # for MySQL
```

2. Update `backend/database.js` with production connection
3. Run migrations to create tables

### 4. Deployment Options

#### Option A: Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### Option B: Heroku
```bash
heroku create raksha-backend
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

#### Option C: AWS/DigitalOcean
- Use PM2 for process management
- Set up Nginx reverse proxy
- Configure SSL with Let's Encrypt

## Mobile App Production Setup

### 1. Update API URL

In `mobile/src/config/api.js`, update the production URL:
```javascript
return 'https://your-production-api.com/api';
```

Or set via EAS environment variables:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://your-api.com/api
```

### 2. Build for Production

#### iOS
```bash
cd mobile
eas build --platform ios --profile production
```

#### Android
```bash
eas build --platform android --profile production
```

### 3. Submit to Stores

#### App Store
```bash
eas submit --platform ios
```

#### Play Store
```bash
eas submit --platform android
```

## Testing Checklist

### Backend
- [ ] Health check endpoint works: `/api/health`
- [ ] User registration works
- [ ] Admin approval workflow works
- [ ] SOS alerts are sent correctly
- [ ] Socket.IO connections work
- [ ] Error handling works properly
- [ ] Database operations are fast

### Mobile App
- [ ] App launches without errors
- [ ] Registration form works
- [ ] Login works
- [ ] Location permissions are requested
- [ ] SOS button works (hold for 3 seconds)
- [ ] Notifications are received
- [ ] Works on both iOS and Android
- [ ] Works with physical devices (not just simulators)

## Common Issues and Fixes

### Issue: "Cannot connect to API" on Android physical device
**Fix**: Update API URL in `mobile/src/config/api.js` to use your computer's IP address:
```javascript
return 'http://192.168.1.100:3000/api'; // Replace with your IP
```

### Issue: Socket.IO connection fails
**Fix**: 
1. Check CORS settings in backend
2. Ensure WebSocket is enabled on your server
3. Check firewall settings

### Issue: Location not working
**Fix**:
1. Check permissions in `app.json`
2. Test on physical device (simulators may have issues)
3. Ensure location services are enabled on device

### Issue: Database locked errors
**Fix**: 
- SQLite doesn't handle concurrent writes well
- Consider migrating to PostgreSQL for production

## Monitoring

Set up monitoring for:
- Server uptime
- API response times
- Error rates
- Database performance
- Socket.IO connection counts

Consider using:
- PM2 for process management
- Sentry for error tracking
- LogRocket or similar for logging

