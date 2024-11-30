# Dockerfile
FROM node:16 as build

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 빌드
COPY . .
RUN npm run build

# Nginx를 사용해 배포
FROM nginx:1.21
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
