# Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- For mobile app: Expo CLI (`npm install -g expo-cli`) or Expo Go app on your phone

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (optional: add email config)
npm start
```

Backend will run on `http://localhost:3000`

**Default Admin Login:**
- Email: `admin@raksha.ie`
- Password: `admin123`

### 2. Admin Panel Setup (2 minutes)

```bash
cd admin
npm install
# Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:3000/api
npm run dev
```

Admin panel will run on `http://localhost:3001` (or next available port)

### 3. Mobile App Setup (3 minutes)

```bash
cd mobile
npm install
# Update src/config/api.js with your computer's IP address
# Example: http://192.168.1.100:3000/api
npm start
```

Scan QR code with Expo Go app on your phone.

**Finding your IP address:**
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

## Testing the System

1. **Register a user:**
   - Open mobile app
   - Fill registration form
   - Submit

2. **Approve user:**
   - Login to admin panel (`admin@raksha.ie` / `admin123`)
   - Find pending user
   - Click "Approve"
   - User will receive email (or check console if email not configured)

3. **Set password:**
   - User clicks link in email (or manually navigate to SetPassword screen)
   - Sets password

4. **Login:**
   - User logs in with email and password

5. **Send SOS:**
   - User holds SOS button for 3 seconds
   - Alert sent to nearby users (within 3km)

## Troubleshooting

### Mobile app can't connect to backend
- Make sure backend is running
- Check API URL in `mobile/src/config/api.js`
- Use your computer's IP address, not `localhost`
- Ensure phone and computer are on same network
- Check firewall settings

### Email not working
- Email service is optional
- If SMTP not configured, emails are logged to console
- Check backend console for email content

### Database issues
- Database is created automatically on first run
- If issues occur, delete `backend/raksha.db` and restart server

## Production Deployment

See main README.md for production deployment instructions.

