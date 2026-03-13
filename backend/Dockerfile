FROM php:8.2-cli

WORKDIR /var/www/html

# ติดตั้ง System Dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev  \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 8000

# รัน Server
CMD php artisan serve --host=0.0.0.0 --port=8000