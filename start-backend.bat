@echo off
echo ==========================================
echo CipherStudio - Starting Backend Only
echo ==========================================
echo.

if not exist "backend\node_modules" (
    echo ERROR: Backend dependencies not installed!
    echo Please run 'install.bat' first.
    echo.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found!
    echo.
    echo Please create backend\.env with the following variables:
    echo   PORT=5000
    echo   MONGODB_URI=your_mongodb_connection_string
    echo   JWT_SECRET=your_secret_key
    echo   NODE_ENV=development
    echo.
    echo You can copy .env.example to .env and update the values.
    echo.
    pause
    exit /b 1
)

echo Starting Backend Development Server...
echo.
echo Backend will run on: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

cd backend
npm run dev
