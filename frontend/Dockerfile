FROM node:20-alpine 

WORKDIR /app

# ติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build แอพ
RUN npm run build

# --- ให้สิทธิ์ User 0 และ root group ---
RUN chgrp -R 0 /app && \
    chmod -R g=u /app

EXPOSE 3000

# ใช้ Start Command
CMD ["npm", "start"]