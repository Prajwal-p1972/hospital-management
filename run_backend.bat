@echo off
title Nexora HMS - Backend Server
cd /d "%~dp0HospitalManagementSystem\HospitalManagementSystem\hms-backend"
echo ===================================================
echo Starting Nexora HMS Laravel Backend on http://127.0.0.1:8000
echo ===================================================
php artisan serve --host=127.0.0.1 --port=8000
pause
