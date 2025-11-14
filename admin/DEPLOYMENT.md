# Deployment configuration for multiple platforms

# Vercel
To deploy to Vercel:
1. Install Vercel CLI: npm i -g vercel
2. Login: vercel login
3. Deploy: npm run deploy:vercel

# Netlify
To deploy to Netlify:
1. Install Netlify CLI: npm i -g netlify-cli
2. Login: netlify login
3. Deploy: npm run deploy:netlify

# Firebase Hosting
To deploy to Firebase:
1. Install Firebase CLI: npm i -g firebase-tools
2. Login: firebase login
3. Initialize: firebase init hosting
4. Deploy: npm run deploy:firebase

# GitHub Pages
To deploy to GitHub Pages:
1. Push to main branch
2. Go to repository settings
3. Enable GitHub Pages from Actions
4. Use the deploy workflow

# Heroku
To deploy to Heroku:
1. Install Heroku CLI
2. Create app: heroku create raksha-admin
3. Push: git push heroku main

## Environment Variables
Make sure to set the following environment variables in your deployment platform:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- NEXT_PUBLIC_API_URL