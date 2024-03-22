# Usa la misma base de imagen de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia tus archivos de compilación locales ya generados en /dist a la ubicación correspondiente en el contenedor
COPY dist/ ./dist

# Copia tu package.json y cualquier otro archivo necesario para ejecutar tu servidor express
COPY package*.json ./

# Instala solo las dependencias de producción necesarias para ejecutar tu servidor
RUN npm install --only=production

# Expone el puerto que tu aplicación utilizará
EXPOSE 4000

# Ejecuta el servidor de tu aplicación
CMD ["node", "dist/app/server/main.js"]
