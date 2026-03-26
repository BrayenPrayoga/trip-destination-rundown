#!/usr/bin/env sh
set -eu

cd /var/www/html

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

if [ "${DB_CONNECTION:-}" = "pgsql" ]; then
  echo "Waiting PostgreSQL at ${DB_HOST:-db}:${DB_PORT:-5432}..."
  php -r '
    $host = getenv("DB_HOST") ?: "db";
    $port = getenv("DB_PORT") ?: "5432";
    $db   = getenv("DB_DATABASE") ?: "travel_jogja";
    $user = getenv("DB_USERNAME") ?: "postgres";
    $pass = getenv("DB_PASSWORD") ?: "";
    $tries = 30;
    while ($tries-- > 0) {
      try {
        new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass, [PDO::ATTR_TIMEOUT => 3]);
        exit(0);
      } catch (Throwable $e) {
        sleep(2);
      }
    }
    fwrite(STDERR, "PostgreSQL is not reachable\n");
    exit(1);
  '
fi

if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --force
fi

php artisan config:clear >/dev/null 2>&1 || true
php artisan migrate --force

exec "$@"
