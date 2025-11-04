# --- STAGE 1: BUILD (Compilación de la aplicación NestJS) ---
# Usa una imagen de Node.js con Alpine Linux, que es ligera.
FROM node:lts-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor para esta etapa.
WORKDIR /app

# Copia los archivos de definición de dependencias.
# Esto permite a Docker cachear esta capa si package.json no cambia.
COPY package*.json ./

# Instala TODAS las dependencias (producción y desarrollo, necesarias para la compilación).
RUN npm install

# Copia TODO el código fuente de la aplicación (incluyendo tsconfig.json, src/, etc.).
# 'COPY . .' significa: copia todo del directorio actual del host al directorio de trabajo en el contenedor.
COPY . .

# Compila la aplicación NestJS. Esto creará la carpeta 'dist/' dentro de este stage.
RUN npm run build

# --- STAGE 2: PRODUCTION (Creación de la imagen final de solo producción) ---
# Usa la misma imagen base de Node.js, pero esta vez será la imagen final.
FROM node:lts-alpine

# Establece el directorio de trabajo dentro del contenedor para esta etapa.
WORKDIR /app

# Copia solo las dependencias de producción del stage 'builder'.
# Esto hace que la imagen final sea más pequeña.
COPY --from=builder /app/node_modules ./node_modules

# Copia solo el código compilado (la carpeta 'dist/') del stage 'builder'.
COPY --from=builder /app/dist ./dist

# Exponer el puerto en el que la aplicación NestJS escuchará (informativo).
EXPOSE 3001

# Comando para ejecutar la aplicación.
CMD [ "npm", "start:prod" ]