@echo off
title Nexora HMS - Frontend Server
cd /d "%~dp0nexora hospital\nexora hospital"
echo ===================================================
echo Starting Nexora HMS React Frontend on http://localhost:5173
echo ===================================================
if not exist node_modules (
    echo Installing npm dependencies, please wait...
    call npm install
)
call npm run dev
pause
