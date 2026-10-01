# 🏥 Nexora HMS - Enterprise Hospital Management System

A full-stack, enterprise-grade Hospital Management System (CareOS) built with **React 19 (Vite + TypeScript)** and **Laravel 12 (PHP 8.4 + MySQL 8.0)**. Fully containerized with Docker for 1-command setup on any operating system (Windows, macOS, Linux).

---

## 🚀 Quick Start with Docker (Recommended for Colleagues)

No need to manually install PHP, Composer, Node.js, or MySQL! Docker handles the entire stack, dependencies, migrations, and database seeders automatically.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
  - *Windows note:* Make sure WSL 2 is installed (open PowerShell as Admin and run `wsl --install` if prompted).

### 2. Launch the Application
Open a terminal in the root project directory (`Hospital-Hruta`) and run:

```bash
docker compose up --build
```

*(On older Docker versions, you can also use `docker-compose up --build`)*

### 3. What Happens Automatically:
1. **MySQL 8.0** starts and initializes the `hospital_management` database with healthchecks.
2. **Laravel Backend** waits for MySQL to be ready, installs composer packages, applies database migrations, seeds the database with roles, admin users, doctors, and sample patients, and starts on port `8000`.
3. **React Frontend** installs npm packages, links to the backend API via proxy, and starts on port `5173`.

### 4. Access the Application
- 🌐 **Frontend (Web Application):** [http://localhost:5173](http://localhost:5173)
- 🔌 **Backend API:** [http://localhost:8000/api](http://localhost:8000/api)
- 🗄️ **MySQL Database:** `localhost:3306` (User: `root`, Password: `password123`)

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access / Permissions |
|---|---|---|---|
| **System Administrator** | `admin@hospital.com` | `password123` | Full access, user management, audit logs, analytics |
| **Doctor (Cardiology)** | `doctor@hospital.com` | `password123` | OPD consultations, prescriptions, doctor queue, diagnoses |
| **Doctor (Neurology)** | `sarah.connor@hospital.com` | `password123` | Doctor consultations, procedures, investigations |
| **Nurse** | `nurse@hospital.com` | `password123` | Triage, emergency admissions, bed board, vitals |
| **Receptionist** | `receptionist@hospital.com` | `password123` | Patient registration, inquiries, appointment booking |
| **Pharmacist** | `pharmacist@hospital.com` | `password123` | Pharmacy dispensary, medications, inventory |

---

## 🛑 Useful Docker Commands

- **Stop all services:**
  ```bash
  docker compose down
  ```
- **Stop and wipe database (fresh start):**
  ```bash
  docker compose down -v
  ```
- **View logs for a specific service:**
  ```bash
  docker compose logs -f backend
  docker compose logs -f frontend
  docker compose logs -f mysql
  ```
- **Re-run database seeders inside the container:**
  ```bash
  docker compose exec backend php artisan db:seed --force
  ```

---

## 💻 Manual Setup (Without Docker)

If you prefer to run services natively on your local machine:

### 1. Requirements
- PHP 8.4+ with `pdo_mysql`, `mbstring`, `bcmath`, `gd`, `zip` extensions enabled.
- Composer 2+
- Node.js 20+ and npm
- Local MySQL instance running on port 3306

### 2. Configure Backend
1. Open `HospitalManagementSystem/HospitalManagementSystem/hms-backend/.env`
2. Configure your MySQL credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hospital_management
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   ```
3. Install dependencies, migrate, and seed:
   ```bash
   cd "HospitalManagementSystem/HospitalManagementSystem/hms-backend"
   composer install
   php artisan migrate:fresh --seed
   php artisan serve --host=127.0.0.1 --port=8000
   ```

### 3. Configure Frontend
Open a second terminal:
```bash
cd "nexora hospital/nexora hospital"
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Repository Structure

```
Hospital-Hruta/
├── docker-compose.yml              # Multi-container orchestration (MySQL + Backend + Frontend)
├── README.md                       # Main project documentation
├── SETUP_INSTRUCTIONS.md           # Step-by-step setup instructions
├── HospitalManagementSystem/       # Laravel 12 Backend API
│   └── HospitalManagementSystem/
│       └── hms-backend/
│           ├── Dockerfile          # PHP 8.4 container definition
│           ├── docker-entrypoint.sh# Auto-wait, migrate, seed, and boot script
│           ├── .dockerignore       # Build context exclusion
│           ├── app/                # Models, Controllers, Middleware
│           ├── routes/             # API routes
│           └── database/           # Migrations and seeders
└── nexora hospital/                # React 19 + Vite Frontend
    └── nexora hospital/
        ├── Dockerfile              # Node 20 container definition
        ├── .dockerignore           # Build context exclusion
        ├── vite.config.ts          # Vite proxy & network bindings
        └── src/                    # React views, components, contexts, services
```
