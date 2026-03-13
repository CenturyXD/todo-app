# --- Stage 1: Build Frontend (Next.js) ---
    FROM node:20-alpine AS frontend-builder
    WORKDIR /app/frontend
    
    COPY frontend/package*.json ./
    RUN npm install
    
    COPY frontend/ ./
    # รับค่า Base URL (ถ้าไม่ใส่จะเป็นค่าว่าง)
    ARG NEXT_PUBLIC_API_BASE_URL=""
    ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
    
    # Build Project (Full Build)
    RUN npm run build 
    
    # --- Stage 2: Build Backend (Laravel) ---
    FROM composer:2 AS backend-builder
    WORKDIR /app/backend
    
    COPY backend/composer.json backend/composer.lock ./
    RUN composer install --no-dev --no-scripts --prefer-dist
    
    COPY backend/ ./
    RUN composer dump-autoload --optimize
    
    # --- Stage 3: Final Image (Nginx + PHP + Node) ---
    FROM php:8.2-fpm-alpine
    
    # Install dependencies
    # สำคัญ: ต้องมี postgresql-dev เพื่อใช้ Compile Extension pdo_pgsql บน Alpine
    RUN apk add --no-cache \
        nginx \
        nodejs \
        npm \
        supervisor \
        postgresql-dev
    
    # Install PHP Extensions สำหรับ PostgreSQL
    RUN docker-php-ext-install pdo pdo_pgsql
    
    # 1. Setup Backend (Laravel)
    WORKDIR /var/www/html
    COPY --from=backend-builder /app/backend /var/www/html
    
    # 2. Setup Frontend (Next.js - Full Source Strategy)
    WORKDIR /var/www/frontend
    
    # Copy package.json สำหรับ install production dependencies
    COPY frontend/package*.json ./
    # Install เฉพาะ production deps (เพื่อลดขนาด image)
    RUN npm install --production
    
    # Copy โค้ดที่ build แล้ว (.next) และ public assets
    COPY --from=frontend-builder /app/frontend/.next ./.next
    COPY --from=frontend-builder /app/frontend/public ./public
    # Copy Config (รองรับทั้ง .js, .ts, .mjs เพื่อความชัวร์)
    COPY --from=frontend-builder /app/frontend/next.config.* ./
    
    # 3. Setup Permissions for OpenShift (Random User ID Support)
    # OCP จะรัน Container ด้วย User แบบสุ่ม แต่จะอยู่ใน Group 0 (Root)
    # เราต้องอนุญาตให้ Group 0 เขียนไฟล์ Cache/Storage ได้ ไม่งั้นจะ Error Permission Denied
    RUN chgrp -R 0 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/frontend/.next && \
        chmod -R g+rwX /var/www/html/storage /var/www/html/bootstrap/cache /var/www/frontend/.next
    
    # Copy Configs
    COPY docker/nginx.conf /etc/nginx/http.d/default.conf
    COPY docker/supervisord.conf /etc/supervisord.conf
    
    EXPOSE 8080
    
    CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]