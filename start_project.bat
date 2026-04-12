@echo off
TITLE CSE PathFinder - ALL-IN-ONE STARTER
cls

echo ==================================================
echo    CSE PATHFINDER - AUTOMATED STARTUP
echo ==================================================
echo.

:: 1. Find Python
echo [1/4] Detecting Python...
set PYTHON_CMD=python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    set PYTHON_CMD=py
    py --version >nul 2>&1
    if %errorlevel% neq 0 (
        set PYTHON_CMD=python3
        python3 --version >nul 2>&1
        if %errorlevel% neq 0 (
            echo [ERROR] Python not found! Please install it from python.org.
            pause
            exit /b
        )
    )
)
echo Found: %PYTHON_CMD%
echo.

:: 2. Install/Check Dependencies
echo [2/4] Verifying Backend dependencies...
%PYTHON_CMD% -m pip install flask flask-cors --quiet
echo Dependencies are ready.
echo.

:: 3. Start Backend in a NEW window
echo [3/4] Starting Backend (Port 5000)...
start "CSE Backend Server" cmd /c "%PYTHON_CMD% backend/app.py"
echo Backend started in a separate window.
echo.

:: 4. Start Frontend in this window
echo [4/4] Starting Frontend (Port 5173)...
echo.
echo ==================================================
echo    THE FRONTEND IS STARTING. 
echo    Keep this window open to see Vite logs.
echo ==================================================
echo.

cd frontend-react
:: Use npm.cmd explicitly to bypass the PowerShell script block issue
call npm.cmd run dev

pause
