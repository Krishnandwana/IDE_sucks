@echo off
echo ==========================================
echo CipherStudio - Starting Frontend Only
echo ==========================================
echo.

if not exist "frontend\node_modules" (
    echo ERROR: Frontend dependencies not installed!
    echo Please run 'install.bat' first.
    echo.
    pause
    exit /b 1
)

echo Starting Frontend Development Server...
echo.
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cd frontend
npm run dev
