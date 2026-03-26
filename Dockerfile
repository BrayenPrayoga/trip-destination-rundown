FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY resources ./resources
COPY public ./public
COPY vite.config.js postcss.config.js tailwind.config.js ./
RUN npm run build

FROM php:8.4-cli-alpine AS app
WORKDIR /var/www/html

RUN apk add --no-cache bash git unzip libzip-dev icu-dev oniguruma-dev sqlite sqlite-dev \
    && docker-php-ext-install pdo pdo_sqlite mbstring intl zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader
COPY --from=frontend-builder /app/public/build ./public/build

RUN rm -f .env \
    && cp .env.example .env \
    && mkdir -p database storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache database

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER www-data

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
