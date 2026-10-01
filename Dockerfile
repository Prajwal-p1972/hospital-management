FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    default-mysql-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required by Laravel
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd zip

# Get latest official Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy backend application files from monorepo path
COPY HospitalManagementSystem/HospitalManagementSystem/hms-backend/ /var/www/

# Fix potential Windows CRLF endings on entrypoint script
RUN sed -i 's/\r$//' /var/www/docker-entrypoint.sh \
    && chmod +x /var/www/docker-entrypoint.sh

# Ensure storage directories exist and have proper permissions
RUN mkdir -p /var/www/storage/framework/sessions \
             /var/www/storage/framework/views \
             /var/www/storage/framework/cache \
             /var/www/storage/logs \
             /var/www/bootstrap/cache \
             /var/www/database \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache /var/www/database

# Install composer dependencies
RUN composer install --no-interaction --no-scripts --no-progress --prefer-dist

EXPOSE 8000

ENTRYPOINT ["/var/www/docker-entrypoint.sh"]
