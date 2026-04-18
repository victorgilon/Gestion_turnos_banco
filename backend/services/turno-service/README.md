# Turno Service - Sistema de Gestión de Turnos

Este microservicio es el motor principal de las reservas del sistema. Su responsabilidad exclusiva dentro de la arquitectura es la creación, consulta, modificación y cancelación de los turnos de los usuarios en las distintas sucursales.

## Arquitectura y Patrones

Este servicio está construido siguiendo el patrón **MVC (Modelo-Vista-Controlador)** adaptado para APIs REST:

- **Modelos**: Estructura de datos e interacción con su base de datos independiente (DB-Turnos).
- **Controladores**: Lógica de negocio, validación de disponibilidad y procesamiento de las peticiones.
- **Rutas**: Definición de los endpoints que exponen las funcionalidades del controlador.

## Tecnologías Utilizadas

- **Node.js & Express**: Entorno de ejecución y framework web para la API REST.
- **Mongoose**: ODM para la conexión y modelado de datos con MongoDB.
- **Axios**: Cliente HTTP basado en promesas, utilizado para la comunicación síncrona con otros microservicios (ej. verificar datos con `sucursal-service` o `auth-service`).
- **Babel**: Transpilador para utilizar sintaxis moderna de JavaScript (ES6+).
- **Morgan & Helmet**: Middlewares para registro de peticiones HTTP y seguridad de cabeceras.

## Requisitos Previos

Asegúrate de estar ubicado en la raíz del proyecto antes de comenzar. La ruta de este servicio es:
`cd backend/services/turno-service`

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
    npm i express dotenv mongoose morgan helmet axios
    npm i -D nodemon @babel/core @babel/cli @babel/node @babel/preset-env
    ```
4. **Scripts de Ejecución**