@echo off
echo ==========================================
echo CipherStudio - Building for Production
echo ==========================================
echo.

echo [1/2] Building Frontend...
cd frontend
if exist package.json (
    call npm run build
    if %errorlevel% neq 0 (
        echo ERROR: Frontend build failed!
        pause
        exit /b 1
    )
    echo Frontend built successfully!
) else (
    echo ERROR: frontend/package.json not found!
    pause
    exit /b 1
)

echo.
echo [2/2] Building Backend...
cd ..\backend
if exist package.json (
    call npm run build
    if %errorlevel% neq 0 (
        echo ERROR: Backend build failed!
        pause
        exit /b 1
    )
    echo Backend built successfully!
) else (
    echo ERROR: backend/package.json not found!
    pause
    exit /b 1
)

cd ..
echo.
echo ==========================================
echo Build Complete!
echo ==========================================
echo.
echo Production builds created:
echo   - Frontend: frontend\.next
echo   - Backend:  backend\dist
echo.
pause
