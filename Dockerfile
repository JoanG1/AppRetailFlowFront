# Etapa 1: Build con Node
FROM node:22.1.0-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install --global vite

COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:1.25.4-alpine

# Copiar el build al html público de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


