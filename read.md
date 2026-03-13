HOW to run on local 

# 1. รัน Container
docker-compose up -d

# 2. สั่ง Migrate Database
docker exec -it todo-app-local php /var/www/html/artisan migrate --force

# -------------------------------------------------------------
# HOW TO BUILD & PUSH TO DOCKER HUB
# -------------------------------------------------------------

# 1. Login เข้า Docker Hub (ทำครั้งแรกครั้งเดียว)
docker login

# 2. Build Image (ตั้งชื่อ Image ให้ตรงกับ username/project ของคุณ)
# รูปแบบ: docker build -t <dockerhub-username>/<image-name>:<tag> .
docker build -t centuryxd/todo-app:latest .

# 3. Push Image ขึ้น Docker Hub
docker push centuryxd/todo-app:latest