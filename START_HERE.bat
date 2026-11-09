@echo off
cd /d "%~dp0"
echo Starting BookNest (2 Spring Boot services + PostgreSQL + React)...
where docker >nul 2>nul
if errorlevel 1 (
  echo Docker was not found. Install and open Docker Desktop first.
  pause
  exit /b 1
)
docker compose up --build -d
if errorlevel 1 (
  echo Could not start the project. Check Docker Desktop and the log messages above.
  pause
  exit /b 1
)
echo.
echo BookNest started. Open http://localhost:5173
start "" "http://localhost:5173"
pause
