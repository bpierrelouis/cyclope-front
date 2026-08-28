FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Runtime
FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY docker/25-api-health-log.sh /docker-entrypoint.d/25-api-health-log.sh
RUN chmod +x /docker-entrypoint.d/25-api-health-log.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
