@echo off
TITLE CSE PathFinder - Java Backend Starter
cls

echo ==================================================
echo    CSE PATHFINDER - JAVA BACKEND STARTER
echo ==================================================
echo.

set JAVA_CMD="C:\Users\priya\.antigravity-ide\extensions\redhat.java-1.56.0-win32-x64\jre\21.0.12.1-win32-x86_64\bin\java.exe"

echo [1/2] Starting Java Backend Server (Port 5000)...
start "CSE Java Backend Server" cmd /c "%JAVA_CMD% -cp backend-java/bin;backend-java/lib/sqlite-jdbc-standalone.jar com.csepathfinder.App"
echo Java Backend started on http://127.0.0.1:5000
echo.

echo [2/2] Starting React Frontend...
cd frontend-react
call npm.cmd run dev

pause
