@echo off
cd /d "%~dp0"
echo Starting 2D Fishing Game...
echo Current directory: %cd%
echo.
echo Checking if Node.js is installed...
node --version
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo.
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies
    pause
    exit /b 1
)
echo.
echo Starting development server...
echo.
echo KEEP THIS WINDOW OPEN - Server is running
echo Game will open at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
start /min cmd /k "timeout /t 5 /nobreak >nul && start http://localhost:5173"
npm run dev