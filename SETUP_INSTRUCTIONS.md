# 🏥 Nexora Hospital Management System - Setup & Sharing Guide

This document explains how to send and run this project on any colleague's computer, as well as on your own PC.

---

## 📦 How to Send This Project to Your Colleague

1. **Clean up before zipping:**
   You do **NOT** need to send `node_modules` or `vendor` folders. To save time and keep file size small (a few megabytes instead of gigabytes), you can either:
   - Delete `nexora hospital/nexora hospital/node_modules`
   - Delete `HospitalManagementSystem/HospitalManagementSystem/hms-backend/vendor`
   *(Docker will install them automatically inside the containers anyway!)*

2. **Zip the folder:**
   Zip the entire `Hospital-Hruta` folder and share it with your colleague via Google Drive, OneDrive, USB, or Git.

---

## 🐳 How to Run with Docker (1-Command Run)

### Requirements for your Colleague:
- **Docker Desktop** installed and running on their PC ([Download Docker Desktop](https://www.docker.com/products/docker-desktop/)).
- If on Windows, ensure WSL 2 is installed (open PowerShell as Admin and run `wsl --install`).

### Step-by-Step Instructions:

1. **Open a Terminal / Command Prompt / PowerShell** in the root project folder:
   ```bash
   cd Hospital-Hruta
   ```

2. **Run the stack:**
   ```bash
   docker compose up --build
   ```
   *(Or `docker-compose up --build` on older systems)*

3. **Wait for initialization:**
   - Docker will build the containers.
   - MySQL will start up and become healthy.
   - The backend will automatically apply migrations and seed initial roles, admin users, doctors, and sample patients.
   - The frontend will start the Vite server.

4. **Open in the Browser:**
   - **Frontend App:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)

5. **Log in with any staff role:**
   - **Admin:** `admin@hospital.com` / `password123`
   - **Doctor:** `doctor@hospital.com` / `password123`
   - **Nurse:** `nurse@hospital.com` / `password123`
   - **Receptionist:** `receptionist@hospital.com` / `password123`
   - **Pharmacist:** `pharmacist@hospital.com` / `password123`

---

## 👥 How to Add More Users (New Accounts)

This is a **multi-user system**. You can add new staff or users anytime:

### Method 1: Using Laravel Tinker (Fastest 1-line command)
In the backend folder (`HospitalManagementSystem/HospitalManagementSystem/hms-backend`), run:
```powershell
php artisan tinker --execute="App\Models\User::create(['name'=>'Dr. Emily Stone', 'email'=>'emily@hospital.com', 'password'=>Hash::make('password123'), 'role_id'=>2]);"
```
*(Role IDs: 1 = Admin, 2 = Doctor, 3 = Nurse, 4 = Receptionist, 5 = Pharmacist)*

### Method 2: Via the API
Send a `POST` request to `http://127.0.0.1:8000/api/register`:
```json
{
  "name": "Alex Taylor",
  "email": "alex@hospital.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Method 3: Directly in phpMyAdmin
Open your database in phpMyAdmin, go to the `users` table, and click **Insert**.

---

## 🛠️ How to Run on Your PC Right Now (Without Docker)

If you haven't enabled WSL2 for Docker on your Windows PC yet, you can run the project natively right now using your existing local PHP and Node setup:

### Terminal 1 - Backend:
```powershell
cd "HospitalManagementSystem\HospitalManagementSystem\hms-backend"
C:\php84\php.exe artisan serve --host=127.0.0.1 --port=8000
```

### Terminal 2 - Frontend:
```powershell
cd "nexora hospital\nexora hospital"
npm run dev
```

Open `http://localhost:5173` and log in with:
- **Email:** `admin@hospital.com`
- **Password:** `password123`

---

## ⚙️ Running Docker on Your Own Windows PC

If you also want to run Docker on your own Windows computer:
1. Open **PowerShell as Administrator**.
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer when prompted.
4. Launch **Docker Desktop**.
5. In the `Hospital-Hruta` folder, run:
   ```powershell
   docker compose up --build
   ```
