FROM node:20-alpine AS nodebuild
WORKDIR /app
COPY package*.json ./
COPY vite.config.js tailwind.config.js postcss.config.js ./
COPY resources ./resources
RUN npm ci && npm run build

FROM composer:2 AS composerbuild
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
COPY . .
RUN composer dump-autoload --optimize

FROM webdevops/php-nginx:8.3
ENV WEB_DOCUMENT_ROOT=/app/public
WORKDIR /app
COPY --from=composerbuild /app /app
COPY --from=nodebuild /app/public/build /app/public/build
RUN chown -R application:application /app/storage /app/bootstrap/cache

EXPOSE 80
