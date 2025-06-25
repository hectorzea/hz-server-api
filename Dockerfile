# --- Dockerfile de UNA sola etapa para tu API NestJS ---
FROM node:lts-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar SOLO las dependencias de producción (ya que el código ya está compilado)
RUN npm install --production

# Copiar el código compilado (la carpeta dist/) desde tu contexto de build (tu servidor)
COPY dist ./dist

# Exponer el puerto en el que la aplicación NestJS escuchará (informativo)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "node", "dist/main" ]