# Imagen base
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias primero (optimiza cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

RUN npm run build

# Puerto (opcional, este servicio no expone HTTP)
EXPOSE 3004

# Comando de inicio
CMD ["npm","start"]