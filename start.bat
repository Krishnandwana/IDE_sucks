@echo off
echo ==========================================
echo CipherStudio - Starting Application
echo ==========================================
echo.

REM Check if node_modules exist
if not exist "frontend\node_modules" (
    echo ERROR: Frontend dependencies not installed!
    echo Please run 'install.bat' first.
    echo.
    pause
    exit /b 1
)

if not exist "backend\node_modules" (
    echo WARNING: Backend dependencies not installed!
    echo Frontend will work with localStorage only.
    echo Run 'install.bat' to enable backend features.
    echo.
    echo Starting frontend only...
    timeout /t 3
    goto FRONTEND_ONLY
)

echo Starting both Frontend and Backend...
echo.
echo Frontend will run on: http://localhost:3000
echo Backend will run on:  http://localhost:5000
echo.
echo Press Ctrl+C in any window to stop the servers
echo.

REM Start backend in new window
start "CipherStudio Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3

REM Start frontend in new window
start "CipherStudio Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Close this window or press any key to exit.
pause
exit

:FRONTEND_ONLY
start "CipherStudio Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Frontend is starting...
echo Close this window or press any key to exit.
pause
