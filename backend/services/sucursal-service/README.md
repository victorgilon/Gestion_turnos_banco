# Sucursal Service - Sistema de Gestión de Turnos

Este microservicio es el encargado de la gestión integral de las sucursales de la organización. Su responsabilidad principal dentro de la arquitectura es proveer las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para los establecimientos físicos donde se atenderán los turnos.

## Arquitectura y Patrones

Este servicio está construido siguiendo el patrón **MVC (Modelo-Vista-Controlador)** adaptado para APIs REST (sin la capa de Vista, delegando la presentación al Frontend):

- **Modelos**: Estructura de datos e interacción con la base de datos (DB-Sucursales).
- **Controladores**: Lógica de negocio y procesamiento de las peticiones.
- **Rutas**: Definición de los endpoints que exponen las funcionalidades del controlador.

## Tecnologías Utilizadas

- **Node.js & Express**: Entorno de ejecución y framework web para la API REST.
- **Mongoose**: ODM para la conexión y modelado de datos con MongoDB.
- **Babel**: Transpilador para utilizar sintaxis moderna de JavaScript (ES6+).
- **Morgan & Helmet**: Middlewares para registro de peticiones HTTP y seguridad de cabeceras.

## Requisitos Previos

Asegúrate de estar ubicado en la raíz del proyecto antes de comenzar. La ruta de este servicio es:
`cd backend/services/sucursal-service`

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
