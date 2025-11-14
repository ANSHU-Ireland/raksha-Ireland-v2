# Troubleshooting Guide

## Common Expo Go Issues on Android

### Issue: App crashes on startup
**Solution**: 
1. Clear Expo Go cache: Settings > Apps > Expo Go > Clear Cache
2. Restart the app
3. If persists, reinstall Expo Go

### Issue: "Cannot connect to API" error
**Solution**: 
1. For Android physical device: Update `mobile/src/config/api.js`:
   ```javascript
   // Replace localhost with your computer's IP
   return 'http://192.168.1.100:3000/api';
   ```
2. Find your IP:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
3. Ensure phone and computer are on the same WiFi network
4. Check firewall allows port 3000

### Issue: "Network request failed"
**Solution**:
1. Check backend is running: `cd backend && npm start`
2. Test API: Open `http://localhost:3000/api/health` in browser
3. For Android emulator, use `http://10.0.2.2:3000/api`
4. For iOS simulator, `http://localhost:3000/api` works

### Issue: Location permission denied
**Solution**:
1. Go to device Settings > Apps > Expo Go > Permissions
2. Enable Location permission
3. Restart the app

### Issue: Socket.IO connection fails
**Solution**:
1. Check backend CORS settings
2. Ensure WebSocket is not blocked by firewall
3. Try using polling transport: Already configured in code

## Backend Issues

### Issue: Database locked
**Solution**:
- SQLite doesn't handle concurrent writes well
- For production, migrate to PostgreSQL
- For development, ensure only one instance is running

### Issue: Port already in use
**Solution**:
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000
# Kill process (replace PID):
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue: JWT_SECRET warning
**Solution**:
- Set a strong JWT_SECRET in `.env` file
- Minimum 32 characters
- Use random string generator

## Testing Steps

### 1. Test Backend
```bash
cd backend
npm install
npm start
# Open http://localhost:3000/api/health
```

### 2. Test Mobile App
```bash
cd mobile
npm install
npm start
# Scan QR code with Expo Go
```

### 3. Test Registration Flow
1. Open app
2. Fill registration form
3. Submit
4. Check backend logs for registration
5. Check admin panel for pending user

### 4. Test SOS Alert
1. Login to app
2. Grant location permission
3. Hold SOS button for 3 seconds
4. Check backend logs
5. Check if other users receive notification

## Debugging Tips

### Enable Debug Logging
In `mobile/src/config/api.js`, the API URL is logged in development mode.

### Check Console Logs
- Mobile: Use Expo DevTools or React Native Debugger
- Backend: Check terminal where server is running

### Test API Endpoints
Use Postman or curl:
```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","age":25,"sex":"Male","county":"Dublin","email":"test@test.com"}'
```

## Production Checklist

Before deploying:
- [ ] Update API URL in mobile app
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Set up email service
- [ ] Test on physical devices
- [ ] Test on both iOS and Android
- [ ] Test SOS alert functionality
- [ ] Test admin approval workflow
- [ ] Set up monitoring
- [ ] Set up backups

