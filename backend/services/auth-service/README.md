=====================================================

## 1. INICIALIZAR PROYECTO NODE

=====================================================

Este comando crea el archivo package.json del proyecto:

npm init -y

=====================================================

## 2. CONFIGURACIÓN AUTH-SERVICE

=====================================================

### 0. Entrada a esta carpeta para instalar configuraciones

cd backend/services/auth-service

### 1. Ir al directorio del servicio:

cd backend/services/auth-service

### 2. Inicializar proyecto:

npm init -y

### 3. Instalar dependencias principales:

npm i express bcryptjs cors dotenv jsonwebtoken mongoose

### 4. Instalar dependencia de desarrollo:

npm install -D nodemon

### 5. Compilar (si se usa Babel):

npm run build

=====================================================

## 3. RECOMENDACIÓN (BUENA PRÁCTICA)

=====================================================
Para evitar instalar dependencias una por una, se recomienda:

npm i express bcryptjs cors dotenv jsonwebtoken mongoose morgan helmet
npm i -D nodemon @babel/core @babel/cli @babel/node @babel/preset-env

=====================================================

## 4. NAVEGACIÓN A CARPETAS SRC

=====================================================

cd backend/services/auth-service/src

npm run dev

=====================================================

## 5. RESUMEN ARQUITECTÓNICO DEL SISTEMA

=====================================================

- auth-service:
  Maneja registro de usuarios, login y generación de tokens JWT.
