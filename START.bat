@echo off
echo =================================
echo    RAKSHAK - AI Financial Firewall
echo    SANGYAN 2026
echo =================================
echo.
echo Starting Backend (FastAPI)...
start "Rakshak Backend" cmd /k "cd /d e:\RAKSHAK\backend && python main.py"
timeout /t 3 >nul
echo Starting Frontend (React)...
start "Rakshak Frontend" cmd /k "cd /d e:\RAKSHAK\frontend && npm run dev"
echo.
echo Both servers starting...
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo Docs:     http://localhost:8000/docs
echo.
timeout /t 5 >nul
start http://localhost:5173
