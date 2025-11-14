#!/bin/bash

# Raksha Ireland v2 - Complete Setup Script
# This script sets up the entire project for development and deployment

echo "🚀 Setting up Raksha Ireland v2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$node_version" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v) ✓"

# Create environment files from examples
print_status "Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    print_warning "Please update .env with your Firebase configuration"
fi

if [ ! -f mobile/.env ]; then
    cp .env.example mobile/.env
    print_warning "Please update mobile/.env with your Firebase configuration"
fi

if [ ! -f admin/.env.local ]; then
    cp admin/.env.example admin/.env.local
    print_warning "Please update admin/.env.local with your Firebase configuration"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env 2>/dev/null || echo "Backend .env.example not found, skipping..."
    print_warning "Please update backend/.env with your configuration"
fi

# Install root dependencies
print_status "Installing root dependencies..."
npm install

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install mobile dependencies
print_status "Installing mobile dependencies..."
cd mobile
npm install
cd ..

# Install admin dependencies
print_status "Installing admin dependencies..."
cd admin
npm install
cd ..

# Install global dependencies
print_status "Installing global dependencies..."

# Check and install Expo CLI
if ! command -v expo &> /dev/null; then
    print_status "Installing Expo CLI..."
    npm install -g @expo/cli
else
    print_status "Expo CLI already installed ✓"
fi

# Check and install EAS CLI
if ! command -v eas &> /dev/null; then
    print_status "Installing EAS CLI..."
    npm install -g eas-cli
else
    print_status "EAS CLI already installed ✓"
fi

# Setup mobile app configuration
print_status "Setting up mobile app configuration..."
cd mobile

# Check if app.json has the correct project ID
if grep -q "your-eas-project-id" app.json; then
    print_warning "Please update the EAS project ID in mobile/app.json"
fi

# Check if eas.json has the correct configuration
if grep -q "your-apple-id" eas.json; then
    print_warning "Please update the Apple ID configuration in mobile/eas.json"
fi

cd ..

# Setup Firebase configuration reminder
print_status "Firebase Setup Checklist:"
echo "  1. Create a Firebase project at https://console.firebase.google.com"
echo "  2. Enable Authentication (Email/Password)"
echo "  3. Enable Firestore Database"
echo "  4. Enable Cloud Messaging"
echo "  5. Get your Firebase configuration and update the .env files"
echo ""

# Setup Apple Developer Account reminder
print_status "Apple Developer Account Setup:"
echo "  1. Enroll in Apple Developer Program (\$99/year)"
echo "  2. Create certificates and provisioning profiles"
echo "  3. Update mobile/eas.json with your Apple ID and Team ID"
echo ""

# Setup Google Play Console reminder
print_status "Google Play Console Setup:"
echo "  1. Create Google Play Developer account (\$25 one-time)"
echo "  2. Create a new app in Google Play Console"
echo "  3. Configure app details and store listing"
echo ""

# Display next steps
print_status "Setup complete! Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Update .env files with your Firebase configuration"
echo "   - Update mobile/eas.json with your Apple Developer details"
echo ""
echo "2. Start development:"
echo "   - Backend: cd backend && npm start"
echo "   - Mobile: cd mobile && npm start"
echo "   - Admin: cd admin && npm run dev"
echo ""
echo "3. Build for production:"
echo "   - Mobile: cd mobile && npm run build:all"
echo "   - Admin: cd admin && npm run build"
echo ""
echo "4. Deploy:"
echo "   - Follow the deployment guides in SETUP.md"
echo ""

print_status "Happy coding! 🎉"