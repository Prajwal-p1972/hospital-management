@echo off
title Nexora HMS - Database Setup
cd /d "%~dp0HospitalManagementSystem\HospitalManagementSystem\hms-backend"
echo ===================================================
echo Setting up Nexora HMS Database (Migrations + Seeders)...
echo Make sure MySQL is running and database 'hospital_management' is created!
echo ===================================================
call php artisan migrate:fresh --seed
echo.
echo Database setup complete!
pause
