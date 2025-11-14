# Raksha Ireland Backend API

Node.js/Express backend server for the Emergency SOS System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - `PORT`: Server port (default: 3000)
   - `JWT_SECRET`: Secret key for JWT tokens
   - `APP_URL`: Frontend URL for email links
   - `SMTP_*`: Email configuration (optional)

4. Start server:
```bash
npm start
# or for development
npm run dev
```

## Default Admin

- Email: `admin@raksha.ie`
- Password: `admin123`

**Change this in production!**

## Database

Uses SQLite by default. Database file: `raksha.db`

To migrate to PostgreSQL/MySQL:
1. Install appropriate database driver
2. Update `database.js` with connection settings
3. Update SQL queries if needed

## API Documentation

See main README.md for API endpoints.

## Email Service

If SMTP is not configured, emails are logged to console for development.

## Socket.IO

Real-time SOS alerts are sent via Socket.IO to connected clients.

