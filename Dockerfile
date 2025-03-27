# Usa una imagen oficial de Node.js
FROM node:22.14.0-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json* ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Exponer el puerto de Vite (modo desarrollo)
EXPOSE 5173

# Iniciar Vite en desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
