#!/bin/bash
set -e

echo "==> Preparing storage and cache directories..."
mkdir -p /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/framework/cache \
         /var/www/storage/logs \
         /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache || true

echo "==> Waiting for MySQL database connection on ${DB_HOST:-mysql}:${DB_PORT:-3306}..."
until php -r "try { new PDO('mysql:host=' . (getenv('DB_HOST') ?: 'mysql') . ';port=' . (getenv('DB_PORT') ?: '3306') . ';dbname=' . (getenv('DB_DATABASE') ?: 'hospital_management'), getenv('DB_USERNAME') ?: 'root', getenv('DB_PASSWORD') ?: 'password123'); exit(0); } catch (Exception \$e) { exit(1); }"; do
    echo "Waiting for MySQL database to be ready..."
    sleep 2
done

echo "==> Database is reachable! Running migrations..."
php artisan migrate --force

echo "==> Seeding roles, admin account, and sample clinical data..."
php artisan db:seed --force

echo "==> Starting Nexora HMS backend on 0.0.0.0:8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
