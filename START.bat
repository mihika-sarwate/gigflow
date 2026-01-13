@echo off
echo ================================================
echo    GigFlow - Starting Development Servers
echo ================================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend Server...
echo.
start cmd /k "cd /d %~dp0server && echo Backend Server Starting... && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
echo.
start cmd /k "cd /d %~dp0client && echo Frontend Server Starting... && npm run dev"

echo.
echo ================================================
echo Servers are starting in separate windows...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
echo ================================================
pause >nul
