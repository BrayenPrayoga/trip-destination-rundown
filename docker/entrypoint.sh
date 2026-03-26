#!/usr/bin/env sh
set -eu

cd /var/www/html

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
  mkdir -p database
  touch database/database.sqlite
fi

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force
fi

php artisan config:clear >/dev/null 2>&1 || true
php artisan migrate --force

exec "$@"
