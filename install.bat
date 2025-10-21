@echo off
echo ==========================================
echo CipherStudio - Installing Dependencies
echo ==========================================
echo.

echo [1/2] Installing Frontend Dependencies...
cd frontend
if exist package.json (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Frontend installation failed!
        pause
        exit /b 1
    )
    echo Frontend dependencies installed successfully!
) else (
    echo ERROR: frontend/package.json not found!
    pause
    exit /b 1
)

echo.
echo [2/2] Installing Backend Dependencies...
cd ..\backend
if exist package.json (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Backend installation failed!
        pause
        exit /b 1
    )
    echo Backend dependencies installed successfully!
) else (
    echo ERROR: backend/package.json not found!
    pause
    exit /b 1
)

cd ..
echo.
echo ==========================================
echo Installation Complete!
echo ==========================================
echo.
echo To run the application:
echo   - Run 'start.bat' to start both frontend and backend
echo   - Or run 'start-frontend.bat' for frontend only
echo   - Or run 'start-backend.bat' for backend only
echo.
pause
