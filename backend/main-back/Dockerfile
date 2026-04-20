FROM php:8.4-fpm

ENV DEBIAN_FRONTEND=noninteractive
ENV COMPOSER_ALLOW_SUPERUSER=1

# Minimal, reliable dependencies for Laravel 11
RUN apt-get update && apt-get install -y \
	git \
	unzip \
	zip \
	libzip-dev \
	zlib1g-dev \
	libpng-dev \
	libjpeg-dev \
	libfreetype6-dev \
	libonig-dev \
	libxml2-dev \
	libpq-dev \
	ca-certificates \
	&& docker-php-ext-configure gd --with-freetype --with-jpeg \
	&& docker-php-ext-install -j$(nproc) pdo_pgsql mbstring zip exif pcntl bcmath gd \
	&& rm -rf /var/lib/apt/lists/*

# Bring Composer into the image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy all sources and install dependencies (simple single-step approach)
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --no-progress

# Ensure writable dirs
RUN chown -R www-data:www-data storage bootstrap/cache \
	&& chmod -R 775 storage bootstrap/cache \ 
	&& chown -R www-data:www-data /var/www/html/storage/app/public \  
	&& chmod -R 755 /var/www/html/storage/app/public 

RUN composer dump-autoload

RUN php artisan storage:link

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
# CMD ["php-fpm"]
