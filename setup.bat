@echo off
REM Raksha Ireland v2 - Windows Setup Script
REM This script sets up the entire project for development and deployment

echo 🚀 Setting up Raksha Ireland v2...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [INFO] Node.js version: 
node --version

REM Create environment files from examples
echo [INFO] Setting up environment files...

if not exist .env (
    copy .env.example .env
    echo [WARNING] Please update .env with your Firebase configuration
)

if not exist mobile\.env (
    copy .env.example mobile\.env
    echo [WARNING] Please update mobile\.env with your Firebase configuration
)

if not exist admin\.env.local (
    copy admin\.env.example admin\.env.local
    echo [WARNING] Please update admin\.env.local with your Firebase configuration
)

if exist backend\.env.example (
    if not exist backend\.env (
        copy backend\.env.example backend\.env
        echo [WARNING] Please update backend\.env with your configuration
    )
)

REM Install root dependencies
echo [INFO] Installing root dependencies...
call npm install

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install mobile dependencies
echo [INFO] Installing mobile dependencies...
cd mobile
call npm install
cd ..

REM Install admin dependencies
echo [INFO] Installing admin dependencies...
cd admin
call npm install
cd ..

REM Install global dependencies
echo [INFO] Installing global dependencies...

REM Check and install Expo CLI
expo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing Expo CLI...
    call npm install -g @expo/cli
) else (
    echo [INFO] Expo CLI already installed ✓
)

REM Check and install EAS CLI
eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing EAS CLI...
    call npm install -g eas-cli
) else (
    echo [INFO] EAS CLI already installed ✓
)

REM Setup complete message
echo [INFO] Setup complete! Next steps:
echo.
echo 1. Configure environment variables:
echo    - Update .env files with your Firebase configuration
echo    - Update mobile/eas.json with your Apple Developer details
echo.
echo 2. Start development:
echo    - Backend: cd backend && npm start
echo    - Mobile: cd mobile && npm start
echo    - Admin: cd admin && npm run dev
echo.
echo 3. Build for production:
echo    - Mobile: cd mobile && npm run build:all
echo    - Admin: cd admin && npm run build
echo.
echo 4. Deploy:
echo    - Follow the deployment guides in SETUP.md
echo.
echo [INFO] Happy coding! 🎉

pause