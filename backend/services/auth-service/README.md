# Auth Service - Sistema de Gestión de Turnos

Este microservicio es el encargado de gestionar la seguridad del sistema. Su responsabilidad principal dentro de la arquitectura es el registro de usuarios, la autenticación (login) y la generación/validación de tokens JWT.

## Tecnologías Utilizadas

- **Node.js & Express**: Entorno de ejecución y framework web.
- **Mongoose**: ODM para la conexión y modelado de datos con MongoDB.
- **Bcryptjs**: Encriptación de contraseñas.
- **JSON Web Token (JWT)**: Generación de credenciales de acceso seguras.
- **Babel**: Transpilador para utilizar sintaxis moderna de JavaScript (ES6+).
- **Morgan & Helmet**: Middlewares para registro de peticiones HTTP y seguridad de cabeceras.

## Requisitos Previos

Asegúrate de estar ubicado en la raíz del proyecto antes de comenzar. La ruta de este servicio es:
`cd backend/services/auth-service`

## Instalación y Configuración

1. **Inicializar el proyecto Node.js** (si aún no tiene el `package.json`):

    ```bash
    npm init -y

    ```

2. **Instalación de dependencias** Para instalar todas las dependencias necesarias del proyecto (si ya existe el package.json), ejecuta:

    ```bash
    npm install

    ```

3. **Manualmente** O si necesitas instalar las dependencias manualmente desde cero:

    ```bash
    npm i express dotenv mongoose morgan helmet
    npm i -D nodemon @babel/core @babel/cli @babel/node @babel/preset-env

    ```

4. **Scripts de Ejecución**
