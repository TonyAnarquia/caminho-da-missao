#!/bin/sh
set -e

mkdir -p /app/storage/app/public \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/storage/logs
mkdir -p /tmp/views

chown -R application:application /app/storage /app/bootstrap/cache || true

if [ ! -e /app/public/storage ]; then
    ln -s /app/storage/app/public /app/public/storage || true
fi

php artisan config:clear >/dev/null 2>&1 || true
php artisan route:clear >/dev/null 2>&1 || true
php artisan view:clear >/dev/null 2>&1 || true
