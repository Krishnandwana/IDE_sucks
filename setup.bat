@echo off
title CipherStudio Setup Wizard
color 0A

:MENU
cls
echo.
echo  ========================================
echo   CipherStudio - Setup Wizard
echo  ========================================
echo.
echo  What would you like to do?
echo.
echo  [1] Install Dependencies
echo  [2] Start Application (Frontend + Backend)
echo  [3] Start Frontend Only
echo  [4] Start Backend Only
echo  [5] Build for Production
echo  [6] Setup Backend Environment
echo  [7] Exit
echo.
echo  ========================================
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto START_ALL
if "%choice%"=="3" goto START_FRONTEND
if "%choice%"=="4" goto START_BACKEND
if "%choice%"=="5" goto BUILD
if "%choice%"=="6" goto SETUP_ENV
if "%choice%"=="7" goto EXIT
goto MENU

:INSTALL
cls
echo.
echo  Installing Dependencies...
echo  ========================================
call install.bat
pause
goto MENU

:START_ALL
cls
echo.
echo  Starting Frontend and Backend...
echo  ========================================
call start.bat
goto MENU

:START_FRONTEND
cls
echo.
echo  Starting Frontend Only...
echo  ========================================
call start-frontend.bat
goto MENU

:START_BACKEND
cls
echo.
echo  Starting Backend Only...
echo  ========================================
call start-backend.bat
goto MENU

:BUILD
cls
echo.
echo  Building for Production...
echo  ========================================
call build.bat
pause
goto MENU

:SETUP_ENV
cls
echo.
echo  ========================================
echo   Backend Environment Setup
echo  ========================================
echo.

if exist "backend\.env" (
    echo  WARNING: backend\.env already exists!
    set /p overwrite="Overwrite existing file? (y/n): "
    if /i not "%overwrite%"=="y" goto MENU
)

echo.
echo  Creating backend\.env file...
echo.

set /p mongodb_uri="Enter MongoDB URI (or press Enter for local): "
if "%mongodb_uri%"=="" set mongodb_uri=mongodb://localhost:27017/cipherstudio

set /p jwt_secret="Enter JWT Secret (or press Enter to generate): "
if "%jwt_secret%"=="" (
    echo Generating random JWT secret...
    set jwt_secret=cipherstudio-secret-key-%RANDOM%%RANDOM%
)

set /p port="Enter Backend Port (default 5000): "
if "%port%"=="" set port=5000

(
echo PORT=%port%
echo MONGODB_URI=%mongodb_uri%
echo JWT_SECRET=%jwt_secret%
echo NODE_ENV=development
echo.
echo # AWS S3 Configuration ^(Optional^)
echo # AWS_ACCESS_KEY_ID=your-access-key
echo # AWS_SECRET_ACCESS_KEY=your-secret-key
echo # AWS_REGION=us-east-1
echo # AWS_BUCKET_NAME=cipherstudio-files
) > backend\.env

echo.
echo  ========================================
echo   Success! Created backend\.env
echo  ========================================
echo.
echo   Configuration:
echo   - Port: %port%
echo   - MongoDB: %mongodb_uri%
echo   - JWT Secret: ******* (hidden)
echo.
pause
goto MENU

:EXIT
cls
echo.
echo  Thank you for using CipherStudio!
echo  ========================================
echo.
timeout /t 2
exit

:ERROR
echo.
echo  An error occurred!
pause
goto MENU
