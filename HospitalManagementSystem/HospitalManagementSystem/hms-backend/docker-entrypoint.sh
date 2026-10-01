#!/bin/bash
set -e

echo "==> Preparing storage and cache directories..."
mkdir -p /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/framework/cache \
         /var/www/storage/logs \
         /var/www/bootstrap/cache \
         /var/www/database

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database || true

# Auto-detect Railway MySQL variables
if [ -n "$MYSQLHOST" ]; then
    export DB_HOST="$MYSQLHOST"
fi
if [ -n "$MYSQLPORT" ]; then
    export DB_PORT="$MYSQLPORT"
fi
if [ -n "$MYSQLDATABASE" ]; then
    export DB_DATABASE="$MYSQLDATABASE"
fi
if [ -n "$MYSQLUSER" ]; then
    export DB_USERNAME="$MYSQLUSER"
fi
if [ -n "$MYSQLPASSWORD" ]; then
    export DB_PASSWORD="$MYSQLPASSWORD"
fi

# Fallback defaults
export DB_CONNECTION="${DB_CONNECTION:-mysql}"
export DB_HOST="${DB_HOST:-127.0.0.1}"
export DB_PORT="${DB_PORT:-3306}"
export DB_DATABASE="${DB_DATABASE:-hospital_management}"
export DB_USERNAME="${DB_USERNAME:-root}"
export DB_PASSWORD="${DB_PASSWORD:-password123}"

echo "==> Testing database connection to ${DB_HOST}:${DB_PORT} (DB: ${DB_DATABASE}, User: ${DB_USERNAME})..."

CONNECTED=0
for i in {1..12}; do
    if php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'), [PDO::ATTR_TIMEOUT => 3]); exit(0); } catch (Exception \$e) { echo 'Attempt ' . \$i . ': ' . \$e->getMessage() . PHP_EOL; exit(1); }"; then
        CONNECTED=1
        echo "==> Successfully connected to MySQL database!"
        break
    fi
    echo "Waiting for MySQL database (attempt $i/12)..."
    sleep 2
done

if [ $CONNECTED -eq 0 ]; then
    echo "==> MySQL connection unavailable at ${DB_HOST}:${DB_PORT}."
    echo "==> Switching to SQLite database so the deployed system starts immediately without hanging!"
    touch /var/www/database/database.sqlite
    export DB_CONNECTION=sqlite
    export DB_DATABASE=/var/www/database/database.sqlite
fi

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Seeding roles, admin, and clinical demo data..."
php artisan db:seed --force

echo "==> Starting Nexora HMS backend on 0.0.0.0:${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
