FROM webdevops/php-nginx:8.3 AS base
ENV WEB_DOCUMENT_ROOT=/app/public
WORKDIR /app

FROM node:20-alpine AS nodebuild
WORKDIR /app
COPY package*.json ./
COPY vite.config.js tailwind.config.js postcss.config.js ./
COPY resources ./resources
RUN npm ci && npm run build

FROM composer:2 AS composerbuild
ENV COMPOSER_ALLOW_SUPERUSER=1
WORKDIR /app
RUN apk add --no-cache git unzip
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
COPY . .
RUN composer dump-autoload --optimize \
    && if [ ! -f .env ]; then cp .env.example .env; fi \
    && php artisan key:generate --force

FROM base
COPY --from=composerbuild /app /app
COPY --from=nodebuild /app/public/build /app/public/build
RUN ln -s /app/storage/app/public /app/public/storage \
    && chown -R application:application /app/storage /app/bootstrap/cache

EXPOSE 80
