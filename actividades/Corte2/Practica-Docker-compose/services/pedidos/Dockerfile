# Usa una imagen ligera de Node.js
FROM node:18-alpine

# Crea la carpeta de la app dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo de dependencias primero (optimiza la construcción)
COPY package.json ./

# Instala Express (la librería para crear el servidor)
RUN npm install

# Copia el resto de los archivos (el app.js)
COPY . .

# Expone el puerto que usa la app
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["node", "app.js"]