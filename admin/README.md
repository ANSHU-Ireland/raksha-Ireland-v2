# Raksha Ireland Admin Panel

Next.js web application for admin user management.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. Start development server:
```bash
npm run dev
```

4. Open `http://localhost:3000` (or next available port)

## Features

- Admin login
- View pending user registrations
- Approve/reject users
- View all users
- Statistics dashboard
- Email notifications on approval/rejection

## Default Admin

- Email: `admin@raksha.ie`
- Password: `admin123`

## Building for Production

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel, Netlify, or any Node.js hosting service.

